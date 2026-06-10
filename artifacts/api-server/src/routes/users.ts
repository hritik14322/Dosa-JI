import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireRole } from "../lib/auth";
import { UpdateUserRoleBody, UpdateUserRoleParams, UpdateUserStatusBody, UpdateUserStatusParams } from "@workspace/api-zod";

const router = Router();

function serializeUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    address: u.address,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/users", requireRole("admin"), async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable);
  res.json(users.map(serializeUser));
});

router.patch("/users/:id/role", requireRole("admin"), async (req, res): Promise<void> => {
  const idParsed = UpdateUserRoleParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateUserRoleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .update(usersTable)
    .set({ role: parsed.data.role as "customer" | "shopkeeper" | "admin" })
    .where(eq(usersTable.id, idParsed.data.id))
    .returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(serializeUser(user));
});

router.patch("/users/:id/status", requireRole("admin"), async (req, res): Promise<void> => {
  const idParsed = UpdateUserStatusParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateUserStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .update(usersTable)
    .set({ isActive: parsed.data.isActive })
    .where(eq(usersTable.id, idParsed.data.id))
    .returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(serializeUser(user));
});

export default router;
