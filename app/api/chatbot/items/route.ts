import { NextResponse, type NextRequest } from "next/server";
import { getPublicChatbotItems } from "@/lib/chatbot/service";
import type { CmsLocale } from "@/lib/cms/types";

// Read fresh so dashboard edits appear immediately.
export const dynamic = "force-dynamic";

function parseLocale(value: string | null): CmsLocale {
  return value === "en" ? "en" : "ar";
}

export async function GET(request: NextRequest) {
  const locale = parseLocale(request.nextUrl.searchParams.get("locale"));
  const items = await getPublicChatbotItems(locale);
  return NextResponse.json({ ok: true, items });
}
