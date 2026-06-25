import type { BilingualText, CmsAboutPayload, CmsLocale, CmsRichText, CmsSeo, LocalizedMediaField } from "./types";
import { slugify } from "@/lib/slugify";
import { imageFallbacks, pickLocalizedMediaUrl } from "@/lib/media/image-url";
import { localizeRichText } from "./rich-text";

export type CmsProjectDetailPage = {
  enabled: boolean;
  slug: string;
  seo: CmsSeo;
  tagline: BilingualText;
  overview: CmsRichText;
  highlights: Array<{
    id: string;
    title: BilingualText;
    body: BilingualText;
    isVisible: boolean;
  }>;
  stats: Array<{
    id: string;
    value: BilingualText;
    label: BilingualText;
    isVisible: boolean;
  }>;
  gallery: Array<{
    id: string;
    image: LocalizedMediaField;
    caption: BilingualText;
    isVisible: boolean;
  }>;
  detailCtaLabel: BilingualText;
  detailCtaHref: string;
};

export type AboutProduct = CmsAboutPayload["products"][number] & {
  detailPage: CmsProjectDetailPage;
};

export type LocalizedProjectPage = {
  id: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  body: string;
  overview: string;
  offersLabel: string;
  offers: string[];
  audienceLabel: string;
  audience: string[];
  downloadTitle: string;
  image: string;
  imageAlt: string;
  highlights: Array<{ id: string; title: string; body: string }>;
  stats: Array<{ id: string; value: string; label: string }>;
  gallery: Array<{ id: string; image: string; imageAlt: string; caption: string }>;
  storeButtons: Array<{ id: string; preLabel: string; label: string; href: string }>;
  detailCtaLabel: string;
  detailCtaHref: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string | null;
  };
};

const emptyText = (): BilingualText => ({ ar: "", en: "" });

const emptyRich = (): CmsRichText => ({
  html: { ar: "", en: "" },
  json: { ar: "", en: "" },
});

export function createDefaultProjectDetailPage(
  id: string,
  title: BilingualText,
): CmsProjectDetailPage {
  const slug = slugify(title.en) || slugify(title.ar) || id;

  return {
    enabled: false,
    slug,
    seo: {
      metaTitle: { ...title },
      metaDescription: emptyText(),
      ogTitle: { ...title },
      ogDescription: emptyText(),
      ogImage: null,
    },
    tagline: emptyText(),
    overview: emptyRich(),
    highlights: [],
    stats: [],
    gallery: [],
    detailCtaLabel: { ar: "تعرّف على المشروع", en: "Explore project" },
    detailCtaHref: "",
  };
}

export function ensureProductDetailPage(
  product: CmsAboutPayload["products"][number],
): AboutProduct {
  const withDetail = {
    ...product,
    detailPage: product.detailPage ?? createDefaultProjectDetailPage(product.id, product.title),
  };

  const fallbackSlug =
    slugify(withDetail.title.en) || slugify(withDetail.title.ar) || withDetail.id;

  return {
    ...withDetail,
    detailPage: {
      ...withDetail.detailPage,
      slug: slugify(withDetail.detailPage.slug) || fallbackSlug,
    },
  };
}

export function ensureAboutProductsDetailPages(payload: CmsAboutPayload): CmsAboutPayload {
  return {
    ...payload,
    products: payload.products.map((product) => ensureProductDetailPage(product)),
  };
}

function mediaUrl(field: LocalizedMediaField, locale: CmsLocale, fallback = "") {
  return pickLocalizedMediaUrl(field, locale, fallback);
}

export function localizeProjectPage(
  product: AboutProduct,
  locale: CmsLocale,
): LocalizedProjectPage {
  const text = (value: BilingualText) => value[locale];
  const imageUrl =
    mediaUrl(product.image, locale, imageFallbacks.aboutProduct) ??
    imageFallbacks.aboutProduct;
  const ogImage = product.detailPage.seo.ogImage
    ? mediaUrl(product.detailPage.seo.ogImage, locale, imageUrl)
    : imageUrl;

  return {
    id: product.id,
    slug: product.detailPage.slug,
    number: product.number,
    title: text(product.title),
    tagline: text(product.detailPage.tagline),
    body: localizeRichText(product.body, locale),
    overview: localizeRichText(product.detailPage.overview, locale),
    offersLabel: text(product.offersLabel),
    offers: product.offers.filter((item) => item.isVisible).map((item) => text(item.label)),
    audienceLabel: text(product.audienceLabel),
    audience: product.audience.filter((item) => item.isVisible).map((item) => text(item.label)),
    downloadTitle: text(product.downloadTitle),
    image: imageUrl,
    imageAlt: text(product.image.alt),
    highlights: product.detailPage.highlights
      .filter((item) => item.isVisible)
      .map((item) => ({
        id: item.id,
        title: text(item.title),
        body: text(item.body),
      })),
    stats: product.detailPage.stats
      .filter((item) => item.isVisible)
      .map((item) => ({
        id: item.id,
        value: text(item.value),
        label: text(item.label),
      })),
    gallery: product.detailPage.gallery
      .filter((item) => item.isVisible)
      .map((item) => ({
        id: item.id,
        image: mediaUrl(item.image, locale) ?? "",
        imageAlt: text(item.image.alt),
        caption: text(item.caption),
      }))
      .filter((item) => item.image),
    storeButtons: product.storeButtons
      .filter((item) => item.isVisible)
      .map((item) => ({
        id: item.id,
        preLabel: text(item.preLabel),
        label: text(item.label),
        href: item.href,
      })),
    detailCtaLabel: text(product.detailPage.detailCtaLabel),
    detailCtaHref: product.detailPage.detailCtaHref,
    seo: {
      metaTitle: text(product.detailPage.seo.metaTitle),
      metaDescription: text(product.detailPage.seo.metaDescription),
      ogTitle: text(product.detailPage.seo.ogTitle),
      ogDescription: text(product.detailPage.seo.ogDescription),
      ogImageUrl: ogImage,
    },
  };
}

export function findProjectProduct(payload: CmsAboutPayload, slug: string) {
  return payload.products
    .map(ensureProductDetailPage)
    .find(
      (product) =>
        product.isVisible &&
        product.detailPage.enabled &&
        (product.detailPage.slug === slug || product.id === slug),
    );
}

export function listEnabledProjectSlugs(payload: CmsAboutPayload) {
  return payload.products
    .map(ensureProductDetailPage)
    .filter((product) => product.isVisible && product.detailPage.enabled)
    .map((product) => product.detailPage.slug);
}
