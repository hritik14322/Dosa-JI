"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/bootstrap.ts
var import_node_http = __toESM(require("node:http"), 1);
console.log("[start]", (/* @__PURE__ */ new Date()).toISOString(), "PORT=" + (process.env["PORT"] ?? "3000"));
process.on("uncaughtException", (err) => {
  console.error("[crash]", err.message, "\n", err.stack);
});
process.on("unhandledRejection", (reason) => {
  console.error("[rejection]", reason);
});
var port = Number(process.env["PORT"] ?? "3000");
var handler = (_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Starting...\n");
};
var server = import_node_http.default.createServer((req, res) => handler(req, res));
server.on("error", (err) => {
  console.error("[start] listen error:", err.message);
  process.exit(1);
});
server.listen(port, "0.0.0.0", () => {
  console.log("[start] Listening on port", port);
  const appPath = "./app.cjs";
  try {
    const mod = require(appPath);
    handler = mod.default;
    console.log("[start] Express app ready");
  } catch (err) {
    const e = err;
    console.error("[start] App load error:", e.message, "\n", e.stack);
    handler = (_req, res) => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("App load error:\n" + e.message + "\n\n" + e.stack + "\n");
    };
  }
});
//# sourceMappingURL=bootstrap.cjs.map
