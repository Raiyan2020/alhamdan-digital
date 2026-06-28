import { verifyAdminPassword } from "./password";
import type { AdminSession } from "./constants";
import {
  getAdminUserByEmail,
  toAdminSession,
  verifyAdminUserPassword,
} from "./admin-user";

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  try {
    const adminUser = await getAdminUserByEmail(email);
    if (adminUser) {
      const valid = await verifyAdminUserPassword(adminUser, password);
      return valid ? toAdminSession(adminUser) : null;
    }
  } catch (error) {
    console.warn("Falling back to env admin credentials:", error);
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) return null;

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== adminEmail) return null;

  const valid = await verifyAdminPassword(password);
  if (!valid) return null;

  return {
    sub: "admin",
    email: adminEmail,
    name: process.env.ADMIN_NAME?.trim() || "Admin",
  };
}

export function isAuthConfigured() {
  return Boolean(
    process.env.AUTH_SECRET &&
      (process.env.DATABASE_URL ||
        (process.env.ADMIN_EMAIL &&
          (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH))),
  );
}
