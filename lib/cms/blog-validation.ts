import { z } from "zod";
import { slugify } from "@/lib/slugify";
import { validationMessages } from "@/lib/validation/messages";
import { slugFieldSchema } from "@/lib/validation/slug-schema";
import type { CmsBlogPostPayload } from "./blog-types";
import type { CmsRichText } from "./types";
import { sanitizeRichHtml } from "./rich-text";
import { bilingualTextSchema, optionalMediaSchema, richTextSchema } from "./validation";

export const blogCategorySchema = z.enum(["insights", "news", "guides"]);

export const cmsBlogPostPayloadSchema = z.object({
  slug: slugFieldSchema(),
  category: blogCategorySchema,
  tags: z.array(z.string().min(1, validationMessages.required).max(48)).max(12),
  authorName: z.string().min(1, validationMessages.required).max(120),
  coverImage: optionalMediaSchema,
  seo: z.object({
    metaTitle: bilingualTextSchema,
    metaDescription: bilingualTextSchema,
    ogTitle: bilingualTextSchema,
    ogDescription: bilingualTextSchema,
    ogImage: optionalMediaSchema.nullable(),
  }),
  title: bilingualTextSchema,
  excerpt: bilingualTextSchema,
  body: richTextSchema,
});

export const cmsBlogPostCreateSchema = cmsBlogPostPayloadSchema.extend({
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const cmsBlogPostUpdateSchema = cmsBlogPostCreateSchema.partial().extend({
  payload: cmsBlogPostPayloadSchema.optional(),
});

export function sanitizeCmsBlogPostPayload(payload: CmsBlogPostPayload): CmsBlogPostPayload {
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : (JSON.parse(JSON.stringify(payload)) as CmsBlogPostPayload);

  sanitizeRichTextField(clone.body);
  clone.slug = slugify(clone.slug);
  return clone;
}

function sanitizeRichTextField(richText: CmsRichText) {
  richText.html.ar = sanitizeRichHtml(richText.html.ar);
  richText.html.en = sanitizeRichHtml(richText.html.en);
  richText.json = {
    ar: richText.html.ar,
    en: richText.html.en,
  };
}

export function createEmptyBlogPostPayload(slug = ""): CmsBlogPostPayload {
  const empty = { ar: "", en: "" };
  const emptyRich = { html: { ar: "", en: "" }, json: { ar: "", en: "" } };
  const emptyMedia = {
    defaultAssetId: null,
    defaultUrl: "",
    alt: empty,
    isDecorative: true,
  };

  return {
    slug,
    category: "insights",
    tags: [],
    authorName: "Admin",
    coverImage: emptyMedia,
    seo: {
      metaTitle: empty,
      metaDescription: empty,
      ogTitle: empty,
      ogDescription: empty,
      ogImage: null,
    },
    title: empty,
    excerpt: empty,
    body: emptyRich,
  };
}
