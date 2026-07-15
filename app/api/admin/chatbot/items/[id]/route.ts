import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import {
  chatbotItemUpdateSchema,
  normalizeBilingualOverride,
  normalizeRedirectUrl,
} from "@/lib/chatbot/validation";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatbotItemUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please correct the chatbot fields.",
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
  const [existing] = await db
    .select()
    .from(schema.chatbotItems)
    .where(eq(schema.chatbotItems.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ ok: false, message: "Item not found." }, { status: 404 });
  }

  const input = parsed.data;
  const now = new Date();
  const updates: Partial<typeof schema.chatbotItems.$inferInsert> = { updatedAt: now };

  if (input.productId !== undefined) updates.productId = input.productId;
  if (input.title !== undefined) updates.titleJson = normalizeBilingualOverride(input.title);
  if (input.description !== undefined)
    updates.descriptionJson = normalizeBilingualOverride(input.description);
  if (input.redirectUrl !== undefined)
    updates.redirectUrl = normalizeRedirectUrl(input.redirectUrl);
  if (input.icon !== undefined) updates.icon = input.icon?.trim() || null;
  if (input.isActive !== undefined) updates.isActive = input.isActive;
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;

  try {
    await db.update(schema.chatbotItems).set(updates).where(eq(schema.chatbotItems.id, id));
  } catch (error) {
    console.error("Failed to update chatbot item:", error);
    return NextResponse.json(
      { ok: false, message: "Could not save the item. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: "Chatbot item saved." });
}

export async function DELETE(_request: NextRequest, context: Context) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: false, message: "DATABASE_URL is not configured." });
  }

  const db = getDb();
  const [existing] = await db
    .select({ id: schema.chatbotItems.id })
    .from(schema.chatbotItems)
    .where(eq(schema.chatbotItems.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ ok: false, message: "Item not found." }, { status: 404 });
  }

  await db.delete(schema.chatbotItems).where(eq(schema.chatbotItems.id, id));

  return NextResponse.json({ ok: true, message: "Chatbot item deleted." });
}
