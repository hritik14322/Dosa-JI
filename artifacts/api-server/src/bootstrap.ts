// Production bootstrap — starts HTTP server first, then synchronously loads the Express app via require()
// Built to dist/bootstrap.cjs (CJS format, no ESM banner complexity)
import http from "node:http";

console.log("[start]", new Date().toISOString(), "PORT=" + (process.env["PORT"] ?? "3000"));

process.on("uncaughtException", (err: Error) => {
  console.error("[crash]", err.message, "\n", err.stack);
});
process.on("unhandledRejection", (reason: unknown) => {
  console.error("[rejection]", reason);
});

const port = Number(process.env["PORT"] ?? "3000");

type Handler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

let handler: Handler = (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Starting...\n");
};

const server = http.createServer((req, res) => handler(req, res));

server.on("error", (err: Error) => {
  console.error("[start] listen error:", err.message);
  process.exit(1);
});

server.listen(port, "0.0.0.0", () => {
  console.log("[start] Listening on port", port);

  // Dynamic path prevents esbuild from inlining app.cjs into this bundle
  const appPath = "./app.cjs";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(appPath) as { default: Handler };
    handler = mod.default;
    console.log("[start] Express app ready");
  } catch (err) {
    const e = err as Error;
    console.error("[start] App load error:", e.message, "\n", e.stack);
    handler = (_req, res) => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("App load error:\n" + e.message + "\n\n" + e.stack + "\n");
    };
  }
});
