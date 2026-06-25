import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_LONG,
  SESSION_MAX_AGE_SHORT,
  type AdminSession,
} from "./constants";

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(
  admin: AdminSession,
  remember = false,
) {
  const maxAge = remember ? SESSION_MAX_AGE_LONG : SESSION_MAX_AGE_SHORT;
  const token = await new SignJWT({
    sub: admin.sub,
    email: admin.email,
    name: admin.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Admin",
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSessionToken(
  token: string,
): Promise<AdminSession | null> {
  if (!process.env.AUTH_SECRET) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Admin",
    };
  } catch {
    return null;
  }
}
