import bcrypt from "bcryptjs";

export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (hash) {
    return verifyPasswordHash(password, hash);
  }

  if (plain) {
    return password === plain;
  }

  return false;
}

export async function hashAdminPassword(password: string) {
  return bcrypt.hash(password, 12);
}
