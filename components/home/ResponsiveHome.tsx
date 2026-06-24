import { Eye, Send } from "lucide-react";
import type { HomeContent } from "@/lib/i18n/home-content";
import { Reveal, MotionCard, MotionLinkButton } from "@/components/motion";
import { AboutFeatureCard } from "./AboutFeatureCard";
import { sectionIds } from "./data";
import { HeroAnimatedHeading } from "./HeroAnimatedHeading";
import { HeroCinematicVisual } from "./HeroCinematicVisual";
import {
  HERO_BODY_DELAY_MS,
  HERO_CTA_DELAY_MS,
  HERO_ENTRANCE_DELAY_MS,
} from "./heroTiming";
import {
  MarketCinematicVisual,
} from "./MarketCinematicVisual";
import { MarketOutcomePills } from "./MarketOutcomePills";
import { MobileHeading } from "./MobileHeading";
import { ProductsSectionMobile } from "./ProductsSection";
import { ProcessSectionMobile } from "./ProcessSection";
import { SectorsBlueBand } from "./SectorsBlueBand";
import { SectorsCarousel } from "./SectorsCarousel";
import { ServicesSection } from "./ServicesSection";
import { WhySection } from "./WhySection";

type ResponsiveHomeProps = {
  content: HomeContent;
};

const aboutCardMotion = [
  { direction: "right", delayMs: 0 },
  { direction: "down", delayMs: 120 },
  { direction: "up", delayMs: 240 },
  { direction: "left", delayMs: 360 },
] as const;

const visionMissionIcons = [Eye, Send] as const;

export function ResponsiveHome({ content }: ResponsiveHomeProps) {
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
    <div dir="ltr" className="overflow-x-clip bg-[#fcfcfc] text-[#0d0d0d] min-[1440px]:hidden">
      <section
        id={sectionIds.hero}
        className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-2 md:items-center md:py-16"
      >
        <HeroCinematicVisual
          className="order-2 mx-auto w-full max-w-[604px] md:order-1"
          entranceDelayMs={HERO_ENTRANCE_DELAY_MS}
          priority
        />
        <div data-ar className="order-1 md:order-2">
          <HeroAnimatedHeading
            line1={hero.titleLine1}
            line2Prefix={hero.line2Prefix}
            cyclePhrases={hero.cyclePhrases}
            className="text-4xl leading-tight sm:text-5xl"
            startDelayMs={HERO_ENTRANCE_DELAY_MS}
          />
          <Reveal variant="hero-text" immediate delay={HERO_BODY_DELAY_MS}>
            <p className="mt-6 text-lg font-medium leading-8 text-[#777] sm:text-xl">
              {hero.body}
            </p>
          </Reveal>
          <Reveal variant="hero-text" immediate delay={HERO_CTA_DELAY_MS}>
            <MotionLinkButton
              href={`/#${sectionIds.products}`}
              className="mt-8 inline-flex h-14 items-center rounded-2xl bg-[#012561] px-8 text-lg text-white"
            >
              {hero.cta}
            </MotionLinkButton>
          </Reveal>
        </div>
      </section>

      <section
        id={sectionIds.about}
        className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-2"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {aboutCards.map(({ key, title, body, icon }, index) => (
            <AboutFeatureCard
              key={key}
              cardKey={key}
              title={title}
              body={body}
              icon={icon}
              direction={aboutCardMotion[index]?.direction}
              delayMs={aboutCardMotion[index]?.delayMs}
              titleClassName="text-lg"
              bodyClassName="mt-3 text-sm leading-6 text-[#525252]"
              iconWrapClassName="mx-auto"
            />
          ))}
        </div>
        <Reveal variant="section-heading">
          <div data-ar>
            <h2 className="text-3xl font-bold sm:text-4xl">{about.heading}</h2>
            <p className="mt-5 text-lg leading-9 text-[#4e4e4e]">{about.body}</p>
          </div>
        </Reveal>
      </section>

      <section
        data-ar
        className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-8 sm:grid-cols-2"
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
              <MotionCard className="group h-full w-full rounded-[28px] bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]">
                <div className="mb-4 flex items-center justify-start gap-4">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <span className="inline-flex rounded-2xl bg-[#012561] p-3 text-white transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="h-10 w-10" />
                  </span>
                </div>
                <p className="mt-3 leading-8 text-[#5b6577]">{body}</p>
              </MotionCard>
            </Reveal>
          );
        })}
      </section>

      <ProcessSectionMobile process={process} />

      <ProductsSectionMobile products={products} />

      <section className="py-12">
        <MobileHeading title={services.title} body={services.body} />
        <ServicesSection
          id={sectionIds.services}
          services={services}
          className="mx-auto mt-8 w-full max-w-7xl px-5 lg:px-20"
        />
      </section>

      <section className="relative isolate w-full overflow-x-clip pb-10 pt-20">
        <MobileHeading
          className="relative z-10 max-w-none w-full px-5 lg:px-20"
          title={sectors.title}
          body={sectors.body}
        />
        <Reveal
          variant="band-wipe"
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[11.5rem] z-0 h-[280px] w-screen -translate-x-1/2 origin-center sm:top-[12.5rem]"
        >
          <SectorsBlueBand className="h-full" />
        </Reveal>
        <SectorsCarousel
          sectors={sectors.items}
          label={sectors.carouselLabel}
          className="relative z-10 mt-14"
        />
      </section>

      <WhySection
        id={sectionIds.why}
        title={why.title}
        reasons={why.reasons}
        className="grid w-full grid-cols-1 gap-8 bg-[#012561] px-5 py-12 text-white md:grid-cols-2 md:items-center lg:px-20"
      />

      <section
        id={sectionIds.market}
        data-ar
        className="relative overflow-x-clip py-12"
      >
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-20">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-12 xl:gap-16">
            <Reveal
              variant="fade-up"
              delay={90}
              className="relative order-2 h-[300px] w-full max-w-[603px] shrink-0 sm:h-[360px] lg:order-none lg:h-[400px]"
            >
              <MarketCinematicVisual bleedEnd className="h-full" />
            </Reveal>
            <Reveal
              variant="fade-down"
              className="relative z-10 order-1 w-full max-w-[628px] lg:order-none"
            >
              <div>
                <h2 className="text-4xl font-medium leading-tight">{market.title}</h2>
                <p className="mt-6 text-lg leading-9 text-[#4e4e4e]">
                  {market.body1}
                  <br />
                  <br />
                  {market.body2}
                </p>
                <MarketOutcomePills outcomes={market.outcomes} compact className="mt-6" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
