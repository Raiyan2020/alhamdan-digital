import { NextResponse, type NextRequest } from "next/server";
import { authenticateAdmin, isAuthConfigured } from "@/lib/auth/credentials";
import { createAdminSession } from "@/lib/auth/session";
import { adminLoginSchema } from "@/lib/auth/validation";

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Admin authentication is not configured. Set AUTH_SECRET and either DATABASE_URL or admin environment credentials.",
      },
      { status: 503 },
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

  const parsed = adminLoginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid login details.",
      },
      { status: 400 },
    );
  }

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!admin) {
    return NextResponse.json(
      { ok: false, message: "Invalid email or password." },
      { status: 401 },
    );
  }

  await createAdminSession(admin, parsed.data.remember);

  return NextResponse.json({ ok: true });
}
