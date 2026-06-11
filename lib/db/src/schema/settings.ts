import { pgTable, serial, text, numeric } from "drizzle-orm/pg-core";

export const restaurantSettingsTable = pgTable("restaurant_settings", {
  id: serial("id").primaryKey(),
  restaurantName: text("restaurant_name").notNull().default("Dosa Ji"),
  tagline: text("tagline").notNull().default("Delicious Fast Food"),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default(""),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 }).notNull().default("40"),
  gstPercent: numeric("gst_percent", { precision: 5, scale: 2 }).notNull().default("5"),
  freeDeliveryAbove: numeric("free_delivery_above", { precision: 10, scale: 2 }).notNull().default("0"),
});

export type RestaurantSettings = typeof restaurantSettingsTable.$inferSelect;
