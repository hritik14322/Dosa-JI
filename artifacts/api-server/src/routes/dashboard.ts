import { Router } from "express";
import { db, ordersTable, menuItemsTable, usersTable } from "@workspace/db";
import { sql, eq, gte } from "drizzle-orm";
import { requireRole } from "../lib/auth";

const router = Router();

router.get("/dashboard/stats", requireRole("shopkeeper", "admin"), async (_req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [menuCount] = await db.select({ count: sql<number>`count(*)` }).from(menuItemsTable);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
  const [totalOrders] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable);

  const todayOrdersRes = await db
    .select({ count: sql<number>`count(*)`, revenue: sql<number>`coalesce(sum(total::numeric), 0)` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));

  const pendingRes = await db
    .select({ count: sql<number>`count(*)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "Placed"));

  const totalRevenueRes = await db
    .select({ revenue: sql<number>`coalesce(sum(total::numeric), 0)` })
    .from(ordersTable)
    .where(sql`${ordersTable.status} != 'Cancelled'`);

  res.json({
    totalMenuItems: Number(menuCount.count),
    todayOrders: Number(todayOrdersRes[0].count),
    todayRevenue: Number(todayOrdersRes[0].revenue),
    pendingOrders: Number(pendingRes[0].count),
    totalOrders: Number(totalOrders.count),
    totalUsers: Number(userCount.count),
    totalRevenue: Number(totalRevenueRes[0].revenue),
  });
});

router.get("/dashboard/revenue", requireRole("shopkeeper", "admin"), async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      date: sql<string>`to_char(${ordersTable.createdAt}, 'YYYY-MM-DD')`,
      revenue: sql<number>`coalesce(sum(${ordersTable.total}::numeric), 0)`,
    })
    .from(ordersTable)
    .where(sql`${ordersTable.status} != 'Cancelled' AND ${ordersTable.createdAt} >= NOW() - INTERVAL '30 days'`)
    .groupBy(sql`to_char(${ordersTable.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${ordersTable.createdAt}, 'YYYY-MM-DD')`);

  res.json(rows.map((r) => ({ date: r.date, revenue: Number(r.revenue) })));
});

router.get("/dashboard/orders-by-day", requireRole("shopkeeper", "admin"), async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      day: sql<string>`to_char(${ordersTable.createdAt}, 'Dy')`,
      count: sql<number>`count(*)`,
    })
    .from(ordersTable)
    .where(sql`${ordersTable.createdAt} >= NOW() - INTERVAL '7 days'`)
    .groupBy(sql`to_char(${ordersTable.createdAt}, 'Dy')`)
    .orderBy(sql`to_char(${ordersTable.createdAt}, 'Dy')`);

  res.json(rows.map((r) => ({ day: r.day, count: Number(r.count) })));
});

export default router;
