import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

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
    // .env.local is optional when env vars are already exported
  }
}

function shouldUseTls(url) {
  return (
    process.env.DATABASE_SSL === "true" ||
    url.includes("tidbcloud.com") ||
    Boolean(process.env.DATABASE_SSL_CA)
  );
}

function parseDatabaseUrl(databaseUrl) {
  const parsed = new URL(databaseUrl.replace(/^mysql:/, "http:"));
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
  };
}

loadEnvLocal();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const { host, port, user, password, database } = parseDatabaseUrl(databaseUrl);
const ssl = shouldUseTls(databaseUrl) ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined;

console.log(`Connecting to TiDB at ${host}:${port}...`);

const connection = await mysql.createConnection({
  host,
  port,
  user,
  password,
  ssl,
});

await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
console.log(`Database "${database}" is ready.`);

await connection.changeUser({ database });
const [tables] = await connection.query("SHOW TABLES");
console.log(`Tables in ${database}:`, tables.length);

await connection.end();
console.log("TiDB setup check complete.");
