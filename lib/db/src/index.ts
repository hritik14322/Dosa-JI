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

export * from "./schema";
