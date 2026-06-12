import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "./schema";
import path from "path";

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
  : drizzlePglite(new PGlite(databaseUrl || path.resolve(process.cwd(), ".local/db")), { schema });

export * from "./schema";
