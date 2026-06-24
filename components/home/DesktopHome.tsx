import { Eye, Send } from "lucide-react";
import type { HomeContent } from "@/lib/i18n/home-content";
import {
  Reveal,
  MotionCard,
  MotionLinkButton,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { sectionIds } from "./data";
import { AboutFeatureCard } from "./AboutFeatureCard";
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
};

const aboutCardMotion = [
  { direction: "right", delayMs: 0 },
  { direction: "down", delayMs: 120 },
  { direction: "up", delayMs: 240 },
  { direction: "left", delayMs: 360 },
] as const;

const visionMissionIcons = [Eye, Send] as const;

export function DesktopHome({ content }: DesktopHomeProps) {
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
      dir="ltr"
      data-figma-canvas
      className="relative mx-auto hidden h-[6347px] w-[1440px] bg-[#fcfcfc] text-[#0d0d0d] min-[1440px]:block"
    >
      <section id={sectionIds.hero}>
        <div className="absolute left-20 top-52 h-[500px] w-[604px]">
          <HeroCinematicVisual
            className="h-[500px] w-[604px]"
            entranceDelayMs={HERO_ENTRANCE_DELAY_MS}
            priority
          />
        </div>
        <div data-ar className="absolute left-[732px] top-[219px] w-[628px]">
          <HeroAnimatedHeading
            line1={hero.titleLine1}
            line2Prefix={hero.line2Prefix}
            cyclePhrases={hero.cyclePhrases}
            className="text-[56px] leading-[72px]"
            startDelayMs={HERO_ENTRANCE_DELAY_MS}
          />
          <Reveal variant="hero-text" immediate delay={HERO_BODY_DELAY_MS}>
            <p className="mt-10 w-[602px] text-[28px] font-medium leading-[42px] tracking-[-0.03em] text-[#777]">
              {hero.body}
            </p>
          </Reveal>
          <Reveal variant="hero-text" immediate delay={HERO_CTA_DELAY_MS}>
            <MotionLinkButton
              href={`/#${sectionIds.products}`}
              className="mt-10 inline-flex h-[76px] items-center rounded-2xl bg-[#012561] px-10 text-[24px] leading-9 text-white"
            >
              {hero.cta}
            </MotionLinkButton>
          </Reveal>
        </div>
      </section>

      <section
        id={sectionIds.about}
        className="absolute left-20 top-[805px] h-[432px] w-[1280px]"
      >
        <div className="absolute left-0 top-0 grid h-[432px] w-[604px] grid-cols-2 gap-5">
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
              bodyClassName="mt-3 text-[14px] leading-5 text-[#525252]"
            />
          ))}
        </div>
        <Reveal
          variant="section-heading"
          className="absolute left-[676px] top-0 w-[604px]"
        >
          <div data-ar>
            <h2 className="text-[40px] font-bold leading-[74px]">
              {about.heading}
            </h2>
            <p className="mt-[22px] text-[28px] leading-[42px] text-[#4e4e4e]">
              {about.body}
            </p>
          </div>
        </Reveal>
      </section>

      <section
        data-ar
        className="absolute left-20 top-[1325px] grid w-[1280px] grid-cols-2 gap-6"
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
              <MotionCard className="group h-full w-full rounded-[32px] bg-white p-8 shadow-[0_18px_70px_rgba(15,23,42,0.07)]">
                <div className="mb-6 flex items-center justify-start gap-4">
                  <h3 className="text-xl font-semibold text-[#0a1020]">{title}</h3>
                  <span className="inline-flex rounded-2xl bg-[#012561] p-3 text-white transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="h-11 w-11" />
                  </span>
                </div>
                <p className="mt-3 text-[18px] leading-[23px] text-[#5b6577]">{body}</p>
              </MotionCard>
            </Reveal>
          );
        })}
      </section>

      <ProcessSectionDesktop process={process} />

      <ProductsSectionDesktop products={products} />

      <Heading y={3426} title={services.title} body={services.body} />
      <ServicesSection
        id={sectionIds.services}
        services={services}
        className="absolute left-20 top-[3584px] h-[800px] w-[1280px]"
      />

      <Heading y={4496} title={sectors.title} body={sectors.body} />
      <Reveal
        variant="band-wipe"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[4571px] z-0 h-[322px] w-screen -translate-x-1/2 origin-center"
      >
        <SectorsBlueBand className="h-full" />
      </Reveal>
      <SectorsCarousel
        sectors={sectors.items}
        label={sectors.carouselLabel}
        className="absolute left-1/2 top-[4654px] z-10 h-[164px] w-screen -translate-x-1/2 px-0"
      />

      <div className="absolute left-1/2 top-[4906px] h-[708px] w-screen -translate-x-1/2 bg-[#012561]" />
      <WhySection
        id={sectionIds.why}
        title={why.title}
        reasons={why.reasons}
        desktop
        className="absolute left-0 top-[4906px] grid h-[708px] w-[1440px] grid-cols-[685px_1fr] px-20 py-[88px]"
      />

      <section
        id={sectionIds.market}
        data-ar
        className="absolute left-1/2 top-[5614px] h-[726px] w-screen -translate-x-1/2 overflow-visible"
      >
        <Reveal
          variant="fade-down"
          className="absolute left-20 top-1/2 z-10 w-[628px] -translate-y-1/2"
        >
          <div className="text-start">
            <h2 className="text-[56px] font-medium leading-[72px]">
              {market.title}
            </h2>
            <p className="mt-10 text-[28px] font-medium leading-[42px] text-[#4e4e4e]">
              {market.body1}
              <br />
              <br />
              {market.body2}
            </p>
            <MarketOutcomePills outcomes={market.outcomes} />
          </div>
        </Reveal>

        <Reveal
          variant="fade-up"
          delay={90}
          className={cn(
            "absolute top-1/2 h-[590px] -translate-y-1/2",
            marketViewportBleedEnd,
          )}
        >
          <MarketCinematicVisual bleedEnd className="h-full" />
        </Reveal>
      </section>
    </div>
  );
}
