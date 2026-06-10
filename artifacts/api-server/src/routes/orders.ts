import { Router } from "express";
import { db, ordersTable, usersTable, couponsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import {
  CreateOrderBody,
  UpdateOrderStatusBody,
  UpdateOrderStatusParams,
  GetOrderParams,
  ListAllOrdersQueryParams,
} from "@workspace/api-zod";

const router = Router();

function serializeOrder(order: typeof ordersTable.$inferSelect, customerName?: string | null) {
  return {
    id: order.id,
    userId: order.userId,
    customerName: customerName ?? null,
    items: order.items,
    deliveryAddress: order.deliveryAddress,
    subtotal: parseFloat(order.subtotal),
    deliveryCharge: parseFloat(order.deliveryCharge),
    gst: parseFloat(order.gst),
    couponDiscount: parseFloat(order.couponDiscount),
    total: parseFloat(order.total),
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: order.razorpayPaymentId,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  };
}

// Place an order
router.post("/orders", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { items, deliveryAddress, couponCode, razorpayOrderId, razorpayPaymentId } = parsed.data;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 40;
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  let couponDiscount = 0;

  if (couponCode) {
    const [coupon] = await db.select().from(couponsTable).where(eq(couponsTable.code, couponCode)).limit(1);
    if (coupon && coupon.isActive && subtotal >= parseFloat(coupon.minOrder)) {
      couponDiscount =
        coupon.discountType === "percent"
          ? Math.round(subtotal * (parseFloat(coupon.value) / 100) * 100) / 100
          : Math.min(parseFloat(coupon.value), subtotal);
      await db
        .update(couponsTable)
        .set({ usedCount: sql`${couponsTable.usedCount} + 1` })
        .where(eq(couponsTable.id, coupon.id));
    }
  }

  const total = subtotal + deliveryCharge + gst - couponDiscount;

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId: req.user!.userId,
      items: items as typeof ordersTable.$inferInsert["items"],
      deliveryAddress: deliveryAddress as typeof ordersTable.$inferInsert["deliveryAddress"],
      subtotal: String(subtotal),
      deliveryCharge: String(deliveryCharge),
      gst: String(gst),
      couponDiscount: String(couponDiscount),
      total: String(total),
      couponCode: couponCode ?? null,
      razorpayOrderId: razorpayOrderId ?? null,
      razorpayPaymentId: razorpayPaymentId ?? null,
      status: "Placed",
    })
    .returning();

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
  res.status(201).json(serializeOrder(order, user?.name));
});

// My orders
router.get("/orders/my", requireAuth, async (req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, req.user!.userId))
    .orderBy(desc(ordersTable.createdAt));

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId)).limit(1);
  res.json(orders.map((o) => serializeOrder(o, user?.name)));
});

// All orders (shopkeeper/admin)
router.get("/orders", requireRole("shopkeeper", "admin"), async (req, res): Promise<void> => {
  const parsed = ListAllOrdersQueryParams.safeParse(req.query);
  const filters = parsed.success ? parsed.data : {};

  let allOrders = await db.select({ order: ordersTable, name: usersTable.name })
    .from(ordersTable)
    .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id))
    .orderBy(desc(ordersTable.createdAt));

  if (filters.status) {
    allOrders = allOrders.filter((r) => r.order.status === filters.status);
  }
  if (filters.limit) {
    allOrders = allOrders.slice(0, filters.limit);
  }

  res.json(allOrders.map((r) => serializeOrder(r.order, r.name)));
});

// Get single order
router.get("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const idParsed = GetOrderParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [result] = await db
    .select({ order: ordersTable, name: usersTable.name })
    .from(ordersTable)
    .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id))
    .where(eq(ordersTable.id, idParsed.data.id))
    .limit(1);

  if (!result) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const { order, name } = result;
  if (req.user!.role === "customer" && order.userId !== req.user!.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(serializeOrder(order, name));
});

// Update order status
router.patch("/orders/:id/status", requireRole("shopkeeper", "admin"), async (req, res): Promise<void> => {
  const idParsed = UpdateOrderStatusParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [result] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status as typeof ordersTable.$inferInsert["status"] })
    .where(eq(ordersTable.id, idParsed.data.id))
    .returning();

  if (!result) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, result.userId)).limit(1);
  res.json(serializeOrder(result, user?.name));
});

export default router;
