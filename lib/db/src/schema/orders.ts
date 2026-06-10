import { pgTable, serial, integer, text, boolean, timestamp, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const orderStatusEnum = pgEnum("order_status", [
  "Placed",
  "Preparing",
  "OutForDelivery",
  "Delivered",
  "Cancelled",
]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  items: jsonb("items").notNull().$type<Array<{
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>>(),
  deliveryAddress: jsonb("delivery_address").notNull().$type<{
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    pincode: string;
  }>(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 }).notNull().default("40"),
  gst: numeric("gst", { precision: 10, scale: 2 }).notNull().default("0"),
  couponDiscount: numeric("coupon_discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  couponCode: text("coupon_code"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  status: orderStatusEnum("status").notNull().default("Placed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
