import { drizzle } from "drizzle-orm/mysql2";
import type mysql from "mysql2/promise";
import * as schema from "./schema";
import { createMysqlPool } from "./pool";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let cachedDb: Database | null = null;
let cachedPool: mysql.Pool | null = null;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!cachedPool) {
    cachedPool = createMysqlPool(process.env.DATABASE_URL);
  }

  if (!cachedDb) {
    cachedDb = drizzle(cachedPool, { schema, mode: "default" }) as unknown as Database;
  }

  return cachedDb;
}

export { schema };
