import { eq } from "drizzle-orm";
import { getLocale, getTranslations } from "next-intl/server";
import { sectionIds } from "@/components/home/data";
import type { AboutCardIconKey, SectorIconKey } from "@/components/home/sector-icons";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import type {
  BilingualText,
  CmsAboutPayload,
  CmsHomePayload,
  CmsLocale,
  LocalizedAboutContent,
  LocalizedHomeContent,
  LocalizedMediaField,
} from "./types";
import { makeRichText, localizeRichText } from "./rich-text";
import { fixMojibakeDeep } from "./fix-encoding";
import { imageFallbacks, pickLocalizedMediaUrl, pickStrictLocalizedMediaUrl } from "@/lib/media/image-url";
import { sanitizeCmsAboutPayload, sanitizeCmsHomePayload } from "./validation";
import {
  createDefaultProjectDetailPage,
  ensureAboutProductsDetailPages,
  ensureProductDetailPage,
} from "./project-detail";
import { createDefaultAboutProduct } from "./about-product-defaults";
import { slugify } from "@/lib/slugify";

type StoredCmsContent = {
  home?: CmsHomePayload;
  about?: CmsAboutPayload;
};

const locales: CmsLocale[] = ["ar", "en"];

export async function getHomeContent(): Promise<LocalizedHomeContent> {
  const locale = (await getLocale()) as CmsLocale;
  const [payload, about] = await Promise.all([getCmsHomePayload(), getCmsAboutPayload()]);

  return localizeHomePayload(payload, locale, about.products);
}

export async function getCmsHomePayload(): Promise<CmsHomePayload> {
  const stored = await readStoredHomePayload();
  if (stored) return mergeHomeFallback(stored, await getFallbackHomePayload());

  return getFallbackHomePayload();
}

function mergeHomeFallback(stored: CmsHomePayload, fallback: CmsHomePayload): CmsHomePayload {
  const repaired = fixMojibakeDeep(stored);
  return sanitizeCmsHomePayload({
    ...fallback,
    ...repaired,
    seo: { ...fallback.seo, ...repaired.seo },
    header: { ...fallback.header, ...repaired.header },
    loading: { ...fallback.loading, ...repaired.loading },
    hero: { ...fallback.hero, ...repaired.hero },
    footer: { ...fallback.footer, ...repaired.footer },
  });
}

export async function getAboutContent(): Promise<LocalizedAboutContent> {
  const locale = (await getLocale()) as CmsLocale;
  const payload = await getCmsAboutPayload();

  return localizeAboutPayload(payload, locale);
}

export async function getCmsAboutPayload(): Promise<CmsAboutPayload> {
  const [stored, fallback] = await Promise.all([
    readStoredAboutPayload(),
    getFallbackAboutPayload(),
  ]);

  if (!stored) {
    const home = await getCmsHomePayload();
    return mergeLegacyHomeProducts(ensureAboutProductsDetailPages(fallback), home);
  }

  const repaired = sanitizeCmsAboutPayload(fixMojibakeDeep(stored));
  const payload: CmsAboutPayload = {
    ...fallback,
    ...repaired,
    seo: { ...fallback.seo, ...repaired.seo },
    hero: { ...fallback.hero, ...repaired.hero },
    products: repaired.products.length > 0 ? repaired.products : fallback.products,
  };

  return ensureAboutProductsDetailPages(payload);
}

function mergeLegacyHomeProducts(about: CmsAboutPayload, home: CmsHomePayload): CmsAboutPayload {
  const products = [...about.products];
  const identities = new Set(products.flatMap((product) => [product.id, slugify(product.title.ar), slugify(product.title.en)].filter(Boolean)));
  for (const legacy of home.products.items) {
    const candidates = [legacy.id, legacy.key, slugify(legacy.title.ar), slugify(legacy.title.en)].filter(Boolean);
    if (candidates.some((candidate) => identities.has(candidate))) continue;
    const product = createDefaultAboutProduct(products.length);
    product.id = legacy.id || legacy.key;
    product.number = `${String(products.length + 1).padStart(2, "0")}/`;
    product.title = legacy.title;
    product.body = legacy.body;
    product.image = legacy.image;
    product.imageSide = legacy.layout === "text-start" ? "right" : "left";
    product.isVisible = legacy.isVisible;
    product.sortOrder = products.length;
    product.detailPage = createDefaultProjectDetailPage(product.id, product.title);
    products.push(product);
    candidates.forEach((candidate) => identities.add(candidate));
  }
  return { ...about, products };
}

async function readStoredHomePayload() {
  const stored = await readStoredPagePayload("home");
  if (!stored) return null;
  if ("home" in stored && stored.home) return stored.home;
  if ("hero" in stored) return stored as CmsHomePayload;

  return null;
}

async function readStoredAboutPayload() {
  const stored = await readStoredPagePayload("about");
  if (!stored) return null;
  if (
    "about" in stored &&
    stored.about &&
    typeof stored.about === "object" &&
    "seo" in stored.about &&
    "hero" in stored.about &&
    "products" in stored.about
  ) {
    return stored.about as CmsAboutPayload;
  }
  if ("products" in stored && "hero" in stored) return stored as CmsAboutPayload;

  return null;
}

async function readStoredPagePayload(routeKey: "home" | "about") {
  if (!hasDatabaseUrl()) return null;

  try {
    const db = getDb();
    const contentId = `content_${routeKey}_draft`;
    const [content] = await db
      .select()
      .from(schema.cmsPageContent)
      .where(eq(schema.cmsPageContent.id, contentId))
      .limit(1);

    const stored = content?.contentJson as StoredCmsContent | CmsHomePayload | CmsAboutPayload | undefined;
    if (!stored) return null;
    return stored;
  } catch {
    // Silent fail and fallback
  }

  return null;
}

export async function getFallbackHomePayload(): Promise<CmsHomePayload> {
  const [ar, en] = await Promise.all(locales.map((locale) => readMessages(locale)));
  const b = (selector: (messages: Awaited<ReturnType<typeof readMessages>>) => string): BilingualText => ({
    ar: selector(ar),
    en: selector(en),
  });
  const rich = (selector: (messages: Awaited<ReturnType<typeof readMessages>>) => string) =>
    makeRichText(b(selector));
  const media = (url: string, alt: BilingualText = { ar: "", en: "" }): LocalizedMediaField => ({
    defaultAssetId: null,
    defaultUrl: url,
    alt,
    isDecorative: !alt.ar && !alt.en,
  });

  return {
    seo: {
      metaTitle: b((m) => m.metadata.homeTitle),
      metaDescription: b((m) => m.metadata.homeDescription),
      ogTitle: b((m) => m.metadata.homeTitle),
      ogDescription: b((m) => m.metadata.homeDescription),
      ogImage: null,
    },
    header: {
      logo: media("/figma/logo-header.webp", { ar: "Al Hamdan Digital", en: "Al Hamdan Digital" }),
      brandName: { ar: "Al Hamdan Digital", en: "Al Hamdan Digital" },
      mobileSubtitle: b((m) => m.shell.mobileSubtitle),
      switchToArabicLabel: b((m) => m.nav.switchToArabic),
      switchToEnglishLabel: b((m) => m.nav.switchToEnglish),
    },
    loading: {
      label: b((m) => m.shell.loadingLabel),
      animation: media("/loading-kuwait.lottie", b((m) => m.shell.loadingLabel)),
    },
    nav: [
      { label: b((m) => m.nav.home), href: `/#${sectionIds.hero}`, isVisible: true },
      { label: b((m) => m.nav.about), href: "/about", isVisible: true },
      { label: b((m) => m.nav.products), href: "/projects", isVisible: true },
      { label: b((m) => m.nav.services), href: `/#${sectionIds.services}`, isVisible: true },
      { label: b((m) => m.nav.blog), href: "/blogs", isVisible: true },
      { label: b((m) => m.nav.why), href: `/#${sectionIds.why}`, isVisible: true },
    ],
    footerLinks: [
      { label: b((m) => m.nav.home), href: `/#${sectionIds.hero}`, isVisible: true },
      { label: b((m) => m.nav.about), href: `/#${sectionIds.about}`, isVisible: true },
      { label: b((m) => m.footer.products), href: `/#${sectionIds.products}`, isVisible: true },
      { label: b((m) => m.nav.projects), href: "/projects", isVisible: true },
      { label: b((m) => m.nav.services), href: `/#${sectionIds.services}`, isVisible: true },
      { label: b((m) => m.nav.blog), href: "/blogs", isVisible: true },
    ],
    hero: {
      titleLine1: b((m) => m.hero.titleLine1),
      line2Prefix: b((m) => m.hero.titleLine2Prefix),
      cyclePhrases: [
        { id: "ai", phrase: b((m) => m.hero.titleCycleAi), isVisible: true },
        { id: "expertise", phrase: b((m) => m.hero.titleCycleExpertise), isVisible: true },
      ],
      body: rich((m) => m.hero.body),
      cta: b((m) => m.hero.cta),
      ctaHref: `/#${sectionIds.products}`,
      brushImage: media("/bg-hero.png"),
      personImage: media("/figma/hero-person-layer.webp"),
    },
    aboutCards: [
      card("ai", "ai", "brain"),
      card("scale", "scale", "rocket"),
      card("expertise", "expertise", "users"),
      card("mindset", "mindset", "lightbulb"),
    ],
    about: {
      heading: b((m) => m.about.heading),
      body: rich((m) => m.about.body),
    },
    visionMission: [
      {
        id: "vision",
        title: b((m) => m.visionMission.visionTitle),
        body: rich((m) => m.visionMission.visionBody),
        icon: "eye",
        isVisible: true,
      },
      {
        id: "mission",
        title: b((m) => m.visionMission.missionTitle),
        body: rich((m) => m.visionMission.missionBody),
        icon: "send",
        isVisible: true,
      },
    ],
    process: {
      title: b((m) => m.process.title),
      body: rich((m) => m.process.body),
      steps: Array.from({ length: 6 }, (_, index) => {
        const step = String(index + 1) as "1" | "2" | "3" | "4" | "5" | "6";
        return {
          id: `step-${step}`,
          number: `0${step}`,
          title: b((m) => m.process.steps[step].title),
          body: rich((m) => m.process.steps[step].body),
          isVisible: true,
        };
      }),
    },
    products: {
      title: b((m) => m.products.title),
      body: rich((m) => m.products.body),
      cta: b((m) => m.products.cta),
      ctaHref: "/projects",
      items: [
        product("diddeed", "/figma/market-visual.webp", "text-start"),
        product("bohamdan", "/figma/services-phone.webp", "text-start"),
        product("nafas", "/figma/why-phone.webp", "text-end"),
        product("road80", "/figma/services-phone.webp", "text-end"),
      ],
    },
    services: {
      title: b((m) => m.services.title),
      body: rich((m) => m.services.body),
      carouselLabel: b((m) => m.services.carouselLabel),
      activeService: b((m) => m.services.activeService),
      goToService: b((m) => m.services.goToService),
      items: [
        service("mobile", "/figma/services-phone.webp", "/figma/services-visual.webp"),
        service("marketing", "/figma/hero-visual.webp", "/figma/services-visual.webp"),
        service("ai", "/figma/market-visual.webp", "/figma/services-visual.webp"),
        service("products", "/figma/why-phone.webp", "/figma/services-visual.webp"),
      ],
    },
    sectors: {
      title: b((m) => m.sectors.title),
      body: rich((m) => m.sectors.body),
      carouselLabel: b((m) => m.sectors.carouselLabel),
      items: [
        sector("companies", "building2"),
        sector("cars", "car"),
        sector("realestate", "building2"),
        sector("transport", "truck"),
        sector("health", "dumbbell"),
        sector("startups", "rocket"),
        sector("commerce", "store"),
        sector("any", "globe2"),
      ],
    },
    why: {
      title: b((m) => m.why.title),
      reasons: Array.from({ length: 6 }, (_, index) => {
        const key = String(index + 1) as "1" | "2" | "3" | "4" | "5" | "6";
        return { id: `reason-${key}`, text: b((m) => m.why.reasons[key]), isVisible: true };
      }),
      phoneFrameImage: media("/figma/why-phone.webp"),
      screenImage: media("/full-website.png"),
    },
    market: {
      title: b((m) => m.market.title),
      body1: rich((m) => m.market.body1),
      body2: rich((m) => m.market.body2),
      outcomes: Array.from({ length: 5 }, (_, index) => {
        const key = String(index + 1) as "1" | "2" | "3" | "4" | "5";
        return { id: `outcome-${key}`, label: b((m) => m.market.outcomes[key]), isVisible: true };
      }),
      visualImage: media("/figma/market-visual.webp"),
    },
    footer: {
      whatsappVisible: true,
      whatsappNumber: "201212043552",
      whatsappMessage: { ar: "مرحبا، أحتاج مساعدة", en: "Hello, I need some help" },
      contactTitle: b((m) => m.footer.contactTitle),
      quickLinks: b((m) => m.footer.quickLinks),
      description: rich((m) => m.footer.description),
      copyright: b((m) => m.footer.copyright),
      backToTop: b((m) => m.footer.backToTop),
      kuwait: b((m) => m.footer.kuwait),
      logo: media("/figma/logo-footer.webp", { ar: "Al Hamdan Digital", en: "Al Hamdan Digital" }),
      contactMethods: [
        contact("phone", "phone", "(+20) 1212043552", "(+20) 1212043552", "tel:+201212043552"),
        contact("email", "email", "info@alhamdan.digital", "info@alhamdan.digital", "mailto:info@alhamdan.digital"),
        contact("address", "address", "Kuwait", "", "#"),
      ],
      socialLinks: [
        social("youtube"),
        social("linkedin"),
        social("instagram"),
        social("facebook"),
      ],
    },
  };

  function card(
    id: "ai" | "scale" | "expertise" | "mindset",
    key: "ai" | "scale" | "expertise" | "mindset",
    icon: AboutCardIconKey,
  ) {
    return {
      id,
      key,
      title: b((m) => m.about.cards[key].title),
      body: rich((m) => m.about.cards[key].body),
      icon,
      isVisible: true,
    };
  }

  function product(
    key: "diddeed" | "bohamdan" | "nafas" | "road80",
    image: string,
    layout: "text-start" | "text-end",
  ) {
    return {
      id: key,
      key,
      title: b((m) => m.products.items[key].title),
      body: rich((m) => m.products.items[key].body),
      image: media(image),
      layout,
      isVisible: true,
    };
  }

  function service(
    key: "mobile" | "marketing" | "ai" | "products",
    phoneImage: string,
    visualImage: string,
  ) {
    return {
      id: key,
      title: b((m) => m.services.items[key].title),
      body: rich((m) => m.services.items[key].body),
      phoneImage: media(phoneImage),
      visualImage: media(visualImage),
      isVisible: true,
    };
  }

  function sector(key: keyof typeof ar.sectors.items, icon: SectorIconKey) {
    return {
      id: key,
      title: b((m) => m.sectors.items[key]),
      icon,
      isVisible: true,
    };
  }

  function contact(
    id: "phone" | "email" | "address",
    type: "phone" | "email" | "address",
    value: string,
    displayValue: string,
    href: string,
  ) {
    return {
      id,
      type,
      label: { ar: id, en: id },
      value,
      displayValue: type === "address" ? b((m) => m.footer.kuwait) : { ar: displayValue, en: displayValue },
      href,
      isVisible: true,
    };
  }

  function social(network: "youtube" | "linkedin" | "instagram" | "facebook") {
    return {
      id: network,
      network,
      label: b((m) => m.footer[network]),
      href: "#",
      isVisible: true,
    };
  }
}

export async function getFallbackAboutPayload(): Promise<CmsAboutPayload> {
  const [ar, en] = await Promise.all(locales.map((locale) => readMessages(locale)));
  const b = (selector: (messages: Awaited<ReturnType<typeof readMessages>>) => string): BilingualText => ({
    ar: selector(ar),
    en: selector(en),
  });
  const rich = (selector: (messages: Awaited<ReturnType<typeof readMessages>>) => string) =>
    makeRichText(b(selector));
  const media = (url: string, alt: BilingualText = { ar: "", en: "" }): LocalizedMediaField => ({
    defaultAssetId: null,
    defaultUrl: url,
    alt,
    isDecorative: !alt.ar && !alt.en,
  });

  type AboutProductKey = keyof typeof ar.aboutPage.products;
  const productOrder: Array<{
    id: AboutProductKey;
    number: string;
    image: string;
    imageSide: "left" | "right";
  }> = [
    { id: "bohamdan", number: "01/", image: "/figma/services-phone.webp", imageSide: "left" },
    { id: "nafas", number: "02/", image: "/figma/market-visual.webp", imageSide: "right" },
    { id: "diddeed", number: "03/", image: "/figma/hero-visual.webp", imageSide: "left" },
    { id: "road80", number: "04/", image: "/figma/hero-visual.webp", imageSide: "right" },
  ];

  const storeButtons = [
    {
      id: "app-store",
      platform: "app-store" as const,
      preLabel: b((m) => m.aboutPage.labels.storePreLabel),
      label: { ar: "App Store", en: "App Store" },
      href: "#",
      isVisible: true,
    },
    {
      id: "google-play",
      platform: "google-play" as const,
      preLabel: b((m) => m.aboutPage.labels.storePreLabel),
      label: { ar: "Google Play", en: "Google Play" },
      href: "#",
      isVisible: true,
    },
  ];

  return {
    seo: {
      metaTitle: b((m) => m.aboutPage.seo.metaTitle),
      metaDescription: b((m) => m.aboutPage.seo.metaDescription),
      ogTitle: b((m) => m.aboutPage.seo.ogTitle),
      ogDescription: b((m) => m.aboutPage.seo.ogDescription),
      ogImage: null,
    },
    hero: {
      title: b((m) => m.aboutPage.hero.title),
      body: rich((m) => m.aboutPage.hero.body),
      cta: b((m) => m.aboutPage.hero.cta),
      ctaHref: "#about-products",
    },
    products: productOrder.map((item) => {
      const title = b((m) => m.aboutPage.products[item.id].title);
      const overview = rich((m) => m.aboutPage.products[item.id].body);
      const detail = createDefaultProjectDetailPage(item.id, title);
      detail.enabled = true;
      detail.slug = item.id;
      detail.tagline = b((m) => m.aboutPage.products[item.id].title);
      detail.overview = overview;
      detail.seo.metaDescription = b((m) => m.aboutPage.products[item.id].body);
      detail.seo.ogDescription = detail.seo.metaDescription;
      detail.highlights = ar.aboutPage.products[item.id].offers.slice(0, 3).map((label, index) => ({
        id: `${item.id}-highlight-${index + 1}`,
        title: {
          ar: label,
          en: en.aboutPage.products[item.id].offers[index] ?? label,
        },
        body: {
          ar: "ميزة أساسية ضمن تجربة المنتج.",
          en: "A core capability inside the product experience.",
        },
        isVisible: true,
      }));
      detail.stats = [
        {
          id: `${item.id}-stat-1`,
          value: { ar: "4", en: "4" },
          label: { ar: "قطاعات مستهدفة", en: "Target sectors" },
          description: { ar: "", en: "" },
          isVisible: true,
        },
        {
          id: `${item.id}-stat-2`,
          value: { ar: "24/7", en: "24/7" },
          label: { ar: "تجربة رقمية", en: "Digital experience" },
          description: { ar: "", en: "" },
          isVisible: true,
        },
      ];

      return {
        id: item.id,
        number: item.number,
        title,
        body: overview,
        offersLabel: b((m) => m.aboutPage.labels.offers),
        offers: ar.aboutPage.products[item.id].offers.map((label, index) => ({
          id: `${item.id}-offer-${index + 1}`,
          label: { ar: label, en: en.aboutPage.products[item.id].offers[index] ?? label },
          isVisible: true,
        })),
        audienceLabel: b((m) => m.aboutPage.labels.audience),
        audience: ar.aboutPage.products[item.id].audience.map((label, index) => ({
          id: `${item.id}-audience-${index + 1}`,
          label: { ar: label, en: en.aboutPage.products[item.id].audience[index] ?? label },
          isVisible: true,
        })),
        downloadTitle: b((m) => m.aboutPage.labels.downloadTitle),
        image: media(item.image, title),
        imageSide: item.imageSide,
        storeButtons,
        isVisible: true,
        detailPage: detail,
      };
    }),
  };
}

export function localizeHomePayload(payload: CmsHomePayload, locale: CmsLocale, canonicalProducts?: CmsAboutPayload["products"]): LocalizedHomeContent {
  const text = (value: BilingualText) => value[locale];
  const mediaUrl = (field: LocalizedMediaField, fallback = "") =>
    pickLocalizedMediaUrl(field, locale, fallback) ?? fallback;
  const mediaAlt = (field: LocalizedMediaField) => text(field.alt);
  const blogLabel = locale === "ar" ? "المدونة" : "Blog";
  const normalizeHref = (href: string) => {
    if (href === "/blog") return "/blogs";
    if (href === `/#${sectionIds.products}`) return "/projects";
    return href;
  };
  const nav = payload.nav.filter((item) => item.isVisible).map((item) => ({
    key: normalizeHref(item.href),
    label: text(item.label),
    href: normalizeHref(item.href),
  }));
  const footerLinks = payload.footerLinks
    .filter((item) => item.isVisible && item.href !== `/#${sectionIds.contact}`)
    .map((item) => ({
      label: text(item.label),
      href: normalizeHref(item.href),
    }));

  if (!nav.some((item) => item.href === "/blogs")) {
    nav.push({ key: "/blogs", label: blogLabel, href: "/blogs" });
  }

  if (!footerLinks.some((item) => item.href === "/blogs")) {
    footerLinks.push({ label: blogLabel, href: "/blogs" });
  }

  return {
    header: {
      logo: mediaUrl(payload.header.logo, imageFallbacks.headerLogo),
      logoAlt: mediaAlt(payload.header.logo),
      brandName: text(payload.header.brandName),
      mobileSubtitle: text(payload.header.mobileSubtitle),
      switchToArabicLabel: text(payload.header.switchToArabicLabel),
      switchToEnglishLabel: text(payload.header.switchToEnglishLabel),
    },
    loading: {
      label: text(payload.loading.label),
      animation: mediaUrl(payload.loading.animation, "/loading-kuwait.lottie"),
    },
    nav,
    footerLinks,
    hero: {
      titleLine1: text(payload.hero.titleLine1),
      line2Prefix: text(payload.hero.line2Prefix),
      cyclePhrases: payload.hero.cyclePhrases.filter((item) => item.isVisible).map((item) => text(item.phrase)),
      body: localizeRichText(payload.hero.body, locale),
      cta: text(payload.hero.cta),
      ctaHref: payload.hero.ctaHref,
      brushImage: mediaUrl(payload.hero.brushImage, "/bg-hero.png"),
      personImage: mediaUrl(payload.hero.personImage, "/figma/hero-person-layer.webp"),
      personImageAlt: mediaAlt(payload.hero.personImage),
    },
    aboutCards: payload.aboutCards.filter((item) => item.isVisible).map((item) => ({
      key: item.key,
      title: text(item.title),
      body: localizeRichText(item.body, locale),
      icon: item.icon,
    })),
    about: {
      heading: text(payload.about.heading),
      body: localizeRichText(payload.about.body, locale),
    },
    visionMission: payload.visionMission.filter((item) => item.isVisible).map((item) => ({
      title: text(item.title),
      body: localizeRichText(item.body, locale),
      icon: item.icon,
    })),
    process: {
      title: text(payload.process.title),
      body: localizeRichText(payload.process.body, locale),
      steps: payload.process.steps.filter((item) => item.isVisible).map((item) => ({
        number: item.number,
        title: text(item.title),
        body: localizeRichText(item.body, locale),
      })),
    },
    products: {
      title: text(payload.products.title),
      body: localizeRichText(payload.products.body, locale),
      cta: text(payload.products.cta),
      ctaHref: payload.products.ctaHref,
      items: canonicalProducts
        ? canonicalProducts.filter((item) => item.isVisible).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => {
            const withDetail = ensureProductDetailPage(item);
            const projectSlug = withDetail.detailPage.slug;
            return {
              key: item.id,
              title: text(item.title),
              body: localizeRichText(item.body, locale),
              image: item.projectCardImage ? mediaUrl(item.projectCardImage, mediaUrl(item.image, imageFallbacks.aboutProduct)) : mediaUrl(item.image, imageFallbacks.aboutProduct),
              imageAlt: mediaAlt(item.projectCardImage ?? item.image),
              layout: item.imageSide === "right" ? "text-start" as const : "text-end" as const,
              storeButtons: (item.storeButtons || []).filter((btn) => btn.isVisible && (btn.platform === "app-store" || btn.platform === "google-play")).map((btn) => ({
                id: btn.id,
                platform: (btn.platform ?? "other") as "app-store" | "google-play" | "other",
                label: text(btn.label),
                href: btn.href,
                qrImage: pickStrictLocalizedMediaUrl(btn.qrImage, locale),
              })),
              projectSlug,
              projectHref: projectSlug ? `/projects/${projectSlug}` : null,
              stats: (withDetail.detailPage.stats || [])
                .filter((s) => s.isVisible)
                .map((s) => ({
                  id: s.id,
                  value: text(s.value),
                  label: text(s.label),
                })),
            };
          })
        : payload.products.items.filter((item) => item.isVisible).map((item) => ({
            key: item.key,
            title: text(item.title),
            body: localizeRichText(item.body, locale),
            image: mediaUrl(item.image, imageFallbacks.aboutProduct),
            imageAlt: mediaAlt(item.image),
            layout: item.layout,
            storeButtons: [],
            projectSlug: null,
            projectHref: null,
            stats: [],
          })),
    },
    appDownloadLinks: (() => {
      const sources = canonicalProducts ?? [];
      const seen = new Set<string>();
      const links: Array<{ id: string; platform: "app-store" | "google-play" | "other"; label: string; href: string }> = [];
      for (const product of sources) {
        if (!product.isVisible) continue;
        for (const btn of product.storeButtons) {
          if (!btn.isVisible) continue;
          const platform = btn.platform ?? "other";
          if (seen.has(platform)) continue;
          seen.add(platform);
          links.push({ id: btn.id, platform, label: text(btn.label), href: btn.href });
        }
        if (seen.has("app-store") && seen.has("google-play")) break;
      }
      return links;
    })(),
    services: {
      title: text(payload.services.title),
      body: localizeRichText(payload.services.body, locale),
      carouselLabel: text(payload.services.carouselLabel),
      activeService: text(payload.services.activeService),
      goToService: text(payload.services.goToService),
      items: payload.services.items.filter((item) => item.isVisible).map((item) => ({
        title: text(item.title),
        body: localizeRichText(item.body, locale),
        phoneImage: mediaUrl(item.phoneImage),
        phoneImageAlt: mediaAlt(item.phoneImage),
        visualImage: mediaUrl(item.visualImage),
        visualImageAlt: mediaAlt(item.visualImage),
      })),
    },
    sectors: {
      title: text(payload.sectors.title),
      body: localizeRichText(payload.sectors.body, locale),
      carouselLabel: text(payload.sectors.carouselLabel),
      items: payload.sectors.items.filter((item) => item.isVisible).map((item) => ({
        id: item.id,
        title: text(item.title),
        icon: item.icon,
      })),
    },
    why: {
      title: text(payload.why.title),
      reasons: payload.why.reasons.filter((item) => item.isVisible).map((item) => text(item.text)),
      phoneFrameImage: mediaUrl(payload.why.phoneFrameImage),
      phoneFrameImageAlt: mediaAlt(payload.why.phoneFrameImage),
      screenImage: mediaUrl(payload.why.screenImage),
      screenImageAlt: mediaAlt(payload.why.screenImage),
    },
    market: {
      title: text(payload.market.title),
      body1: localizeRichText(payload.market.body1, locale),
      body2: localizeRichText(payload.market.body2, locale),
      outcomes: payload.market.outcomes.filter((item) => item.isVisible).map((item) => text(item.label)),
      visualImage: mediaUrl(payload.market.visualImage),
      visualImageAlt: mediaAlt(payload.market.visualImage),
    },
    footer: {
      whatsappVisible: payload.footer.whatsappVisible,
      whatsappNumber: payload.footer.whatsappNumber,
      whatsappMessage: text(payload.footer.whatsappMessage),
      contactTitle: text(payload.footer.contactTitle),
      quickLinks: text(payload.footer.quickLinks),
      description: localizeRichText(payload.footer.description, locale),
      copyright: text(payload.footer.copyright),
      backToTop: text(payload.footer.backToTop),
      kuwait: text(payload.footer.kuwait),
      logo: mediaUrl(payload.footer.logo, imageFallbacks.footerLogo),
      logoAlt: mediaAlt(payload.footer.logo),
      contactMethods: payload.footer.contactMethods.filter((item) => item.isVisible).map((item) => ({
        id: item.id,
        type: item.type,
        label: text(item.label),
        value: item.value,
        displayValue: text(item.displayValue),
        href: item.href,
      })),
      socialLinks: payload.footer.socialLinks.filter((item) => item.isVisible).map((item) => ({
        id: item.id,
        network: item.network,
        label: text(item.label),
        href: item.href,
      })),
    },
    testimonials: (canonicalProducts || [])
      .filter((product) => product.isVisible && product.detailPage?.enabled)
      .flatMap((product) => {
        const withDetail = ensureProductDetailPage(product);
        if (!withDetail.detailPage.testimonialsVisible) return [];
        return (withDetail.detailPage.testimonials || [])
          .filter((item) => item.isVisible)
          .map((item) => ({
            id: item.id,
            quote: text(item.quote),
            name: text(item.name),
            role: text(item.role),
            avatar: item.avatar ? pickLocalizedMediaUrl(item.avatar, locale) ?? null : null,
            productName: text(product.title),
            productSlug: withDetail.detailPage.slug,
          }));
      }),
  };
}

export function localizeAboutPayload(payload: CmsAboutPayload, locale: CmsLocale): LocalizedAboutContent {
  const text = (value: BilingualText) => value[locale];
  const mediaUrl = (field: LocalizedMediaField, fallback = "") =>
    pickLocalizedMediaUrl(field, locale, fallback) ?? fallback;

  return {
    hero: {
      title: text(payload.hero.title),
      body: localizeRichText(payload.hero.body, locale),
      cta: text(payload.hero.cta),
      ctaHref: payload.hero.ctaHref,
    },
    products: payload.products.filter((item) => item.isVisible).map((item) => {
      const withDetail = ensureProductDetailPage(item);
      const projectSlug = withDetail.detailPage.slug;

      return {
        id: item.id,
        number: item.number,
        title: text(item.title),
        body: localizeRichText(item.body, locale),
        offersLabel: text(item.offersLabel),
        offers: item.offers.filter((offer) => offer.isVisible).map((offer) => text(offer.label)),
        audienceLabel: text(item.audienceLabel),
        audience: item.audience
          .filter((audienceItem) => audienceItem.isVisible)
          .map((audienceItem) => text(audienceItem.label)),
        downloadTitle: text(item.downloadTitle),
        image: mediaUrl(item.image, imageFallbacks.aboutProduct),
        imageAlt: text(item.image.alt),
        imageSide: item.imageSide,
        storeButtons: (item.storeButtons || []).filter((button) => button.isVisible).map((button) => ({
          id: button.id,
          platform: (button.platform ?? "other") as "app-store" | "google-play" | "other",
          preLabel: text(button.preLabel),
          label: text(button.label),
          href: button.href,
        })),
        projectSlug,
        projectHref: projectSlug ? `/projects/${projectSlug}` : null,
      };
    }),
  };
}

async function readMessages(locale: CmsLocale) {
  const messages = (await import(`../../messages/${locale}.json`)).default as {
    shell: { mobileSubtitle: string; loadingLabel: string };
    aboutPage: {
      seo: { metaTitle: string; metaDescription: string; ogTitle: string; ogDescription: string };
      hero: { title: string; body: string; cta: string };
      labels: { offers: string; audience: string; downloadTitle: string; storePreLabel: string };
      products: Record<
        string,
        { title: string; body: string; offers: string[]; audience: string[] }
      >;
    };
  };
  const t = await getTranslations({ locale });

  return {
    metadata: {
      homeTitle: t("metadata.homeTitle"),
      homeDescription: t("metadata.homeDescription"),
      siteTitle: t("metadata.siteTitle"),
      siteDescription: t("metadata.siteDescription"),
    },
    nav: {
      home: t("nav.home"),
      about: t("nav.about"),
      products: t("nav.products"),
      projects: t("nav.projects"),
      services: t("nav.services"),
      blog: t("nav.blog"),
      why: t("nav.why"),
      switchToArabic: t("nav.switchToArabic"),
      switchToEnglish: t("nav.switchToEnglish"),
    },
    hero: {
      titleLine1: t("hero.titleLine1"),
      titleLine2Prefix: t("hero.titleLine2Prefix"),
      titleCycleAi: t("hero.titleCycleAi"),
      titleCycleExpertise: t("hero.titleCycleExpertise"),
      body: t("hero.body"),
      cta: t("hero.cta"),
    },
    about: {
      cards: {
        ai: { title: t("about.cards.ai.title"), body: t("about.cards.ai.body") },
        scale: { title: t("about.cards.scale.title"), body: t("about.cards.scale.body") },
        expertise: { title: t("about.cards.expertise.title"), body: t("about.cards.expertise.body") },
        mindset: { title: t("about.cards.mindset.title"), body: t("about.cards.mindset.body") },
      },
      heading: t("about.heading"),
      body: t("about.body"),
    },
    visionMission: {
      visionTitle: t("visionMission.visionTitle"),
      visionBody: t("visionMission.visionBody"),
      missionTitle: t("visionMission.missionTitle"),
      missionBody: t("visionMission.missionBody"),
    },
    process: {
      title: t("process.title"),
      body: t("process.body"),
      steps: {
        1: { title: t("process.steps.1.title"), body: t("process.steps.1.body") },
        2: { title: t("process.steps.2.title"), body: t("process.steps.2.body") },
        3: { title: t("process.steps.3.title"), body: t("process.steps.3.body") },
        4: { title: t("process.steps.4.title"), body: t("process.steps.4.body") },
        5: { title: t("process.steps.5.title"), body: t("process.steps.5.body") },
        6: { title: t("process.steps.6.title"), body: t("process.steps.6.body") },
      },
    },
    products: {
      title: t("products.title"),
      body: t("products.body"),
      cta: t("products.cta"),
      items: {
        bohamdan: { title: t("products.items.bohamdan.title"), body: t("products.items.bohamdan.body") },
        diddeed: { title: t("products.items.diddeed.title"), body: t("products.items.diddeed.body") },
        road80: { title: t("products.items.road80.title"), body: t("products.items.road80.body") },
        nafas: { title: t("products.items.nafas.title"), body: t("products.items.nafas.body") },
      },
    },
    services: {
      title: t("services.title"),
      body: t("services.body"),
      carouselLabel: t("services.carouselLabel"),
      activeService: t("services.activeService", { service: "{service}" }),
      goToService: t("services.goToService", { service: "{service}", index: "{index}" }),
      items: {
        mobile: { title: t("services.items.mobile.title"), body: t("services.items.mobile.body") },
        marketing: { title: t("services.items.marketing.title"), body: t("services.items.marketing.body") },
        ai: { title: t("services.items.ai.title"), body: t("services.items.ai.body") },
        products: { title: t("services.items.products.title"), body: t("services.items.products.body") },
      },
    },
    sectors: {
      title: t("sectors.title"),
      body: t("sectors.body"),
      carouselLabel: t("sectors.carouselLabel"),
      items: {
        companies: t("sectors.items.companies"),
        cars: t("sectors.items.cars"),
        realestate: t("sectors.items.realestate"),
        transport: t("sectors.items.transport"),
        health: t("sectors.items.health"),
        startups: t("sectors.items.startups"),
        commerce: t("sectors.items.commerce"),
        any: t("sectors.items.any"),
      },
    },
    why: {
      title: t("why.title"),
      reasons: {
        1: t("why.reasons.1"),
        2: t("why.reasons.2"),
        3: t("why.reasons.3"),
        4: t("why.reasons.4"),
        5: t("why.reasons.5"),
        6: t("why.reasons.6"),
      },
    },
    market: {
      title: t("market.title"),
      body1: t("market.body1"),
      body2: t("market.body2"),
      outcomes: {
        1: t("market.outcomes.1"),
        2: t("market.outcomes.2"),
        3: t("market.outcomes.3"),
        4: t("market.outcomes.4"),
        5: t("market.outcomes.5"),
      },
    },
    footer: {
      contactTitle: t("footer.contactTitle"),
      quickLinks: t("footer.quickLinks"),
      products: t("footer.products"),
      contact: t("footer.contact"),
      description: t("footer.description"),
      copyright: t("footer.copyright"),
      backToTop: t("footer.backToTop"),
      kuwait: t("footer.kuwait"),
      youtube: t("footer.youtube"),
      linkedin: t("footer.linkedin"),
      instagram: t("footer.instagram"),
      facebook: t("footer.facebook"),
    },
    shell: messages.shell,
    aboutPage: messages.aboutPage,
  };
}
