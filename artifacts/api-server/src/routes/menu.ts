import { Router } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireRole, requireAuth } from "../lib/auth";
import {
  CreateMenuItemBody,
  UpdateMenuItemBody,
  ToggleMenuItemAvailabilityBody,
  GetMenuItemParams,
  UpdateMenuItemParams,
  DeleteMenuItemParams,
  ToggleMenuItemAvailabilityParams,
  ListMenuItemsQueryParams,
} from "@workspace/api-zod";

const router = Router();

function serializeMenuItem(item: typeof menuItemsTable.$inferSelect) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: parseFloat(item.price),
    category: item.category,
    imageUrl: item.imageUrl,
    isVeg: item.isVeg,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    createdAt: item.createdAt.toISOString(),
  };
}

router.get("/menu", async (req, res): Promise<void> => {
  const parsed = ListMenuItemsQueryParams.safeParse(req.query);
  const filters = parsed.success ? parsed.data : {};

  let items = await db.select().from(menuItemsTable);

  if (filters.category) {
    items = items.filter((i) => i.category === filters.category);
  }
  if (filters.isVeg !== undefined) {
    items = items.filter((i) => i.isVeg === filters.isVeg);
  }
  if (filters.featured !== undefined) {
    items = items.filter((i) => i.isFeatured === filters.featured);
  }

  res.json(items.map(serializeMenuItem));
});

router.post("/menu", requireRole("shopkeeper", "admin"), async (req, res): Promise<void> => {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const [item] = await db
    .insert(menuItemsTable)
    .values({
      name: data.name,
      description: data.description ?? "",
      price: String(data.price),
      category: data.category,
      imageUrl: data.imageUrl,
      isVeg: data.isVeg,
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
    })
    .returning();
  res.status(201).json(serializeMenuItem(item));
});

router.get("/menu/:id", async (req, res): Promise<void> => {
  const parsed = GetMenuItemParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [item] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, parsed.data.id)).limit(1);
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json(serializeMenuItem(item));
});

router.put("/menu/:id", requireRole("shopkeeper", "admin"), async (req, res): Promise<void> => {
  const idParsed = UpdateMenuItemParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const update: Record<string, unknown> = {};
  const d = parsed.data;
  if (d.name !== undefined) update.name = d.name;
  if (d.description !== undefined) update.description = d.description;
  if (d.price !== undefined) update.price = String(d.price);
  if (d.category !== undefined) update.category = d.category;
  if (d.imageUrl !== undefined) update.imageUrl = d.imageUrl;
  if (d.isVeg !== undefined) update.isVeg = d.isVeg;
  if (d.isAvailable !== undefined) update.isAvailable = d.isAvailable;
  if (d.isFeatured !== undefined) update.isFeatured = d.isFeatured;

  const [item] = await db.update(menuItemsTable).set(update).where(eq(menuItemsTable.id, idParsed.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json(serializeMenuItem(item));
});

router.delete("/menu/:id", requireRole("admin"), async (req, res): Promise<void> => {
  const idParsed = DeleteMenuItemParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(menuItemsTable).where(eq(menuItemsTable.id, idParsed.data.id));
  res.status(204).send();
});

router.patch("/menu/:id/availability", requireRole("shopkeeper", "admin"), async (req, res): Promise<void> => {
  const idParsed = ToggleMenuItemAvailabilityParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = ToggleMenuItemAvailabilityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(menuItemsTable)
    .set({ isAvailable: parsed.data.isAvailable })
    .where(eq(menuItemsTable.id, idParsed.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json(serializeMenuItem(item));
});

export default router;
