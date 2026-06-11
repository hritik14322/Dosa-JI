import type { Logger } from "pino";

const _logger = {
  level: "info",
  info: (obj: unknown, msg?: string) =>
    console.log("[INFO]", msg ?? "", typeof obj === "object" && obj !== null ? JSON.stringify(obj) : obj ?? ""),
  error: (obj: unknown, msg?: string) =>
    console.error("[ERROR]", msg ?? "", typeof obj === "object" && obj !== null ? JSON.stringify(obj) : obj ?? ""),
  warn: (obj: unknown, msg?: string) =>
    console.warn("[WARN]", msg ?? "", typeof obj === "object" && obj !== null ? JSON.stringify(obj) : obj ?? ""),
  debug: (obj: unknown, msg?: string) =>
    console.log("[DEBUG]", msg ?? "", typeof obj === "object" && obj !== null ? JSON.stringify(obj) : obj ?? ""),
  trace: (obj: unknown, msg?: string) =>
    console.log("[TRACE]", msg ?? "", typeof obj === "object" && obj !== null ? JSON.stringify(obj) : obj ?? ""),
  fatal: (obj: unknown, msg?: string) =>
    console.error("[FATAL]", msg ?? "", typeof obj === "object" && obj !== null ? JSON.stringify(obj) : obj ?? ""),
  child: (_bindings: Record<string, unknown>) => _logger,
};

export const logger = _logger as unknown as Logger;
