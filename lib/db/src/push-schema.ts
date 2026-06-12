import { db } from "./index";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Applying database migrations programmatically...");
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL environment variable must be set.");
    process.exit(1);
  }

  const isPgConnection = databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://");
  const migrationsFolder = path.resolve(__dirname, "../drizzle");
  console.log(`Loading migrations from: ${migrationsFolder}`);

  try {
    if (isPgConnection) {
      const { migrate } = await import("drizzle-orm/node-postgres/migrator");
      await migrate(db, { migrationsFolder });
    } else {
      const { migrate } = await import("drizzle-orm/pglite/migrator");
      await migrate(db, { migrationsFolder });
    }
    console.log("Database migrations applied successfully!");
  } catch (err) {
    console.error("Failed to apply migrations:", err);
    process.exit(1);
  }
}

main();
