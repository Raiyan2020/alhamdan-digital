import { verifyAdminPassword } from "./password";
import type { AdminSession } from "./constants";

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminSession | null> {
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
      process.env.ADMIN_EMAIL &&
      (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH),
  );
}
