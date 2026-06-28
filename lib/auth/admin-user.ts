import { randomUUID } from "node:crypto";
import { and, eq, ne } from "drizzle-orm";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import type { AdminSession } from "./constants";
import { hashAdminPassword, verifyPasswordHash } from "./password";

export type AdminUser = typeof schema.adminUsers.$inferSelect;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function envAdminName() {
  return process.env.ADMIN_NAME?.trim() || "Admin";
}

async function getEnvPasswordHash() {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hash) return hash;

  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return null;

  return hashAdminPassword(plain);
}

export async function ensureEnvAdminUser() {
  if (!hasDatabaseUrl()) return null;

  const email = normalizeEmail(process.env.ADMIN_EMAIL ?? "");
  if (!email) return null;

  const passwordHash = await getEnvPasswordHash();
  if (!passwordHash) return null;

  const db = getDb();
  const [existing] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1);

  if (existing) return existing;

  const now = new Date();
  const id = randomUUID();

  await db.insert(schema.adminUsers).values({
    id,
    email,
    name: envAdminName(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  const [created] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, id))
    .limit(1);

  return created ?? null;
}

export async function getAdminUserByEmail(email: string) {
  if (!hasDatabaseUrl()) return null;

  await ensureEnvAdminUser();

  const [admin] = await getDb()
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, normalizeEmail(email)))
    .limit(1);

  return admin ?? null;
}

export async function getAdminUserById(id: string) {
  if (!hasDatabaseUrl()) return null;

  await ensureEnvAdminUser();

  const [admin] = await getDb()
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, id))
    .limit(1);

  return admin ?? null;
}

export async function isAdminEmailTaken(email: string, currentAdminId: string) {
  if (!hasDatabaseUrl()) return false;

  const [existing] = await getDb()
    .select({ id: schema.adminUsers.id })
    .from(schema.adminUsers)
    .where(
      and(
        eq(schema.adminUsers.email, normalizeEmail(email)),
        ne(schema.adminUsers.id, currentAdminId),
      ),
    )
    .limit(1);

  return Boolean(existing);
}

export async function updateAdminProfile(
  adminId: string,
  input: { email: string; name: string },
) {
  const email = normalizeEmail(input.email);
  const name = input.name.trim() || "Admin";
  const now = new Date();

  await getDb()
    .update(schema.adminUsers)
    .set({ email, name, updatedAt: now })
    .where(eq(schema.adminUsers.id, adminId));

  const updated = await getAdminUserById(adminId);
  if (!updated) {
    throw new Error("Admin user was not found after update.");
  }

  return updated;
}

export async function updateAdminPassword(adminId: string, password: string) {
  const passwordHash = await hashAdminPassword(password);

  await getDb()
    .update(schema.adminUsers)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(schema.adminUsers.id, adminId));
}

export function toAdminSession(admin: Pick<AdminUser, "id" | "email" | "name">): AdminSession {
  return {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
  };
}

export async function verifyAdminUserPassword(admin: AdminUser, password: string) {
  return verifyPasswordHash(password, admin.passwordHash);
}
