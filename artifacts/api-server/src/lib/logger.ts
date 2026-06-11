import pino from "pino";

const isProduction = process.env["NODE_ENV"] === "production";

const consoleLogger = {
  level: process.env["LOG_LEVEL"] ?? "info",
  info: (obj: unknown, msg?: string) => console.log("[INFO]", msg ?? obj, typeof obj === "object" ? obj : ""),
  error: (obj: unknown, msg?: string) => console.error("[ERROR]", msg ?? obj, typeof obj === "object" ? obj : ""),
  warn: (obj: unknown, msg?: string) => console.warn("[WARN]", msg ?? obj, typeof obj === "object" ? obj : ""),
  debug: (obj: unknown, msg?: string) => console.log("[DEBUG]", msg ?? obj, typeof obj === "object" ? obj : ""),
  trace: (obj: unknown, msg?: string) => console.log("[TRACE]", msg ?? obj, typeof obj === "object" ? obj : ""),
  fatal: (obj: unknown, msg?: string) => console.error("[FATAL]", msg ?? obj, typeof obj === "object" ? obj : ""),
  child: () => consoleLogger,
};

export const logger = isProduction
  ? (consoleLogger as unknown as pino.Logger)
  : pino({
      level: process.env["LOG_LEVEL"] ?? "info",
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "res.headers['set-cookie']",
      ],
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    });
