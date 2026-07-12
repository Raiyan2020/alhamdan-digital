import { imageFallbacks, isValidImageSrc } from "@/lib/media/image-url";
import {
  ensureAboutProductsDetailPages,
  ensureProductDetailPage,
} from "./project-detail";
import type {
  BilingualText,
  CmsAboutPayload,
  CmsRichText,
  CmsSeo,
  LocalizedMediaField,
} from "./types";
import type { CmsProjectDetailPage } from "./project-detail";
import { createDefaultAboutProduct } from "./about-product-defaults";
import { sanitizeCmsAboutPayload } from "./validation";

function pickText(seed: BilingualText, current: BilingualText | undefined): BilingualText {
  return {
    ar: current?.ar?.trim() ? current.ar : seed.ar,
    en: current?.en?.trim() ? current.en : seed.en,
  };
}

function stripRichText(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function pickBilingualRichHtml(seed: BilingualText, current?: BilingualText): BilingualText {
  return {
    ar: current?.ar?.trim() && stripRichText(current.ar) ? current.ar : seed.ar,
    en: current?.en?.trim() && stripRichText(current.en) ? current.en : seed.en,
  };
}

function pickRichText(seed: CmsRichText, current: CmsRichText | undefined): CmsRichText {
  const html = pickBilingualRichHtml(seed.html, current?.html);
  return { html, json: html };
}

function pickMedia(seed: LocalizedMediaField, current: LocalizedMediaField | undefined): LocalizedMediaField {
  if (!current) return seed;
  return {
    ...seed,
    ...current,
    alt: pickText(seed.alt, current.alt),
  };
}

function pickSeo(seed: CmsSeo, current: CmsSeo | undefined): CmsSeo {
  if (!current) return seed;
  return {
    metaTitle: pickText(seed.metaTitle, current.metaTitle),
    metaDescription: pickText(seed.metaDescription, current.metaDescription),
    ogTitle: pickText(seed.ogTitle, current.ogTitle),
    ogDescription: pickText(seed.ogDescription, current.ogDescription),
    ogImage: current.ogImage ?? seed.ogImage,
  };
}

function mergeDetailPage(
  seed: CmsProjectDetailPage,
  current: CmsProjectDetailPage,
): CmsProjectDetailPage {
  return {
    ...seed,
    ...current,
    enabled: current.enabled ?? seed.enabled,
    slug: current.slug?.trim() ? current.slug : seed.slug,
    tagline: pickText(seed.tagline, current.tagline),
    overview: pickRichText(seed.overview, current.overview),
    seo: pickSeo(seed.seo, current.seo),
    highlights: current.highlights?.length ? current.highlights : seed.highlights,
    stats: current.stats?.length ? current.stats : seed.stats,
    gallery: current.gallery?.length ? current.gallery : seed.gallery,
    detailCtaLabel: pickText(seed.detailCtaLabel, current.detailCtaLabel),
    detailCtaHref: current.detailCtaHref?.trim() ? current.detailCtaHref : seed.detailCtaHref,
  };
}

function mergeAboutProduct(
  seed: CmsAboutPayload["products"][number],
  current: CmsAboutPayload["products"][number],
): CmsAboutPayload["products"][number] {
  const seedWithDetail = ensureProductDetailPage(seed);
  const currentWithDetail = ensureProductDetailPage(current);

  return ensureProductDetailPage({
    ...seedWithDetail,
    ...currentWithDetail,
    id: current.id || seed.id,
    number: current.number?.trim() ? current.number : seed.number,
    title: pickText(seed.title, current.title),
    body: pickRichText(seed.body, current.body),
    offersLabel: pickText(seed.offersLabel, current.offersLabel),
    audienceLabel: pickText(seed.audienceLabel, current.audienceLabel),
    downloadTitle: pickText(seed.downloadTitle, current.downloadTitle),
    imageSide: current.imageSide ?? seed.imageSide,
    isVisible: current.isVisible ?? seed.isVisible,
    image: pickMedia(seed.image, current.image),
    category: current.category ?? seed.category,
    sortOrder: current.sortOrder ?? seed.sortOrder,
    featuredInProjects: current.featuredInProjects ?? seed.featuredInProjects,
    projectCardDescription: pickText(seed.projectCardDescription ?? { ar: "", en: "" }, current.projectCardDescription),
    projectCardImage: current.projectCardImage ? pickMedia(seed.projectCardImage ?? current.projectCardImage, current.projectCardImage) : seed.projectCardImage,
    offers: current.offers?.length ? current.offers : seed.offers,
    audience: current.audience?.length ? current.audience : seed.audience,
    storeButtons: current.storeButtons?.length ? current.storeButtons : seed.storeButtons,
    detailPage: mergeDetailPage(seedWithDetail.detailPage, currentWithDetail.detailPage),
  });
}

export function stabilizeAboutProduct(
  product: CmsAboutPayload["products"][number],
  index: number,
  seedProduct?: CmsAboutPayload["products"][number],
): CmsAboutPayload["products"][number] {
  const seed = seedProduct ?? createDefaultAboutProduct(index);
  return mergeAboutProduct(seed, product);
}

export function coalesceAboutPayloadForSubmit(
  current: CmsAboutPayload,
  seed: CmsAboutPayload,
): CmsAboutPayload {
  return {
    ...current,
    seo: pickSeo(seed.seo, current.seo),
    hero: {
      ...seed.hero,
      ...current.hero,
      title: pickText(seed.hero.title, current.hero.title),
      body: pickRichText(seed.hero.body, current.hero.body),
      cta: pickText(seed.hero.cta, current.hero.cta),
      ctaHref: current.hero.ctaHref?.trim() ? current.hero.ctaHref : seed.hero.ctaHref,
    },
    products: current.products.map((product, index) => {
      const seedProduct =
        seed.products.find((item) => item.id === product.id) ?? seed.products[index];
      return stabilizeAboutProduct(product, index, seedProduct);
    }),
  };
}

function hasUsableMedia(field: LocalizedMediaField) {
  const url = field.defaultUrl.trim();
  if (!url) return field.isDecorative;
  return isValidImageSrc(url);
}

function pruneInvalidDetailGallery(payload: CmsAboutPayload): CmsAboutPayload {
  return {
    ...payload,
    products: payload.products.map((product) => {
      const withDetail = ensureProductDetailPage(product);

      return {
        ...withDetail,
        detailPage: {
          ...withDetail.detailPage,
          gallery: withDetail.detailPage.gallery.filter((item) => hasUsableMedia(item.image)),
        },
      };
    }),
  };
}

export function normalizeAboutPayloadForSubmit(payload: CmsAboutPayload): CmsAboutPayload {
  return pruneInvalidDetailGallery(ensureAboutProductsDetailPages(payload));
}

export function prepareAboutPayloadForStorage(payload: CmsAboutPayload): CmsAboutPayload {
  const normalized = normalizeAboutPayloadForSubmit(payload);
  const sanitized = sanitizeCmsAboutPayload(normalized);

  return {
    ...sanitized,
    products: sanitized.products.map((product) => ({
      ...product,
      image: {
        ...product.image,
        defaultUrl: isValidImageSrc(product.image.defaultUrl)
          ? product.image.defaultUrl
          : imageFallbacks.aboutProduct,
      },
    })),
  };
}
