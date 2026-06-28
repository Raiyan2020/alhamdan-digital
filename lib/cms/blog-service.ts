import { and, desc, eq, lte } from "drizzle-orm";
import { getLocale, getTranslations } from "next-intl/server";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import { estimateReadingTimeMinutes } from "./blog-slug";
import type {
  BlogIndexContent,
  BlogPostStatus,
  CmsBlogPostPayload,
  CmsBlogPostRecord,
  LocalizedBlogPost,
  LocalizedBlogPostSummary,
  PaginatedBlogSummaries,
} from "./blog-types";
import type { CmsLocale } from "./types";
import { pickLocalizedMediaUrl } from "@/lib/media/image-url";

function rowToRecord(row: typeof schema.blogPosts.$inferSelect): CmsBlogPostRecord {
  const payload = row.contentJson as CmsBlogPostPayload;

  return {
    id: row.id,
    slug: row.slug,
    status: row.status as BlogPostStatus,
    payload: { ...payload, slug: row.slug },
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function localizePostSummary(
  record: CmsBlogPostRecord,
  locale: CmsLocale,
): LocalizedBlogPostSummary {
  const { payload } = record;
  const bodyHtml = payload.body.html[locale];
  const coverImageUrl = pickLocalizedMediaUrl(payload.coverImage, locale);
  const ogImageUrl = payload.seo.ogImage
    ? pickLocalizedMediaUrl(payload.seo.ogImage, locale)
    : coverImageUrl;

  return {
    id: record.id,
    slug: record.slug,
    category: payload.category,
    tags: payload.tags,
    authorName: payload.authorName,
    coverImageUrl,
    coverImageAlt: payload.coverImage?.alt[locale] ?? "",
    title: payload.title[locale],
    excerpt: payload.excerpt[locale],
    seo: {
      metaTitle: payload.seo.metaTitle[locale],
      metaDescription: payload.seo.metaDescription[locale],
      ogTitle: payload.seo.ogTitle[locale],
      ogDescription: payload.seo.ogDescription[locale],
      ogImageUrl,
    },
    publishedAt: record.publishedAt,
    readingTimeMinutes: estimateReadingTimeMinutes(bodyHtml),
  };
}

export function localizeBlogPost(record: CmsBlogPostRecord, locale: CmsLocale): LocalizedBlogPost {
  const summary = localizePostSummary(record, locale);

  return {
    ...summary,
    body: record.payload.body.html[locale],
  };
}

export async function getBlogIndexContent(): Promise<BlogIndexContent> {
  const locale = (await getLocale()) as CmsLocale;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("index.title"),
    description: t("index.description"),
    emptyTitle: t("index.emptyTitle"),
    emptyBody: t("index.emptyBody"),
  };
}

async function getFallbackBlogRecords(): Promise<CmsBlogPostRecord[]> {
  const locale = (await getLocale()) as CmsLocale;
  const t = await getTranslations({ locale, namespace: "blog" });
  const samples = t.raw("samples") as Array<{
    id: string;
    slug: string;
    category: CmsBlogPostRecord["payload"]["category"];
    tags: string[];
    authorName: string;
    publishedAt: string;
    title: { ar: string; en: string };
    excerpt: { ar: string; en: string };
    body: { ar: string; en: string };
    seo: {
      metaTitle: { ar: string; en: string };
      metaDescription: { ar: string; en: string };
      ogTitle: { ar: string; en: string };
      ogDescription: { ar: string; en: string };
    };
  }>;

  if (!Array.isArray(samples)) return [];

  return samples.map((sample) => ({
    id: sample.id,
    slug: sample.slug,
    status: "published" as const,
    publishedAt: sample.publishedAt,
    createdAt: sample.publishedAt,
    updatedAt: sample.publishedAt,
    payload: {
      slug: sample.slug,
      category: sample.category,
      tags: sample.tags,
      authorName: sample.authorName,
      coverImage: {
        defaultAssetId: null,
        defaultUrl: "",
        alt: { ar: "", en: "" },
        isDecorative: true,
      },
      seo: {
        ...sample.seo,
        ogImage: null,
      },
      title: sample.title,
      excerpt: sample.excerpt,
      body: {
        html: sample.body,
        json: sample.body,
      },
    },
  }));
}

export async function listAdminBlogPosts(): Promise<CmsBlogPostRecord[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.blogPosts)
      .orderBy(desc(schema.blogPosts.updatedAt));

    return rows.map(rowToRecord);
  } catch (error) {
    console.warn("Failed to list blog posts:", error);
    return [];
  }
}

export async function getAdminBlogPostById(id: string): Promise<CmsBlogPostRecord | null> {
  if (!hasDatabaseUrl()) return null;

  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.id, id))
      .limit(1);

    return row ? rowToRecord(row) : null;
  } catch (error) {
    console.warn("Failed to read blog post:", error);
    return null;
  }
}

export async function getPublishedBlogPosts(): Promise<CmsBlogPostRecord[]> {
  if (!hasDatabaseUrl()) {
    return getFallbackBlogRecords();
  }

  try {
    const db = getDb();
    const now = new Date();
    const rows = await db
      .select()
      .from(schema.blogPosts)
      .where(
        and(
          eq(schema.blogPosts.status, "published"),
          lte(schema.blogPosts.publishedAt, now),
        ),
      )
      .orderBy(desc(schema.blogPosts.publishedAt));

    const records = rows.map(rowToRecord);
    return records;
  } catch (error) {
    console.warn("Falling back to bundled blog posts:", error);
    return getFallbackBlogRecords();
  }
}

export async function getPublishedBlogSummaries(): Promise<LocalizedBlogPostSummary[]> {
  const locale = (await getLocale()) as CmsLocale;
  const records = await getPublishedBlogPosts();

  return records.map((record) => localizePostSummary(record, locale));
}

export async function getLatestBlogSummaries(limit = 3): Promise<LocalizedBlogPostSummary[]> {
  const summaries = await getPublishedBlogSummaries();
  return summaries.slice(0, Math.max(0, limit));
}

export async function getPublishedBlogSummariesPage(
  page: number,
  pageSize = 6,
): Promise<PaginatedBlogSummaries> {
  const summaries = await getPublishedBlogSummaries();
  const safePageSize = Math.max(1, pageSize);
  const totalItems = summaries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;

  return {
    posts: summaries.slice(start, start + safePageSize),
    pagination: {
      currentPage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  };
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<LocalizedBlogPost | null> {
  const locale = (await getLocale()) as CmsLocale;
  const records = await getPublishedBlogPosts();
  const record = records.find((item) => item.slug === slug);

  return record ? localizeBlogPost(record, locale) : null;
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const records = await getPublishedBlogPosts();
  return records.map((record) => record.slug);
}
