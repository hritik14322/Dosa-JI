import { Router } from "express";
import { db, couponsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireRole, requireAuth } from "../lib/auth";
import {
  CreateCouponBody,
  UpdateCouponBody,
  UpdateCouponParams,
  DeleteCouponParams,
  ApplyCouponBody,
} from "@workspace/api-zod";

const router = Router();

function serializeCoupon(c: typeof couponsTable.$inferSelect) {
  return {
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    value: parseFloat(c.value),
    minOrder: parseFloat(c.minOrder),
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/coupons", requireRole("admin"), async (_req, res): Promise<void> => {
  const coupons = await db.select().from(couponsTable);
  res.json(coupons.map(serializeCoupon));
});

router.post("/coupons", requireRole("admin"), async (req, res): Promise<void> => {
  const parsed = CreateCouponBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [coupon] = await db
    .insert(couponsTable)
    .values({
      code: d.code.toUpperCase(),
      discountType: d.discountType as "percent" | "flat",
      value: String(d.value),
      minOrder: String(d.minOrder),
      maxUses: d.maxUses,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
      isActive: d.isActive ?? true,
    })
    .returning();
  res.status(201).json(serializeCoupon(coupon));
});

// Apply coupon — public (requires auth to prevent abuse)
router.post("/coupons/apply", requireAuth, async (req, res): Promise<void> => {
  const parsed = ApplyCouponBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { code, orderTotal } = parsed.data;

  const [coupon] = await db.select().from(couponsTable).where(eq(couponsTable.code, code.toUpperCase())).limit(1);
  if (!coupon || !coupon.isActive) {
    res.status(400).json({ error: "Invalid or expired coupon code" });
    return;
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(400).json({ error: "Coupon has expired" });
    return;
  }

  if (coupon.usedCount >= coupon.maxUses) {
    res.status(400).json({ error: "Coupon usage limit reached" });
    return;
  }

  if (orderTotal < parseFloat(coupon.minOrder)) {
    res.status(400).json({ error: `Minimum order amount is ₹${coupon.minOrder}` });
    return;
  }

  const discount =
    coupon.discountType === "percent"
      ? Math.round(orderTotal * (parseFloat(coupon.value) / 100) * 100) / 100
      : Math.min(parseFloat(coupon.value), orderTotal);

  const finalTotal = orderTotal - discount;
  res.json({ discount, finalTotal, message: `Coupon applied! You saved ₹${discount.toFixed(2)}` });
});

router.patch("/coupons/:id", requireRole("admin"), async (req, res): Promise<void> => {
  const idParsed = UpdateCouponParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateCouponBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const update: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.code !== undefined) update.code = d.code.toUpperCase();
  if (d.discountType !== undefined) update.discountType = d.discountType;
  if (d.value !== undefined) update.value = String(d.value);
  if (d.minOrder !== undefined) update.minOrder = String(d.minOrder);
  if (d.maxUses !== undefined) update.maxUses = d.maxUses;
  if (d.expiresAt !== undefined) update.expiresAt = d.expiresAt ? new Date(d.expiresAt) : null;
  if (d.isActive !== undefined) update.isActive = d.isActive;

  const [coupon] = await db.update(couponsTable).set(update).where(eq(couponsTable.id, idParsed.data.id)).returning();
  if (!coupon) {
    res.status(404).json({ error: "Coupon not found" });
    return;
  }
  res.json(serializeCoupon(coupon));
});

router.delete("/coupons/:id", requireRole("admin"), async (req, res): Promise<void> => {
  const idParsed = DeleteCouponParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(couponsTable).where(eq(couponsTable.id, idParsed.data.id));
  res.status(204).send();
});

export default router;
