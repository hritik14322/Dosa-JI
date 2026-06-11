process.on("uncaughtException", (err) => {
  console.error("[startup] Uncaught exception:", err.message, err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[startup] Unhandled rejection:", reason);
  process.exit(1);
});

console.log("[startup] Loading app...");
console.log("[startup] NODE_ENV:", process.env["NODE_ENV"]);
console.log("[startup] PORT env:", process.env["PORT"] ?? "(not set, using 3000)");

import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);

console.log("[startup] Parsed port:", port);

if (Number.isNaN(port) || port <= 0) {
  console.error("[startup] Invalid PORT value:", rawPort);
  process.exit(1);
}

app.listen(port, (err?: Error) => {
  if (err) {
    console.error("[startup] Failed to listen:", err.message);
    process.exit(1);
  }
  console.log("[startup] Server listening on port", port);
  logger.info({ port }, "Server listening");
});
