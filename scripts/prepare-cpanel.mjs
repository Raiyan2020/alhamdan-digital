import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");
const sourcePublicDir = path.join(root, "public");
const sourceStaticDir = path.join(root, ".next", "static");
const targetPublicDir = path.join(standaloneDir, "public");
const targetStaticDir = path.join(standaloneDir, ".next", "static");

if (!existsSync(standaloneDir)) {
  throw new Error("Missing .next/standalone. Run `npm run build` first.");
}

if (!existsSync(sourcePublicDir)) {
  throw new Error("Missing public directory.");
}

if (!existsSync(sourceStaticDir)) {
  throw new Error("Missing .next/static. Run `npm run build` first.");
}

await mkdir(path.join(standaloneDir, ".next"), { recursive: true });
await rm(targetPublicDir, { recursive: true, force: true });
await rm(targetStaticDir, { recursive: true, force: true });
await cp(sourcePublicDir, targetPublicDir, { recursive: true });
await cp(sourceStaticDir, targetStaticDir, { recursive: true });

console.log("Prepared .next/standalone for cPanel upload:");
console.log("- copied public -> .next/standalone/public");
console.log("- copied .next/static -> .next/standalone/.next/static");
