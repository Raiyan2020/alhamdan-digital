import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import { getChatbotAdminData } from "@/lib/chatbot/service";
import {
  chatbotItemCreateSchema,
  normalizeBilingualOverride,
  normalizeRedirectUrl,
} from "@/lib/chatbot/validation";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const data = await getChatbotAdminData();
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatbotItemCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please complete the required chatbot fields.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      message: "DATABASE_URL is not configured, so the item was not saved.",
    });
  }

  const db = getDb();
  const now = new Date();
  const id = randomUUID();
  const input = parsed.data;

  try {
    await db.insert(schema.chatbotItems).values({
      id,
      productId: input.productId,
      titleJson: normalizeBilingualOverride(input.title),
      descriptionJson: normalizeBilingualOverride(input.description),
      redirectUrl: normalizeRedirectUrl(input.redirectUrl),
      icon: input.icon?.trim() || null,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Failed to create chatbot item:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not save the item. If this persists, run `npm run db:push` to create the chatbot_items table.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: "Chatbot item created.", id });
}
