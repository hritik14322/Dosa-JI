import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Simple request logger — no pino-http, no worker threads
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`[HTTP] ${req.method} ${req.url?.split("?")[0]} ${res.statusCode} +${Date.now() - start}ms`);
  });
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
app.use("/api", router);

// In production, serve the built React frontend and handle SPA routing
if (process.env["NODE_ENV"] === "production") {
  const clientDir = path.join(process.cwd(), "public");
  if (existsSync(clientDir)) {
    app.use(express.static(clientDir));
    app.get("/{*splat}", (_req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }
}

logger.info("App configured");

export default app;
