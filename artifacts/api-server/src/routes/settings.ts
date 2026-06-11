import { Router } from "express";
import { db, restaurantSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateSettingsBody } from "@workspace/api-zod";
import { requireRole } from "../lib/auth";

const router = Router();

async function getOrCreateSettings() {
  const rows = await db.select().from(restaurantSettingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(restaurantSettingsTable).values({}).returning();
  return created;
}

function serializeSettings(s: typeof restaurantSettingsTable.$inferSelect) {
  return {
    id: s.id,
    restaurantName: s.restaurantName,
    tagline: s.tagline,
    address: s.address,
    phone: s.phone,
    deliveryCharge: parseFloat(s.deliveryCharge),
    gstPercent: parseFloat(s.gstPercent),
    freeDeliveryAbove: parseFloat(s.freeDeliveryAbove),
  };
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(serializeSettings(settings));
});

router.put("/settings", requireRole("admin"), async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid settings data" });
    return;
  }

  const { restaurantName, tagline, address, phone, deliveryCharge, gstPercent, freeDeliveryAbove } = parsed.data;
  const existing = await getOrCreateSettings();

  const [updated] = await db
    .update(restaurantSettingsTable)
    .set({
      restaurantName,
      tagline,
      address,
      phone,
      deliveryCharge: String(deliveryCharge),
      gstPercent: String(gstPercent),
      freeDeliveryAbove: String(freeDeliveryAbove),
    })
    .where(eq(restaurantSettingsTable.id, existing.id))
    .returning();

  res.json(serializeSettings(updated));
});

export default router;
