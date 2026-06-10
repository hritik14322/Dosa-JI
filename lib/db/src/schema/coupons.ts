import { pgTable, serial, text, boolean, timestamp, numeric, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const discountTypeEnum = pgEnum("discount_type", ["percent", "flat"]);

export const couponsTable = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrder: numeric("min_order", { precision: 10, scale: 2 }).notNull().default("0"),
  maxUses: integer("max_uses").notNull().default(100),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCouponSchema = createInsertSchema(couponsTable).omit({ id: true, usedCount: true, createdAt: true });
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof couponsTable.$inferSelect;
