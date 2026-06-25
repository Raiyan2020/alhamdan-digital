import type { BilingualText, CmsLocale, CmsRichText, CmsSeo, LocalizedMediaField } from "./types";

export type BlogPostStatus = "draft" | "published" | "archived";

export type BlogCategory = "insights" | "news" | "guides";

export type CmsBlogPostPayload = {
  slug: string;
  category: BlogCategory;
  tags: string[];
  authorName: string;
  coverImage: LocalizedMediaField;
  seo: CmsSeo;
  title: BilingualText;
  excerpt: BilingualText;
  body: CmsRichText;
};

export type CmsBlogPostRecord = {
  id: string;
  slug: string;
  status: BlogPostStatus;
  payload: CmsBlogPostPayload;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LocalizedBlogPostSeo = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string | null;
};

export type LocalizedBlogPostSummary = {
  id: string;
  slug: string;
  category: BlogCategory;
  tags: string[];
  authorName: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  title: string;
  excerpt: string;
  seo: LocalizedBlogPostSeo;
  publishedAt: string | null;
  readingTimeMinutes: number;
};

export type LocalizedBlogPost = LocalizedBlogPostSummary & {
  body: string;
};

export type BlogIndexContent = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyBody: string;
};

export type CmsLocaleBlogContext = {
  locale: CmsLocale;
};
