import { z } from "zod";
import { validationMessages } from "@/lib/validation/messages";
import { isValidImageSrc } from "@/lib/media/image-url";
import type { CmsAboutPayload, CmsHomePayload, CmsRichText, LocalizedMediaField } from "./types";
import { sanitizeRichHtml } from "./rich-text";

export const bilingualTextSchema = z.object({
  ar: z.string().min(1, validationMessages.arabicRequired),
  en: z.string().min(1, validationMessages.englishRequired),
});

export const mediaAltSchema = z.object({
  ar: z.string(),
  en: z.string(),
});

export const richTextSchema = z.object({
  json: bilingualTextSchema.optional(),
  html: bilingualTextSchema,
});

const visibleSchema = z.object({
  isVisible: z.boolean(),
});

const linkSchema = visibleSchema.extend({
  label: bilingualTextSchema,
  href: z.string().min(1),
});

const cyclePhraseSchema = visibleSchema.extend({
  id: z.string().min(1),
  phrase: bilingualTextSchema,
});

const aboutCardSchema = visibleSchema.extend({
  id: z.string().min(1),
  key: z.enum(["ai", "scale", "expertise", "mindset"]),
  title: bilingualTextSchema,
  body: richTextSchema,
  icon: z.enum(["brain", "rocket", "users", "lightbulb"]),
});

const visionMissionSchema = visibleSchema.extend({
  id: z.string().min(1),
  title: bilingualTextSchema,
  body: richTextSchema,
  icon: z.enum(["eye", "send"]),
});

const processStepSchema = visibleSchema.extend({
  id: z.string().min(1),
  number: z.string().min(1),
  title: bilingualTextSchema,
  body: richTextSchema,
});

const sectorItemSchema = visibleSchema.extend({
  id: z.string().min(1),
  title: bilingualTextSchema,
  icon: z.enum(["building2", "car", "truck", "dumbbell", "rocket", "store", "globe2"]),
});

const whyReasonSchema = visibleSchema.extend({
  id: z.string().min(1),
  text: bilingualTextSchema,
  icon: z.string().optional(),
});

const marketOutcomeSchema = visibleSchema.extend({
  id: z.string().min(1),
  label: bilingualTextSchema,
});

const footerContactMethodSchema = visibleSchema.extend({
  id: z.string().min(1),
  type: z.enum(["phone", "email", "address"]),
  label: bilingualTextSchema,
  value: z.string(),
  displayValue: bilingualTextSchema,
  href: z.string().min(1),
});

const footerSocialLinkSchema = visibleSchema.extend({
  id: z.string().min(1),
  network: z.enum(["youtube", "linkedin", "instagram", "facebook"]),
  label: bilingualTextSchema,
  href: z.string().min(1),
});

function refineNonDecorativeMediaAlt(
  value: { alt: { ar: string; en: string }; isDecorative: boolean },
  ctx: z.RefinementCtx,
) {
  if (value.isDecorative) return;

  if (!value.alt.ar.trim()) {
    ctx.addIssue({
      code: "custom",
      message: validationMessages.arabicRequired,
      path: ["alt", "ar"],
    });
  }

  if (!value.alt.en.trim()) {
    ctx.addIssue({
      code: "custom",
      message: validationMessages.englishRequired,
      path: ["alt", "en"],
    });
  }
}

const mediaFieldBaseSchema = z.object({
  defaultAssetId: z.string().nullable().default(null),
  arAssetId: z.string().nullable().optional(),
  arUrl: z.string().nullable().optional(),
  enAssetId: z.string().nullable().optional(),
  enUrl: z.string().nullable().optional(),
  alt: mediaAltSchema,
  isDecorative: z.boolean(),
});

export const optionalMediaSchema = mediaFieldBaseSchema
  .extend({
    defaultUrl: z.string(),
  })
  .superRefine((value, ctx) => {
    refineNonDecorativeMediaAlt(value, ctx);

    if (!value.isDecorative && !value.defaultUrl.trim()) {
      ctx.addIssue({
        code: "custom",
        message: validationMessages.required,
        path: ["defaultUrl"],
      });
    }
  });

export const mediaSchema = mediaFieldBaseSchema
  .extend({
    defaultUrl: z.string().min(1),
  })
  .superRefine(refineNonDecorativeMediaAlt);

const productItemSchema = visibleSchema.extend({
  id: z.string().min(1),
  key: z.enum(["diddeed", "bohamdan", "nafas", "road80"]),
  title: bilingualTextSchema,
  body: richTextSchema,
  image: mediaSchema,
  layout: z.enum(["text-start", "text-end"]),
});

const serviceItemSchema = visibleSchema.extend({
  id: z.string().min(1),
  title: bilingualTextSchema,
  body: richTextSchema,
  phoneImage: mediaSchema,
  visualImage: mediaSchema,
});

const looseBilingualTextSchema = z.object({
  ar: z.string(),
  en: z.string(),
});

const looseRichTextSchema = z.object({
  json: looseBilingualTextSchema.optional(),
  html: looseBilingualTextSchema,
});

const projectDetailHighlightSchema = z.object({
  id: z.string().min(1),
  title: looseBilingualTextSchema,
  body: looseBilingualTextSchema,
  isVisible: z.boolean(),
});

const projectDetailStatSchema = z.object({
  id: z.string().min(1),
  value: looseBilingualTextSchema,
  label: looseBilingualTextSchema,
  isVisible: z.boolean(),
});

const projectDetailGallerySchema = z.object({
  id: z.string().min(1),
  image: optionalMediaSchema,
  caption: looseBilingualTextSchema,
  isVisible: z.boolean(),
});

const projectDetailPageSchema = z.object({
  enabled: z.boolean(),
  slug: z.string(),
  seo: z.object({
    metaTitle: looseBilingualTextSchema,
    metaDescription: looseBilingualTextSchema,
    ogTitle: looseBilingualTextSchema,
    ogDescription: looseBilingualTextSchema,
    ogImage: optionalMediaSchema.nullable(),
  }),
  tagline: looseBilingualTextSchema,
  overview: looseRichTextSchema,
  highlights: z.array(projectDetailHighlightSchema),
  stats: z.array(projectDetailStatSchema),
  gallery: z.array(projectDetailGallerySchema),
  detailCtaLabel: looseBilingualTextSchema,
  detailCtaHref: z.string(),
});

const aboutProductSchema = z.object({
  id: z.string().min(1),
  number: z.string().min(1),
  title: bilingualTextSchema,
  body: richTextSchema,
  offersLabel: bilingualTextSchema,
  offers: z.array(
    z.object({
      id: z.string().min(1),
      label: bilingualTextSchema,
      isVisible: z.boolean(),
    }),
  ),
  audienceLabel: bilingualTextSchema,
  audience: z.array(
    z.object({
      id: z.string().min(1),
      label: bilingualTextSchema,
      isVisible: z.boolean(),
    }),
  ),
  downloadTitle: bilingualTextSchema,
  image: optionalMediaSchema,
  imageSide: z.enum(["left", "right"]),
  storeButtons: z.array(
    z.object({
      id: z.string().min(1),
      preLabel: bilingualTextSchema,
      label: bilingualTextSchema,
      href: z.string().min(1),
      isVisible: z.boolean(),
    }),
  ),
  isVisible: z.boolean(),
  detailPage: projectDetailPageSchema.optional(),
});

export const cmsHomePayloadSchema = z.object({
  seo: z.object({
    metaTitle: bilingualTextSchema,
    metaDescription: bilingualTextSchema,
    ogTitle: bilingualTextSchema,
    ogDescription: bilingualTextSchema,
    ogImage: mediaSchema.nullable(),
  }),
  header: z.object({
    logo: mediaSchema,
    brandName: bilingualTextSchema,
    mobileSubtitle: bilingualTextSchema,
    switchToArabicLabel: bilingualTextSchema,
    switchToEnglishLabel: bilingualTextSchema,
  }),
  loading: z.object({
    label: bilingualTextSchema,
    animation: mediaSchema,
  }),
  nav: z.array(linkSchema),
  footerLinks: z.array(linkSchema),
  hero: z.object({
    titleLine1: bilingualTextSchema,
    line2Prefix: bilingualTextSchema,
    cyclePhrases: z.array(cyclePhraseSchema),
    body: richTextSchema,
    cta: bilingualTextSchema,
    ctaHref: z.string().min(1),
    brushImage: mediaSchema,
    personImage: mediaSchema,
  }),
  aboutCards: z.array(aboutCardSchema),
  about: z.object({
    heading: bilingualTextSchema,
    body: richTextSchema,
  }),
  visionMission: z.array(visionMissionSchema),
  process: z.object({
    title: bilingualTextSchema,
    body: richTextSchema,
    steps: z.array(processStepSchema),
  }),
  products: z.object({
    title: bilingualTextSchema,
    body: richTextSchema,
    cta: bilingualTextSchema,
    ctaHref: z.string().min(1),
    items: z.array(productItemSchema),
  }),
  services: z.object({
    title: bilingualTextSchema,
    body: richTextSchema,
    carouselLabel: bilingualTextSchema,
    activeService: bilingualTextSchema,
    goToService: bilingualTextSchema,
    items: z.array(serviceItemSchema),
  }),
  sectors: z.object({
    title: bilingualTextSchema,
    body: richTextSchema,
    carouselLabel: bilingualTextSchema,
    items: z.array(sectorItemSchema),
  }),
  why: z.object({
    title: bilingualTextSchema,
    reasons: z.array(whyReasonSchema),
    phoneFrameImage: mediaSchema,
    screenImage: mediaSchema,
  }),
  market: z.object({
    title: bilingualTextSchema,
    body1: richTextSchema,
    body2: richTextSchema,
    outcomes: z.array(marketOutcomeSchema),
    visualImage: mediaSchema,
  }),
  footer: z.object({
    contactTitle: bilingualTextSchema,
    quickLinks: bilingualTextSchema,
    description: richTextSchema,
    copyright: bilingualTextSchema,
    backToTop: bilingualTextSchema,
    kuwait: bilingualTextSchema,
    logo: mediaSchema,
    contactMethods: z.array(footerContactMethodSchema),
    socialLinks: z.array(footerSocialLinkSchema),
  }),
});

export const cmsAboutPayloadSchema = z.object({
  seo: z.object({
    metaTitle: bilingualTextSchema,
    metaDescription: bilingualTextSchema,
    ogTitle: bilingualTextSchema,
    ogDescription: bilingualTextSchema,
    ogImage: mediaSchema.nullable(),
  }),
  hero: z.object({
    title: bilingualTextSchema,
    body: richTextSchema,
    cta: bilingualTextSchema,
    ctaHref: z.string().min(1),
  }),
  products: z.array(aboutProductSchema),
});

export function sanitizeCmsHomePayload(payload: CmsHomePayload): CmsHomePayload {
  return sanitizeCmsPayload(payload);
}

export function sanitizeCmsAboutPayload(payload: CmsAboutPayload): CmsAboutPayload {
  return sanitizeCmsPayload(payload);
}

function sanitizeCmsPayload<T>(payload: T): T {
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(payload)
      : (JSON.parse(JSON.stringify(payload)) as T);

  visitRichText(clone, (richText) => {
    richText.html.ar = sanitizeRichHtml(richText.html.ar);
    richText.html.en = sanitizeRichHtml(richText.html.en);
    richText.json = {
      ar: richText.html.ar,
      en: richText.html.en,
    };
  });

  visitMediaFields(clone, sanitizeMediaField);

  return clone;
}

function visitRichText(value: unknown, visitor: (richText: CmsRichText) => void) {
  if (!value || typeof value !== "object") return;

  if (isRichText(value)) {
    visitor(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => visitRichText(item, visitor));
    return;
  }

  Object.values(value).forEach((item) => visitRichText(item, visitor));
}

function isRichText(value: object): value is CmsRichText {
  return (
    "html" in value &&
    typeof value.html === "object" &&
    value.html !== null &&
    "ar" in value.html &&
    "en" in value.html
  );
}

function visitMediaFields(value: unknown, visitor: (field: LocalizedMediaField) => void) {
  if (!value || typeof value !== "object") return;

  if (isMediaField(value)) {
    visitor(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => visitMediaFields(item, visitor));
    return;
  }

  Object.values(value).forEach((item) => visitMediaFields(item, visitor));
}

function isMediaField(value: object): value is LocalizedMediaField {
  return (
    "defaultUrl" in value &&
    "alt" in value &&
    "isDecorative" in value &&
    typeof value.defaultUrl === "string"
  );
}

function sanitizeMediaField(field: LocalizedMediaField) {
  field.defaultUrl = normalizeMediaUrl(field.defaultUrl) ?? "";

  if (field.arUrl !== undefined) {
    field.arUrl = normalizeMediaUrl(field.arUrl);
    if (!field.arUrl) field.arAssetId = null;
  }

  if (field.enUrl !== undefined) {
    field.enUrl = normalizeMediaUrl(field.enUrl);
    if (!field.enUrl) field.enAssetId = null;
  }
}

function normalizeMediaUrl(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return isValidImageSrc(trimmed) ? trimmed : null;
}
