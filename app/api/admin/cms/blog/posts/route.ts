import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import type { CmsBlogPostPayload } from "@/lib/cms/blog-types";
import {
  cmsBlogPostCreateSchema,
  sanitizeCmsBlogPostPayload,
} from "@/lib/cms/blog-validation";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/ar/blog");
  revalidatePath("/en/blog");
  revalidatePath("/blogs");
  revalidatePath("/ar/blogs");
  revalidatePath("/en/blogs");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/ar/blog/${slug}`);
    revalidatePath(`/en/blog/${slug}`);
    revalidatePath(`/blogs/${slug}`);
    revalidatePath(`/ar/blogs/${slug}`);
    revalidatePath(`/en/blogs/${slug}`);
  }
}

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, posts: [] });
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(schema.blogPosts)
    .orderBy(desc(schema.blogPosts.updatedAt));

  const posts = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    status: row.status,
    payload: row.contentJson as CmsBlogPostPayload,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return NextResponse.json({ ok: true, posts });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const json = await request.json();
  const parsed = cmsBlogPostCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Complete required Arabic and English fields before saving.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { status, ...payload } = parsed.data;
  const sanitized = sanitizeCmsBlogPostPayload(payload as CmsBlogPostPayload);

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      message: "DATABASE_URL is not configured, so the post was not saved.",
    });
  }

  const db = getDb();
  const now = new Date();
  const id = randomUUID();

  const [existing] = await db
    .select({ id: schema.blogPosts.id })
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, sanitized.slug))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { ok: false, message: "A post with this slug already exists." },
      { status: 409 },
    );
  }

  const publishedAt = status === "published" ? now : null;

  await db.insert(schema.blogPosts).values({
    id,
    slug: sanitized.slug,
    status,
    contentJson: sanitized,
    publishedAt,
    createdAt: now,
    updatedAt: now,
  });

  revalidateBlogPaths(sanitized.slug);

  return NextResponse.json({
    ok: true,
    message: status === "published" ? "Post published." : "Draft saved.",
    post: {
      id,
      slug: sanitized.slug,
      status,
      payload: sanitized,
      publishedAt: publishedAt?.toISOString() ?? null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  });
}
