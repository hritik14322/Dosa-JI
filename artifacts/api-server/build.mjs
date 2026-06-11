import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm, writeFile } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

const external = [
  "*.node",
  "sharp",
  "better-sqlite3",
  "sqlite3",
  "canvas",
  "bcrypt",
  "argon2",
  "fsevents",
  "re2",
  "farmhash",
  "xxhash-addon",
  "bufferutil",
  "utf-8-validate",
  "ssh2",
  "cpu-features",
  "dtrace-provider",
  "isolated-vm",
  "lightningcss",
  "pg-native",
  "oracledb",
  "mongodb-client-encryption",
  "nodemailer",
  "handlebars",
  "knex",
  "typeorm",
  "protobufjs",
  "onnxruntime-node",
  "@tensorflow/*",
  "@prisma/client",
  "@mikro-orm/*",
  "@grpc/*",
  "@swc/*",
  "@aws-sdk/*",
  "@azure/*",
  "@opentelemetry/*",
  "@google-cloud/*",
  "@google/*",
  "googleapis",
  "firebase-admin",
  "@parcel/watcher",
  "@sentry/profiling-node",
  "@tree-sitter/*",
  "aws-sdk",
  "classic-level",
  "dd-trace",
  "ffi-napi",
  "grpc",
  "hiredis",
  "kerberos",
  "leveldown",
  "miniflare",
  "mysql2",
  "newrelic",
  "odbc",
  "piscina",
  "realm",
  "ref-napi",
  "rocksdb",
  "sass-embedded",
  "sequelize",
  "serialport",
  "snappy",
  "tinypool",
  "usb",
  "workerd",
  "wrangler",
  "zeromq",
  "zeromq-prebuilt",
  "playwright",
  "puppeteer",
  "puppeteer-core",
  "electron",
];

// CJS builds — no banner needed, no ESM import-hoisting complexity
const cjsOptions = {
  platform: "node",
  bundle: true,
  format: "cjs",
  outdir: path.resolve(artifactDir, "dist"),
  outExtension: { ".js": ".cjs" },
  logLevel: "info",
  sourcemap: "linked",
  external,
};

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  // Build 1: Full Express app (CJS) — loaded by bootstrap via require()
  await esbuild({
    ...cjsOptions,
    entryPoints: [{ in: path.resolve(artifactDir, "src/app-entry.ts"), out: "app" }],
  });

  // Build 2: Bootstrap (CJS) — starts HTTP server immediately, then requires app.cjs
  await esbuild({
    ...cjsOptions,
    entryPoints: [{ in: path.resolve(artifactDir, "src/bootstrap.ts"), out: "bootstrap" }],
  });

  // Write dist/index.mjs manually — tiny 8-line ESM shim, NO esbuild banner
  // Hostinger's startup file is dist/index.mjs; this shim just delegates to bootstrap.cjs
  const indexMjs = `// ESM entry shim — delegates to CJS bootstrap immediately
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
require('./bootstrap.cjs');
`;
  await writeFile(path.resolve(distDir, "index.mjs"), indexMjs, "utf8");
  console.log("  dist/index.mjs  written (ESM shim, no banner)");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
