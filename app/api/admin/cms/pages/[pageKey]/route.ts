import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import {
  cmsAboutPayloadSchema,
  cmsHomePayloadSchema,
  sanitizeCmsHomePayload,
} from "@/lib/cms/validation";
import { prepareAboutPayloadForStorage, normalizeAboutPayloadForSubmit, coalesceAboutPayloadForSubmit } from "@/lib/cms/about-storage";
import type { CmsAboutPayload, CmsHomePayload } from "@/lib/cms/types";

type Context = {
  params: Promise<{ pageKey: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { pageKey } = await context.params;

  if (pageKey !== "home" && pageKey !== "about") {
    return NextResponse.json(
      { ok: false, message: "This CMS page is not editable." },
      { status: 404 },
    );
  }

  const json = await request.json();
  let candidate = json;

  if (pageKey === "about" && hasDatabaseUrl()) {
    const db = getDb();
    const contentId = `content_about_draft`;
    const [existingRow] = await db
      .select()
      .from(schema.cmsPageContent)
      .where(eq(schema.cmsPageContent.id, contentId))
      .limit(1);
    const stored = existingRow?.contentJson as CmsAboutPayload | undefined;

    if (stored && "products" in stored) {
      candidate = normalizeAboutPayloadForSubmit(
        coalesceAboutPayloadForSubmit(json as CmsAboutPayload, stored),
      );
    } else {
      candidate = normalizeAboutPayloadForSubmit(json as CmsAboutPayload);
    }
  } else if (pageKey === "about") {
    candidate = normalizeAboutPayloadForSubmit(json as CmsAboutPayload);
  }

  const parsed =
    pageKey === "home"
      ? cmsHomePayloadSchema.safeParse(candidate)
      : cmsAboutPayloadSchema.safeParse(candidate);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Arabic and English required fields must be completed.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const sanitized =
    pageKey === "home"
      ? sanitizeCmsHomePayload(parsed.data as CmsHomePayload)
      : prepareAboutPayloadForStorage(parsed.data as CmsAboutPayload);

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      message:
        "Draft validated and sanitized, but DATABASE_URL is not configured so it was not persisted.",
    });
  }

  const db = getDb();
  const now = new Date();
  const pageId = `page_${pageKey}`;
  const contentId = `content_${pageKey}_draft`;
  const path = pageKey === "home" ? "/" : "/about";
  let nextVersion = 0;

  try {
    await db
      .insert(schema.cmsPages)
      .values({
        id: pageId,
        routeKey: pageKey,
        path,
        type: "marketing_page",
        status: "draft",
        createdAt: now,
        updatedAt: now,
      })
      .onDuplicateKeyUpdate({
        set: {
          updatedAt: now,
        },
      });

    await Promise.all([
      upsertPageLocale("ar", sanitized.seo.metaTitle.ar),
      upsertPageLocale("en", sanitized.seo.metaTitle.en),
    ]);

    const existing = await db
      .select()
      .from(schema.cmsPageContent)
      .where(eq(schema.cmsPageContent.id, contentId))
      .limit(1);

    nextVersion = (existing[0]?.version ?? 0) + 1;

    await db
      .insert(schema.cmsPageContent)
      .values({
        id: contentId,
        pageId,
        status: "draft",
        contentJson: sanitized,
        renderedHtmlJson: collectRenderedHtml(sanitized),
        seoJson: sanitized.seo,
        version: nextVersion,
        createdAt: now,
        updatedAt: now,
      })
      .onDuplicateKeyUpdate({
        set: {
          contentJson: sanitized,
          renderedHtmlJson: collectRenderedHtml(sanitized),
          seoJson: sanitized.seo,
          version: nextVersion,
          updatedAt: now,
        },
      });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to save draft. Check the database connection and try again.",
      },
      { status: 500 },
    );
  }

  await revalidateCmsPage(pageKey, sanitized);

  return NextResponse.json({
    ok: true,
    message: `${pageKey === "home" ? "Home" : "About"} page draft saved in MySQL.`,
    version: nextVersion,
    content: sanitized,
  });

  async function upsertPageLocale(locale: "ar" | "en", title: string) {
    await db
      .insert(schema.cmsPageLocalizations)
      .values({
        id: `page_${pageKey}_${locale}`,
        pageId,
        locale,
        title,
        createdAt: now,
        updatedAt: now,
      })
      .onDuplicateKeyUpdate({
        set: {
          title,
          updatedAt: now,
        },
      });
  }
}

async function revalidateCmsPage(pageKey: "home" | "about", payload: CmsHomePayload | CmsAboutPayload) {
  if (pageKey === "home") {
    revalidatePath("/ar");
    revalidatePath("/en");
    revalidatePath("/ar", "layout");
    revalidatePath("/en", "layout");
    return;
  }

  revalidatePath("/ar/about");
  revalidatePath("/en/about");
  revalidatePath("/ar/projects");
  revalidatePath("/en/projects");

  const aboutPayload = payload as CmsAboutPayload;
  if (aboutPayload.products) {
    for (const product of aboutPayload.products) {
      if (product.detailPage?.slug) {
        revalidatePath(`/ar/projects/${product.detailPage.slug}`);
        revalidatePath(`/en/projects/${product.detailPage.slug}`);
      }
    }
  }

  revalidatePath("/ar", "layout");
  revalidatePath("/en", "layout");
}

function collectRenderedHtml(value: unknown) {
  const rendered: Record<string, unknown> = {};

  visit(value, [], rendered);

  return rendered;
}

function visit(value: unknown, path: string[], output: Record<string, unknown>) {
  if (!value || typeof value !== "object") return;

  if (
    "html" in value &&
    typeof value.html === "object" &&
    value.html !== null &&
    "ar" in value.html &&
    "en" in value.html
  ) {
    output[path.join(".") || "root"] = value.html;
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, [...path, String(index)], output));
    return;
  }

  Object.entries(value).forEach(([key, item]) => visit(item, [...path, key], output));
}
