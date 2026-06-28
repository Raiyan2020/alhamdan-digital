import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminUserByEmail,
  getAdminUserById,
  isAdminEmailTaken,
  toAdminSession,
  updateAdminPassword,
  updateAdminProfile,
  verifyAdminUserPassword,
} from "@/lib/auth/admin-user";
import { createAdminSession, getAdminSession } from "@/lib/auth/session";
import {
  adminPasswordChangeSchema,
  adminProfileSchema,
} from "@/lib/auth/validation";

async function getCurrentAdminUser() {
  const session = await getAdminSession();
  if (!session) return null;

  return (
    (await getAdminUserById(session.sub)) ??
    (await getAdminUserByEmail(session.email))
  );
}

function adminJson(admin: NonNullable<Awaited<ReturnType<typeof getCurrentAdminUser>>>) {
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };
}

export async function GET() {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true, admin: adminJson(admin) });
}

export async function PATCH(request: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!json || typeof json !== "object" || !("type" in json)) {
    return NextResponse.json(
      { ok: false, message: "Invalid profile update request." },
      { status: 400 },
    );
  }

  const type = (json as { type?: unknown }).type;

  if (type === "profile") {
    const parsed = adminProfileSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please check the profile fields.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const passwordValid = await verifyAdminUserPassword(
      admin,
      parsed.data.currentPassword,
    );
    if (!passwordValid) {
      return NextResponse.json(
        { ok: false, message: "Current password is incorrect." },
        { status: 401 },
      );
    }

    const emailTaken = await isAdminEmailTaken(parsed.data.email, admin.id);
    if (emailTaken) {
      return NextResponse.json(
        { ok: false, message: "That email is already in use." },
        { status: 409 },
      );
    }

    const updated = await updateAdminProfile(admin.id, parsed.data);
    await createAdminSession(toAdminSession(updated));

    return NextResponse.json({ ok: true, admin: adminJson(updated) });
  }

  if (type === "password") {
    const parsed = adminPasswordChangeSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please check the password fields.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const passwordValid = await verifyAdminUserPassword(
      admin,
      parsed.data.currentPassword,
    );
    if (!passwordValid) {
      return NextResponse.json(
        { ok: false, message: "Current password is incorrect." },
        { status: 401 },
      );
    }

    await updateAdminPassword(admin.id, parsed.data.newPassword);
    await createAdminSession(toAdminSession(admin));

    return NextResponse.json({ ok: true, admin: adminJson(admin) });
  }

  return NextResponse.json(
    { ok: false, message: "Unknown profile update type." },
    { status: 400 },
  );
}
