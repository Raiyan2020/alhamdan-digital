"use client";

import type { LocalizedAboutContent } from "@/lib/cms/types";
import { AboutHero } from "./AboutProductContent";
import { AboutProductSection } from "./AboutProductSection";
import { useLocale } from "next-intl";

type AboutPageProps = {
  content: LocalizedAboutContent;
};

function DesktopAboutPage({ content }: AboutPageProps) {
  return (
    <div
      className="relative mx-auto hidden w-[1440px] bg-page pb-32 text-ink min-[1440px]:block"
    >
      <AboutHero
        desktop
        title={content.hero.title}
        body={content.hero.body}
        cta={content.hero.cta}
        ctaHref={content.hero.ctaHref}
      />
      <div id="about-products" className="relative">
        {content.products.map((product, index) => (
          <AboutProductSection key={product.id} product={product} index={index} layout="desktop" />
        ))}
      </div>
    </div>
  );
}

function ResponsiveAboutPage({ content }: AboutPageProps) {
  return (
    <div className="bg-page text-ink min-[1440px]:hidden">
      <AboutHero
        title={content.hero.title}
        body={content.hero.body}
        cta={content.hero.cta}
        ctaHref={content.hero.ctaHref}
      />
      <div id="about-products" className="grid gap-16 px-5 pb-24">
        {content.products.map((product, index) => (
          <AboutProductSection key={product.id} product={product} index={index} layout="responsive" />
        ))}
      </div>
    </div>
  );
}

export function AboutPage({ content }: AboutPageProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="overflow-x-clip bg-page font-sans"
    >
      <ResponsiveAboutPage content={content} />
      <DesktopAboutPage content={content} />
    </main>
  );
}
