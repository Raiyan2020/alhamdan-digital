import type { AboutCardIconKey, SectorIconKey } from "@/components/home/sector-icons";
import type { CmsProjectDetailPage } from "./project-detail";

export type CmsLocale = "ar" | "en";

export type BilingualText = {
  ar: string;
  en: string;
};

export type LocalizedMediaField = {
  defaultAssetId: string | null;
  defaultUrl: string;
  arAssetId?: string | null;
  arUrl?: string | null;
  enAssetId?: string | null;
  enUrl?: string | null;
  alt: BilingualText;
  isDecorative: boolean;
};

export type CmsSeo = {
  metaTitle: BilingualText;
  metaDescription: BilingualText;
  ogTitle: BilingualText;
  ogDescription: BilingualText;
  ogImage: LocalizedMediaField | null;
};

export type CmsRichText = {
  json: BilingualText;
  html: BilingualText;
};

export type CmsLink = {
  label: BilingualText;
  href: string;
  isVisible: boolean;
};

export type CmsHomePayload = {
  seo: CmsSeo;
  header: {
    logo: LocalizedMediaField;
    brandName: BilingualText;
    mobileSubtitle: BilingualText;
    switchToArabicLabel: BilingualText;
    switchToEnglishLabel: BilingualText;
  };
  loading: {
    label: BilingualText;
    animation: LocalizedMediaField;
  };
  nav: CmsLink[];
  footerLinks: CmsLink[];
  hero: {
    titleLine1: BilingualText;
    line2Prefix: BilingualText;
    cyclePhrases: Array<{ id: string; phrase: BilingualText; isVisible: boolean }>;
    body: CmsRichText;
    cta: BilingualText;
    ctaHref: string;
    brushImage: LocalizedMediaField;
    personImage: LocalizedMediaField;
  };
  aboutCards: Array<{
    id: string;
    key: "ai" | "scale" | "expertise" | "mindset";
    title: BilingualText;
    body: CmsRichText;
    icon: AboutCardIconKey;
    isVisible: boolean;
  }>;
  about: {
    heading: BilingualText;
    body: CmsRichText;
  };
  visionMission: Array<{
    id: string;
    title: BilingualText;
    body: CmsRichText;
    icon: "eye" | "send";
    isVisible: boolean;
  }>;
  process: {
    title: BilingualText;
    body: CmsRichText;
    steps: Array<{
      id: string;
      number: string;
      title: BilingualText;
      body: CmsRichText;
      isVisible: boolean;
    }>;
  };
  products: {
    title: BilingualText;
    body: CmsRichText;
    cta: BilingualText;
    ctaHref: string;
    items: Array<{
      id: string;
      key: "diddeed" | "bohamdan" | "nafas" | "road80";
      title: BilingualText;
      body: CmsRichText;
      image: LocalizedMediaField;
      layout: "text-start" | "text-end";
      isVisible: boolean;
    }>;
  };
  services: {
    title: BilingualText;
    body: CmsRichText;
    carouselLabel: BilingualText;
    activeService: BilingualText;
    goToService: BilingualText;
    items: Array<{
      id: string;
      title: BilingualText;
      body: CmsRichText;
      phoneImage: LocalizedMediaField;
      visualImage: LocalizedMediaField;
      isVisible: boolean;
    }>;
  };
  sectors: {
    title: BilingualText;
    body: CmsRichText;
    carouselLabel: BilingualText;
    items: Array<{
      id: string;
      title: BilingualText;
      icon: SectorIconKey;
      isVisible: boolean;
    }>;
  };
  why: {
    title: BilingualText;
    reasons: Array<{
      id: string;
      text: BilingualText;
      icon?: string;
      isVisible: boolean;
    }>;
    phoneFrameImage: LocalizedMediaField;
    screenImage: LocalizedMediaField;
  };
  market: {
    title: BilingualText;
    body1: CmsRichText;
    body2: CmsRichText;
    outcomes: Array<{
      id: string;
      label: BilingualText;
      isVisible: boolean;
    }>;
    visualImage: LocalizedMediaField;
  };
  footer: CmsFooterPayload;
};

export type CmsFooterPayload = {
  contactTitle: BilingualText;
  quickLinks: BilingualText;
  description: CmsRichText;
  copyright: BilingualText;
  backToTop: BilingualText;
  kuwait: BilingualText;
  logo: LocalizedMediaField;
  contactMethods: Array<{
    id: string;
    type: "phone" | "email" | "address";
    label: BilingualText;
    value: string;
    displayValue: BilingualText;
    href: string;
    isVisible: boolean;
  }>;
  socialLinks: Array<{
    id: string;
    network: "youtube" | "linkedin" | "instagram" | "facebook";
    label: BilingualText;
    href: string;
    isVisible: boolean;
  }>;
};

export type CmsAboutPayload = {
  seo: CmsSeo;
  hero: {
    title: BilingualText;
    body: CmsRichText;
    cta: BilingualText;
    ctaHref: string;
  };
  products: Array<{
    id: string;
    number: string;
    title: BilingualText;
    body: CmsRichText;
    offersLabel: BilingualText;
    offers: Array<{ id: string; label: BilingualText; isVisible: boolean }>;
    audienceLabel: BilingualText;
    audience: Array<{ id: string; label: BilingualText; isVisible: boolean }>;
    downloadTitle: BilingualText;
    image: LocalizedMediaField;
    imageSide: "left" | "right";
    storeButtons: Array<{
      id: string;
      preLabel: BilingualText;
      label: BilingualText;
      href: string;
      isVisible: boolean;
    }>;
    isVisible: boolean;
    detailPage?: CmsProjectDetailPage;
  }>;
};

export type LocalizedHomeContent = {
  header: {
    logo: string;
    logoAlt: string;
    brandName: string;
    mobileSubtitle: string;
    switchToArabicLabel: string;
    switchToEnglishLabel: string;
  };
  loading: {
    label: string;
    animation: string;
  };
  nav: Array<{ key: string; label: string; href: string }>;
  footerLinks: Array<{ label: string; href: string }>;
  hero: {
    titleLine1: string;
    line2Prefix: string;
    cyclePhrases: string[];
    body: string;
    cta: string;
    ctaHref: string;
    brushImage: string;
    personImage: string;
    personImageAlt: string;
  };
  aboutCards: Array<{
    key: "ai" | "scale" | "expertise" | "mindset";
    title: string;
    body: string;
    icon: AboutCardIconKey;
  }>;
  about: { heading: string; body: string };
  visionMission: Array<{ title: string; body: string; icon: "eye" | "send" }>;
  process: {
    title: string;
    body: string;
    steps: Array<{ number: string; title: string; body: string }>;
  };
  products: {
    title: string;
    body: string;
    cta: string;
    ctaHref: string;
    items: Array<{
      key: "diddeed" | "bohamdan" | "nafas" | "road80";
      title: string;
      body: string;
      image: string;
      imageAlt: string;
      layout: "text-start" | "text-end";
    }>;
  };
  services: {
    title: string;
    body: string;
    carouselLabel: string;
    activeService: string;
    goToService: string;
    items: Array<{
      title: string;
      body: string;
      phoneImage: string;
      phoneImageAlt: string;
      visualImage: string;
      visualImageAlt: string;
    }>;
  };
  sectors: {
    title: string;
    body: string;
    carouselLabel: string;
    items: Array<{ id: string; title: string; icon: SectorIconKey }>;
  };
  why: {
    title: string;
    reasons: string[];
    phoneFrameImage: string;
    phoneFrameImageAlt: string;
    screenImage: string;
    screenImageAlt: string;
  };
  market: {
    title: string;
    body1: string;
    body2: string;
    outcomes: string[];
    visualImage: string;
    visualImageAlt: string;
  };
  footer: LocalizedFooterContent;
};

export type LocalizedAboutContent = {
  hero: {
    title: string;
    body: string;
    cta: string;
    ctaHref: string;
  };
  products: Array<{
    id: string;
    number: string;
    title: string;
    body: string;
    offersLabel: string;
    offers: string[];
    audienceLabel: string;
    audience: string[];
    downloadTitle: string;
    image: string;
    imageAlt: string;
    imageSide: "left" | "right";
    storeButtons: Array<{
      id: string;
      preLabel: string;
      label: string;
      href: string;
    }>;
    projectSlug: string | null;
    projectHref: string | null;
  }>;
};

export type LocalizedFooterContent = {
  contactTitle: string;
  quickLinks: string;
  description: string;
  copyright: string;
  backToTop: string;
  kuwait: string;
  logo: string;
  logoAlt: string;
  contactMethods: Array<{
    id: string;
    type: "phone" | "email" | "address";
    label: string;
    value: string;
    displayValue: string;
    href: string;
  }>;
  socialLinks: Array<{
    id: string;
    network: "youtube" | "linkedin" | "instagram" | "facebook";
    label: string;
    href: string;
  }>;
};
