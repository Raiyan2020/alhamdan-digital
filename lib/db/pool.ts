import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

function shouldUseTls(url: string) {
  return (
    process.env.DATABASE_SSL === "true" ||
    url.includes("tidbcloud.com") ||
    Boolean(process.env.DATABASE_SSL_CA)
  );
}

function getSslOptions() {
  const caPath = process.env.DATABASE_SSL_CA;

  return {
    minVersion: "TLSv1.2" as const,
    rejectUnauthorized: true,
    ...(caPath && fs.existsSync(path.resolve(caPath))
      ? { ca: fs.readFileSync(path.resolve(caPath)) }
      : {}),
  };
}

export function createMysqlPool(databaseUrl: string) {
  if (!shouldUseTls(databaseUrl)) {
    return mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  return mysql.createPool({
    uri: databaseUrl.split("?")[0],
    ssl: getSslOptions(),
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export async function createMysqlConnection(databaseUrl: string, database?: string) {
  const parsed = new URL(databaseUrl.replace(/^mysql:/, "http:"));
  const tls = shouldUseTls(databaseUrl);

  return mysql.createConnection({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: database ?? (parsed.pathname.replace(/^\//, "") || undefined),
    ssl: tls ? getSslOptions() : undefined,
  });
}
