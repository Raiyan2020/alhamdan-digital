import { and, eq, ne } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import type { BlogPostStatus, CmsBlogPostPayload } from "@/lib/cms/blog-types";
import {
  blogPostStatusSchema,
  cmsBlogPostPayloadSchema,
  sanitizeCmsBlogPostPayload,
} from "@/lib/cms/blog-validation";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_request: NextRequest, context: Context) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: false, message: "Post not found." }, { status: 404 });
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.id, id))
    .limit(1);

  if (!row) {
    return NextResponse.json({ ok: false, message: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    post: {
      id: row.id,
      slug: row.slug,
      status: row.status,
      payload: row.contentJson as CmsBlogPostPayload,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    },
  });
}

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const body = json && typeof json === "object" ? json as Record<string, unknown> : {};
  const statusParsed = body.status ? blogPostStatusSchema.safeParse(body.status) : null;
  const status = statusParsed?.success ? statusParsed.data : undefined;
  const payloadParsed = body.payload
    ? cmsBlogPostPayloadSchema.safeParse(body.payload)
    : null;

  if (statusParsed && !statusParsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid post status." },
      { status: 400 },
    );
  }

  if (payloadParsed && !payloadParsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Complete required Arabic and English fields before saving.",
        issues: payloadParsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      message: "DATABASE_URL is not configured, so the post was not saved.",
    });
  }

  const db = getDb();
  const [existing] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ ok: false, message: "Post not found." }, { status: 404 });
  }

  const now = new Date();
  const sanitized = payloadParsed?.success
    ? sanitizeCmsBlogPostPayload(payloadParsed.data as CmsBlogPostPayload)
    : (existing.contentJson as CmsBlogPostPayload);
  const nextStatus = status ?? (existing.status as BlogPostStatus);
  const nextSlug = sanitized.slug;

  const [slugConflict] = await db
    .select({ id: schema.blogPosts.id })
    .from(schema.blogPosts)
    .where(and(eq(schema.blogPosts.slug, nextSlug), ne(schema.blogPosts.id, id)))
    .limit(1);

  if (slugConflict) {
    return NextResponse.json(
      { ok: false, message: "A post with this slug already exists." },
      { status: 409 },
    );
  }

  const wasPublished = existing.status === "published";
  const publishedAt =
    nextStatus === "published"
      ? existing.publishedAt ?? now
      : nextStatus === "draft"
        ? null
        : existing.publishedAt;

  await db
    .update(schema.blogPosts)
    .set({
      slug: nextSlug,
      status: nextStatus,
      contentJson: sanitized,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(schema.blogPosts.id, id));

  revalidateBlogPaths(existing.slug);
  if (existing.slug !== nextSlug) revalidateBlogPaths(nextSlug);

  return NextResponse.json({
    ok: true,
    message:
      nextStatus === "published" && !wasPublished ? "Post published." : "Post saved.",
    post: {
      id,
      slug: nextSlug,
      status: nextStatus,
      payload: sanitized,
      publishedAt: publishedAt?.toISOString() ?? null,
      createdAt: existing.createdAt.toISOString(),
      updatedAt: now.toISOString(),
    },
  });
}

export async function DELETE(_request: NextRequest, context: Context) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const { id } = await context.params;

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      message: "DATABASE_URL is not configured.",
    });
  }

  const db = getDb();
  const [existing] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.id, id))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ ok: false, message: "Post not found." }, { status: 404 });
  }

  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
  revalidateBlogPaths(existing.slug);

  return NextResponse.json({ ok: true, message: "Post deleted." });
}
