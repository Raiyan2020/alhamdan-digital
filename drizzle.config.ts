import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Config } from "drizzle-kit";

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore missing .env.local
  }
}

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL ?? "mysql://root:password@localhost:3306/abo_hmdan";
const useTls =
  process.env.DATABASE_SSL === "true" ||
  databaseUrl.includes("tidbcloud.com") ||
  Boolean(process.env.DATABASE_SSL_CA);

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: useTls
      ? `${databaseUrl.split("?")[0]}?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}`
      : databaseUrl,
  },
  strict: true,
  verbose: true,
} satisfies Config;
