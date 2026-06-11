import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

console.log("[bootstrap]", new Date().toISOString());
console.log("[bootstrap] PORT=" + (process.env["PORT"] ?? "3000"), "NODE_ENV=" + process.env["NODE_ENV"]);

process.on("uncaughtException", (err: Error) => {
  console.error("[bootstrap] uncaughtException:", err.message, err.stack);
});
process.on("unhandledRejection", (reason: unknown) => {
  console.error("[bootstrap] unhandledRejection:", reason);
});

const port = Number(process.env["PORT"] ?? "3000");

type Listener = (req: IncomingMessage, res: ServerResponse) => void;

// Start with a placeholder — LiteSpeed sees a server immediately
let handler: Listener = (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Starting...\n");
};

const server = createServer((req, res) => handler(req, res));

server.on("error", (err: Error) => {
  console.error("[bootstrap] listen error:", err.message);
  process.exit(1);
});

server.listen(port, "0.0.0.0", () => {
  console.log("[bootstrap] Listening on port", port);

  // Load the full Express app AFTER we are already listening
  // @ts-ignore — app-bundle.mjs is built as a separate entry point
  import("./app-bundle.mjs")
    .then((mod: { default: Listener }) => {
      handler = mod.default as unknown as Listener;
      console.log("[bootstrap] Express app ready");
    })
    .catch((err: Error) => {
      console.error("[bootstrap] App failed to load:", err.message, err.stack);
      // Serve the error over HTTP so we can read it
      handler = (_req, res) => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("App Load Error:\n" + err.message + "\n\n" + err.stack + "\n");
      };
    });
});
