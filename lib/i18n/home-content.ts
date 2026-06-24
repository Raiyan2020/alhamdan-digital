import { getTranslations } from "next-intl/server";
import { sectionIds } from "@/components/home/data";
import type { AboutCardIconKey, SectorIconKey } from "@/components/home/sector-icons";

export async function getHomeContent() {
  const t = await getTranslations();

  return {
    nav: [
      { key: "home", label: t("nav.home"), href: `/#${sectionIds.hero}` },
      { key: "about", label: t("nav.about"), href: `/#${sectionIds.about}` },
      { key: "products", label: t("nav.products"), href: `/#${sectionIds.products}` },
      { key: "services", label: t("nav.services"), href: `/#${sectionIds.services}` },
      { key: "why", label: t("nav.why"), href: `/#${sectionIds.why}` },
    ],
    footerLinks: [
      { label: t("nav.home"), href: `/#${sectionIds.hero}` },
      { label: t("nav.about"), href: `/#${sectionIds.about}` },
      { label: t("footer.products"), href: `/#${sectionIds.products}` },
      { label: t("nav.services"), href: `/#${sectionIds.services}` },
      { label: t("footer.contact"), href: `/#${sectionIds.contact}` },
    ],
    hero: {
      titleLine1: t("hero.titleLine1"),
      line2Prefix: t("hero.titleLine2Prefix"),
      cyclePhrases: [t("hero.titleCycleAi"), t("hero.titleCycleExpertise")],
      body: t("hero.body"),
      cta: t("hero.cta"),
    },
    aboutCards: [
      { key: "ai" as const, title: t("about.cards.ai.title"), body: t("about.cards.ai.body"), icon: "brain" as AboutCardIconKey },
      { key: "scale" as const, title: t("about.cards.scale.title"), body: t("about.cards.scale.body"), icon: "rocket" as AboutCardIconKey },
      { key: "expertise" as const, title: t("about.cards.expertise.title"), body: t("about.cards.expertise.body"), icon: "users" as AboutCardIconKey },
      { key: "mindset" as const, title: t("about.cards.mindset.title"), body: t("about.cards.mindset.body"), icon: "lightbulb" as AboutCardIconKey },
    ],
    about: {
      heading: t("about.heading"),
      body: t("about.body"),
    },
    visionMission: [
      { title: t("visionMission.visionTitle"), body: t("visionMission.visionBody") },
      { title: t("visionMission.missionTitle"), body: t("visionMission.missionBody") },
    ],
    process: {
      title: t("process.title"),
      body: t("process.body"),
      steps: [
        { number: "01", title: t("process.steps.1.title"), body: t("process.steps.1.body") },
        { number: "02", title: t("process.steps.2.title"), body: t("process.steps.2.body") },
        { number: "03", title: t("process.steps.3.title"), body: t("process.steps.3.body") },
        { number: "04", title: t("process.steps.4.title"), body: t("process.steps.4.body") },
        { number: "05", title: t("process.steps.5.title"), body: t("process.steps.5.body") },
        { number: "06", title: t("process.steps.6.title"), body: t("process.steps.6.body") },
      ],
    },
    products: {
      title: t("products.title"),
      body: t("products.body"),
      cta: t("products.cta"),
      items: [
        {
          key: "diddeed" as const,
          title: t("products.items.diddeed.title"),
          body: t("products.items.diddeed.body"),
          image: "/figma/market-visual.webp",
          layout: "text-start" as const,
        },
        {
          key: "bohamdan" as const,
          title: t("products.items.bohamdan.title"),
          body: t("products.items.bohamdan.body"),
          image: "/figma/services-phone.webp",
          layout: "text-start" as const,
        },
        {
          key: "nafas" as const,
          title: t("products.items.nafas.title"),
          body: t("products.items.nafas.body"),
          image: "/figma/why-phone.webp",
          layout: "text-end" as const,
        },
        {
          key: "road80" as const,
          title: t("products.items.road80.title"),
          body: t("products.items.road80.body"),
          image: "/figma/services-phone.webp",
          layout: "text-end" as const,
        },
      ],
    },
    services: {
      title: t("services.title"),
      body: t("services.body"),
      carouselLabel: t("services.carouselLabel"),
      items: [
        {
          title: t("services.items.mobile.title"),
          body: t("services.items.mobile.body"),
          phoneImage: "/figma/services-phone.webp",
          visualImage: "/figma/services-visual.webp",
        },
        {
          title: t("services.items.marketing.title"),
          body: t("services.items.marketing.body"),
          phoneImage: "/figma/hero-visual.webp",
          visualImage: "/figma/services-visual.webp",
        },
        {
          title: t("services.items.ai.title"),
          body: t("services.items.ai.body"),
          phoneImage: "/figma/market-visual.webp",
          visualImage: "/figma/services-visual.webp",
        },
        {
          title: t("services.items.products.title"),
          body: t("services.items.products.body"),
          phoneImage: "/figma/why-phone.webp",
          visualImage: "/figma/services-visual.webp",
        },
      ],
    },
    sectors: {
      title: t("sectors.title"),
      body: t("sectors.body"),
      carouselLabel: t("sectors.carouselLabel"),
      items: [
        { title: t("sectors.items.companies"), icon: "building2" as SectorIconKey },
        { title: t("sectors.items.cars"), icon: "car" as SectorIconKey },
        { title: t("sectors.items.realestate"), icon: "building2" as SectorIconKey },
        { title: t("sectors.items.transport"), icon: "truck" as SectorIconKey },
        { title: t("sectors.items.health"), icon: "dumbbell" as SectorIconKey },
        { title: t("sectors.items.startups"), icon: "rocket" as SectorIconKey },
        { title: t("sectors.items.commerce"), icon: "store" as SectorIconKey },
        { title: t("sectors.items.any"), icon: "globe2" as SectorIconKey },
      ],
    },
    why: {
      title: t("why.title"),
      reasons: [
        t("why.reasons.1"),
        t("why.reasons.2"),
        t("why.reasons.3"),
        t("why.reasons.4"),
        t("why.reasons.5"),
        t("why.reasons.6"),
      ],
    },
    market: {
      title: t("market.title"),
      body1: t("market.body1"),
      body2: t("market.body2"),
      outcomes: [
        t("market.outcomes.1"),
        t("market.outcomes.2"),
        t("market.outcomes.3"),
        t("market.outcomes.4"),
        t("market.outcomes.5"),
      ],
    },
    footer: {
      contactTitle: t("footer.contactTitle"),
      quickLinks: t("footer.quickLinks"),
      description: t("footer.description"),
      copyright: t("footer.copyright"),
      backToTop: t("footer.backToTop"),
      kuwait: t("footer.kuwait"),
      youtube: t("footer.youtube"),
      linkedin: t("footer.linkedin"),
      instagram: t("footer.instagram"),
      facebook: t("footer.facebook"),
    },
  };
}

export type HomeContent = Awaited<ReturnType<typeof getHomeContent>>;
