"use client";

import { Eye, Send } from "lucide-react";
import type { HomeContent } from "@/lib/i18n/home-content";
import { useLocale } from "next-intl";
import type { LocalizedBlogPostSummary } from "@/lib/cms/blog-types";
import {
  Reveal,
  MotionCard,
  MotionLinkButton,
} from "@/components/motion";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { cn } from "@/lib/utils";
import { sectionIds } from "./data";
import { AboutFeatureCard } from "./AboutFeatureCard";
import { BlogsSection } from "./BlogsSection";
import { HeroAnimatedHeading } from "./HeroAnimatedHeading";
import { HeroCinematicVisual } from "./HeroCinematicVisual";
import { Heading } from "./Heading";
import {
  HERO_BODY_DELAY_MS,
  HERO_CTA_DELAY_MS,
  HERO_ENTRANCE_DELAY_MS,
} from "./heroTiming";
import {
  MarketCinematicVisual,
  marketViewportBleedEnd,
} from "./MarketCinematicVisual";
import { MarketOutcomePills } from "./MarketOutcomePills";
import { ProductsSectionDesktop } from "./ProductsSection";
import { ProcessSectionDesktop } from "./ProcessSection";
import { SectorsBlueBand } from "./SectorsBlueBand";
import { SectorsCarousel } from "./SectorsCarousel";
import { ServicesSection } from "./ServicesSection";
import { WhySection } from "./WhySection";

type DesktopHomeProps = {
  content: HomeContent;
  latestBlogs: LocalizedBlogPostSummary[];
};

const aboutCardMotion = [
  { direction: "right", delayMs: 0 },
  { direction: "down", delayMs: 120 },
  { direction: "up", delayMs: 240 },
  { direction: "left", delayMs: 360 },
] as const;

const visionMissionIcons = [Eye, Send] as const;

export function DesktopHome({ content, latestBlogs }: DesktopHomeProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const {
    about,
    aboutCards,
    hero,
    market,
    process,
    products,
    sectors,
    services,
    visionMission,
    why,
  } = content;

  return (
    <div
      data-figma-canvas
      dir={isRtl ? "rtl" : "ltr"}
      className="relative mx-auto hidden w-[1440px] bg-page text-ink min-[1440px]:block pb-32"
    >
      <section
        id={sectionIds.hero}
        className="relative mx-auto flex w-[1280px] justify-between pt-52 pb-24"
      >
        <div className="w-[628px] text-start pt-[11px]">
          <HeroAnimatedHeading
            line1={hero.titleLine1}
            line2Prefix={hero.line2Prefix}
            cyclePhrases={hero.cyclePhrases}
            className="text-[56px] leading-[72px]"
            startDelayMs={HERO_ENTRANCE_DELAY_MS}
          />
          <Reveal variant="hero-text" immediate delay={HERO_BODY_DELAY_MS}>
            <RichTextHtml
              html={hero.body}
              className="mt-6 w-[602px] text-[22px] font-medium leading-[36px] tracking-[-0.03em] text-ink-muted"
            />
          </Reveal>
          <Reveal variant="hero-text" immediate delay={HERO_CTA_DELAY_MS}>
            <MotionLinkButton
              href={hero.ctaHref}
              className="mt-8 inline-flex h-[76px] items-center rounded-2xl bg-brand px-10 text-[24px] leading-9 text-white"
            >
              {hero.cta}
            </MotionLinkButton>
          </Reveal>
        </div>
        <div className="w-[604px]">
          <HeroCinematicVisual
            className="w-[604px]"
            entranceDelayMs={HERO_ENTRANCE_DELAY_MS}
            personImage={hero.personImage}
            personImageAlt={hero.personImageAlt}
            brushImage={hero.brushImage}
            priority
          />
        </div>
      </section>

      <section
        id={sectionIds.about}
        className="relative mx-auto flex w-[1280px] justify-between gap-[72px] pt-12 pb-16"
      >
        <Reveal
          variant="section-heading"
          className="w-[604px]"
        >
          <div>
            <h2 className="text-[40px] font-bold leading-[74px]">
              {about.heading}
            </h2>
            <RichTextHtml
              html={about.body}
              className="mt-[22px] text-[28px] leading-[42px] text-ink-secondary"
            />
          </div>
        </Reveal>
        <div className="grid w-[604px] grid-cols-2 gap-5 h-fit">
          {aboutCards.map(({ key, title, body, icon }, index) => (
            <AboutFeatureCard
              key={key}
              cardKey={key}
              title={title}
              body={body}
              icon={icon}
              direction={aboutCardMotion[index]?.direction}
              delayMs={aboutCardMotion[index]?.delayMs}
              titleClassName="text-[18px] leading-[23px]"
              bodyClassName="mt-3 text-[14px] leading-5 text-ink-tertiary"
            />
          ))}
        </div>
      </section>

      <section
        className="relative mx-auto grid w-[1280px] grid-cols-2 gap-6 py-12"
      >
        {visionMission.map(({ title, body }, index) => {
          const Icon = visionMissionIcons[index] ?? Eye;

          return (
            <Reveal
              key={title}
              variant="fade-up"
              delay={index * 80}
              className="h-full"
            >
              <MotionCard className="group h-full w-full rounded-[32px] bg-card-surface p-8 shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
                <div className="mb-6 flex items-center justify-start gap-4">
                  <span className="inline-flex shrink-0 rounded-2xl bg-brand p-3 text-white transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="h-11 w-11" />
                  </span>
                  <h3 className="text-xl font-semibold text-ink-heading">{title}</h3>
                </div>
                <RichTextHtml
                  html={body}
                  className="mt-3 text-[18px] leading-[23px] text-ink-soft"
                />
              </MotionCard>
            </Reveal>
          );
        })}
      </section>

      <ProcessSectionDesktop process={process} />

      <ProductsSectionDesktop products={products} />

      <section id={sectionIds.services} className="relative mx-auto w-[1280px] py-16 h-[980px]">
        <Heading title={services.title} body={services.body} />
        <div className="absolute left-0 top-[180px] h-[800px] w-[1280px]">
          <ServicesSection
            services={services}
            className="h-full w-full"
          />
        </div>
      </section>

      <section className="relative w-full h-[530px] overflow-x-clip py-16">
        <div className="mx-auto w-[1280px]">
          <Heading title={sectors.title} body={sectors.body} />
        </div>
        <Reveal
          variant="band-wipe"
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 h-[322px] w-screen -translate-x-1/2 origin-center top-[125px]"
        >
          <SectorsBlueBand className="h-full" />
        </Reveal>
        <div
          className="absolute left-1/2 z-10 h-[164px] w-screen -translate-x-1/2 px-0 top-[208px]"
        >
          <SectorsCarousel
            sectors={sectors.items}
            label={sectors.carouselLabel}
            className="w-full h-full"
          />
        </div>
      </section>

      <section className="relative w-full bg-brand pt-[88px] pb-0 px-20">
        <div className="mx-auto w-[1280px]">
          <WhySection
            id={sectionIds.why}
            title={why.title}
            reasons={why.reasons}
            phoneFrameImage={why.phoneFrameImage}
            phoneFrameImageAlt={why.phoneFrameImageAlt}
            screenImage={why.screenImage}
            screenImageAlt={why.screenImageAlt}
            desktop
            className="w-full h-full"
          />
        </div>
      </section>

      <section
        id={sectionIds.market}
        className="relative w-full h-[726px] overflow-visible"
      >
        <Reveal
          variant="fade-down"
          className={cn(
            "absolute top-1/2 z-10 w-[628px] -translate-y-1/2",
            isRtl ? "left-20" : "right-20"
          )}
        >
          <div className="text-start">
            <h2 className="text-[56px] font-medium leading-[72px]">
              {market.title}
            </h2>
            <RichTextHtml
              html={`${market.body1}${market.body2}`}
              className="mt-10 text-start text-[28px] font-medium leading-[42px] text-ink-secondary"
            />
            <MarketOutcomePills outcomes={market.outcomes} className="justify-items-start" />
          </div>
        </Reveal>

        <Reveal
          variant="fade-up"
          delay={90}
          className={cn(
            "absolute top-1/2 h-[590px] -translate-y-1/2",
            isRtl
              ? "right-[calc((1440px-100vw)/2)]"
              : "left-[calc((1440px-100vw)/2)]"
          )}
        >
          <MarketCinematicVisual
            image={market.visualImage}
            imageAlt={market.visualImageAlt}
            bleedStart
            className="h-full"
          />
        </Reveal>
      </section>

      <section className="relative mx-auto w-[1280px] py-16">
        <BlogsSection
          id={sectionIds.blogs}
          posts={latestBlogs}
          className="w-full"
        />
      </section>
    </div>
  );
}
