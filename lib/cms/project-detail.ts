import type { BilingualText, CmsAboutPayload, CmsLocale, CmsRichText, CmsSeo, LocalizedMediaField } from "./types";
import { slugify } from "@/lib/slugify";
import { imageFallbacks, pickLocalizedMediaUrl, pickStrictLocalizedMediaUrl } from "@/lib/media/image-url";
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
    description: BilingualText;
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
  useCaseStory: BilingualText;
  useCaseVisible: boolean;
  launchOffer: BilingualText;
  launchOfferVisible: boolean;
  launchOfferTerms: BilingualText;
  launchOfferStartsAt: string;
  launchOfferEndsAt: string;
  launchOfferCtaLabel: BilingualText;
  launchOfferCtaHref: string;
  whatsappHref: string;
  mockupMedia: LocalizedMediaField | null;
  mockupVideoUrl: string;
  mockupVisible: boolean;
  comparisonVisible: boolean;
  testimonialsVisible: boolean;
  faqsVisible: boolean;
  comparisonRows: Array<{ id: string; traditional: BilingualText; withApp: BilingualText; isVisible: boolean }>;
  testimonials: Array<{ id: string; quote: BilingualText; name: BilingualText; role: BilingualText; avatar: LocalizedMediaField | null; isVisible: boolean }>;
  faqs: Array<{ id: string; question: BilingualText; answer: BilingualText; isVisible: boolean }>;
};

export type AboutProduct = CmsAboutPayload["products"][number] & {
  detailPage: CmsProjectDetailPage;
};

export type LocalizedProjectPage = {
  id: string;
  slug: string;
  number: string;
  category: "marketplace" | "property" | "fitness" | "other";
  sortOrder: number;
  featuredInProjects: boolean;
  projectCardDescription: string;
  projectCardImage: string;
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
  stats: Array<{ id: string; value: string; label: string; description?: string }>;
  gallery: Array<{ id: string; image: string; imageAlt: string; caption: string }>;
  storeButtons: Array<{ id: string; platform: "app-store" | "google-play" | "other"; preLabel: string; label: string; href: string; qrImage: string }>;
  detailCtaLabel: string;
  detailCtaHref: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string | null;
  };
  useCaseStory: string;
  comparisonRows: Array<{ traditional: string; withApp: string }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  testimonials: Array<{ id: string; quote: string; name: string; role: string; avatar: string }>;
  launchOffer: string;
  launchOfferTerms: string;
  launchOfferStartsAt: string;
  launchOfferEndsAt: string;
  launchOfferCtaLabel: string;
  launchOfferCtaHref: string;
  whatsappHref: string;
  mockupMedia: string;
  mockupVideoUrl: string;
  visibility: { useCase: boolean; launchOffer: boolean; mockup: boolean; comparison: boolean; testimonials: boolean; faqs: boolean };
};

const emptyText = (): BilingualText => ({ ar: "", en: "" });

const emptyRich = (): CmsRichText => ({
  html: { ar: "", en: "" },
  json: { ar: "", en: "" },
});
const emptyMedia = (): LocalizedMediaField => ({ defaultAssetId: null, defaultUrl: "", alt: emptyText(), isDecorative: true });

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
    useCaseStory: emptyText(),
    useCaseVisible: false,
    launchOffer: emptyText(),
    launchOfferVisible: false,
    launchOfferTerms: emptyText(),
    launchOfferStartsAt: "",
    launchOfferEndsAt: "",
    launchOfferCtaLabel: emptyText(),
    launchOfferCtaHref: "",
    whatsappHref: "",
    mockupMedia: emptyMedia(),
    mockupVideoUrl: "",
    mockupVisible: false,
    comparisonVisible: false,
    testimonialsVisible: false,
    faqsVisible: false,
    comparisonRows: [],
    testimonials: [],
    faqs: [],
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
      ...createDefaultProjectDetailPage(withDetail.id, withDetail.title),
      ...withDetail.detailPage,
      comparisonRows: withDetail.detailPage.comparisonRows ?? [],
      testimonials: (withDetail.detailPage.testimonials ?? []).map((item) => ({ ...item, role: item.role ?? emptyText(), avatar: item.avatar ?? emptyMedia() })),
      faqs: withDetail.detailPage.faqs ?? [],
      mockupMedia: withDetail.detailPage.mockupMedia ?? emptyMedia(),
      slug: slugify(withDetail.detailPage.slug) || fallbackSlug,
      stats: (withDetail.detailPage.stats ?? []).map((stat) => ({
        ...stat,
        description: stat.description ?? emptyText(),
      })),
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
  const now = Date.now();
  const startsAt = product.detailPage.launchOfferStartsAt ? new Date(product.detailPage.launchOfferStartsAt).getTime() : null;
  const endsAt = product.detailPage.launchOfferEndsAt ? new Date(product.detailPage.launchOfferEndsAt).getTime() : null;
  const launchOfferActive = product.detailPage.launchOfferVisible && (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now);

  return {
    id: product.id,
    slug: product.detailPage.slug,
    number: product.number,
    category: product.category ?? "other",
    sortOrder: product.sortOrder ?? 0,
    featuredInProjects: product.featuredInProjects ?? false,
    projectCardDescription: product.projectCardDescription ? text(product.projectCardDescription) : "",
    projectCardImage: product.projectCardImage ? mediaUrl(product.projectCardImage, locale) ?? "" : "",
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
        description: item.description ? text(item.description) : "",
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
    storeButtons: (product.storeButtons || [])
      .filter((item) => item.isVisible)
      .map((item) => ({
        id: item.id,
        platform: item.platform ?? "other",
        preLabel: text(item.preLabel),
        label: text(item.label),
        href: item.href,
        qrImage: pickStrictLocalizedMediaUrl(item.qrImage, locale),
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
    useCaseStory: text(product.detailPage.useCaseStory) || text(product.detailPage.tagline) || text(product.title),
    comparisonRows: product.detailPage.comparisonRows.filter((row) => row.isVisible).map((row) => ({ traditional: text(row.traditional), withApp: text(row.withApp) })),
    faqs: product.detailPage.faqs.filter((faq) => faq.isVisible).map((faq) => ({ id: faq.id, question: text(faq.question), answer: text(faq.answer) })),
    testimonials: product.detailPage.testimonials.filter((item) => item.isVisible).map((item) => ({ id: item.id, quote: text(item.quote), name: text(item.name), role: text(item.role), avatar: item.avatar ? mediaUrl(item.avatar, locale) ?? "" : "" })),
    launchOffer: text(product.detailPage.launchOffer),
    launchOfferTerms: text(product.detailPage.launchOfferTerms),
    launchOfferStartsAt: product.detailPage.launchOfferStartsAt,
    launchOfferEndsAt: product.detailPage.launchOfferEndsAt,
    launchOfferCtaLabel: text(product.detailPage.launchOfferCtaLabel),
    launchOfferCtaHref: product.detailPage.launchOfferCtaHref,
    whatsappHref: product.detailPage.whatsappHref,
    mockupMedia: product.detailPage.mockupMedia ? mediaUrl(product.detailPage.mockupMedia, locale) ?? "" : (galleryUrl(product, locale) ?? ""),
    mockupVideoUrl: product.detailPage.mockupVideoUrl,
    visibility: {
      useCase: product.detailPage.useCaseVisible,
      launchOffer: launchOfferActive,
      mockup: product.detailPage.mockupVisible,
      comparison: product.detailPage.comparisonVisible,
      testimonials: product.detailPage.testimonialsVisible,
      faqs: product.detailPage.faqsVisible,
    },
  };
}

function galleryUrl(product: AboutProduct, locale: CmsLocale) {
  return product.detailPage.gallery.find((item) => item.isVisible)?.image ? mediaUrl(product.detailPage.gallery.find((item) => item.isVisible)!.image, locale) : "";
}

export function findProjectProduct(payload: CmsAboutPayload, slug: string) {
  return payload.products
    .map(ensureProductDetailPage)
    .find(
      (product) =>
        product.isVisible &&
        (product.detailPage.slug === slug || product.id === slug),
    );
}

export function listEnabledProjectSlugs(payload: CmsAboutPayload) {
  return payload.products
    .map(ensureProductDetailPage)
    .filter((product) => product.isVisible && product.detailPage.enabled)
    .map((product) => product.detailPage.slug);
}
