"use client";

import type { LocalizedAboutContent } from "@/lib/cms/types";
import { ABOUT_DESKTOP_LAYOUT, getAboutCanvasMinHeight } from "./aboutLayout";
import { AboutHero } from "./AboutProductContent";
import { AboutProductSection } from "./AboutProductSection";

type AboutPageProps = {
  content: LocalizedAboutContent;
};

function DesktopAboutPage({ content }: AboutPageProps) {
  const canvasMinHeight = getAboutCanvasMinHeight(content.products.length);

  return (
    <div
      dir="ltr"
      data-figma-canvas
      className="relative mx-auto hidden w-[1440px] bg-page pb-32 text-ink min-[1440px]:block"
      style={{ minHeight: canvasMinHeight }}
    >
      <AboutHero
        desktop
        title={content.hero.title}
        body={content.hero.body}
        cta={content.hero.cta}
        ctaHref={content.hero.ctaHref}
      />
      <div
        id="about-products"
        className="absolute"
        style={{ top: ABOUT_DESKTOP_LAYOUT.productsAnchorTop }}
        aria-hidden
      />
      {content.products.map((product, index) => (
        <AboutProductSection key={product.id} product={product} index={index} layout="desktop" />
      ))}
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
  return (
    <main dir="rtl" className="overflow-x-clip bg-page font-sans">
      <ResponsiveAboutPage content={content} />
      <DesktopAboutPage content={content} />
    </main>
  );
}
