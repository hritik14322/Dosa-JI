import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Load .env from root or parent directories
let currentDir = process.cwd();
let rootDir = process.cwd();
while (currentDir) {
  const envPath = path.join(currentDir, ".env");
  if (fs.existsSync(envPath)) {
    rootDir = currentDir;
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const index = trimmed.indexOf("=");
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim();
          const val = trimmed.substring(index + 1).trim();
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
    break;
  }
  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) break;
  currentDir = parentDir;
}

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

const isPgConnection = !!(databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")));
const isLocal = !databaseUrl || databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1") || databaseUrl.includes("::1");

export const pool = isPgConnection
  ? new Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    })
  : null;

export const db = isPgConnection
  ? drizzlePg(pool, { schema })
  : drizzlePglite(new PGlite(databaseUrl || path.resolve(rootDir, ".local/db")), { schema });

// Run database migrations and seeding asynchronously on server startup in production
if (isPgConnection && process.env.NODE_ENV === "production") {
  const migrationsFolder = path.resolve(rootDir, "artifacts/api-server/dist/drizzle");
  console.log(`[Database] Auto-migrating database from: ${migrationsFolder}`);
  import("drizzle-orm/node-postgres/migrator")
    .then(({ migrate }) => migrate(db as any, { migrationsFolder }))
    .then(async () => {
      console.log("[Database] Auto-migration completed successfully!");
      
      // Auto-seeding check
      try {
        const { sql } = await import("drizzle-orm");
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.usersTable);
        if (Number(count) === 0) {
          console.log("[Database] No users found. Seeding default data...");
          const { seedDatabase } = await import("./seed-helper");
          await seedDatabase(db as any);
          console.log("[Database] Seeding completed successfully!");
        } else {
          console.log("[Database] Database already has data. Skipping seed.");
        }
      } catch (seedErr) {
        console.error("[Database] Auto-seeding failed:", seedErr);
      }
    })
    .catch((err) => {
      console.error("[Database] Auto-migration/seeding failed:", err);
    });
}

export * from "./schema";
