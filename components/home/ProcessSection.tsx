"use client";

import { useEffect, useState } from "react";
import type { HomeContent } from "@/lib/i18n/home-content";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useLocale } from "next-intl";
import { RichTextHtml } from "@/lib/cms/rich-text";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Heading } from "./Heading";
import { MobileHeading } from "./MobileHeading";

type ProcessStep = HomeContent["process"]["steps"][number];

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function ProcessStepCell({
  number,
  title,
  body,
  showDivider,
  index,
  className,
}: ProcessStep & {
  showDivider?: boolean;
  index: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const baseDelay = index * 0.12;
  const motionProps = reducedMotion
    ? { initial: false }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.55 },
      };
  const transitionFor = (offset: number) => ({
    delay: baseDelay + offset,
    duration: 0.48,
    ease: [0.16, 1, 0.3, 1] as const,
  });

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col items-center justify-start px-3 py-5 text-center sm:px-4 md:min-h-[276px] md:flex-1 md:px-2 md:py-10",
        className
      )}
    >
      {showDivider ? (
        <span
          aria-hidden
          className="absolute inset-y-6 start-0 hidden w-px bg-brand/12 md:block"
        />
      ) : null}

      <motion.p
        dir="rtl"
        className="inline-flex items-center gap-1.5 text-[14px] font-semibold tracking-wide text-brand"
        variants={contentVariants}
        transition={transitionFor(0)}
        {...motionProps}
      >
        <span className="text-[var(--process-accent)]" aria-hidden>
          •
        </span>
        <span data-bidi="ltr">{number}</span>
      </motion.p>

      <motion.h3
        dir="rtl"
        className="mt-3 text-sm font-bold leading-snug text-ink md:mt-4 md:whitespace-nowrap md:text-[14px]"
        variants={contentVariants}
        transition={transitionFor(0.14)}
        {...motionProps}
      >
        {title.replace(/\s*\n\s*/g, " ")}
      </motion.h3>

      <motion.div
        dir="rtl"
        className="mt-2 max-w-[16rem] text-xs leading-5 text-[var(--process-muted)] sm:max-w-[18rem] sm:text-[13px] md:max-w-[12.5rem] md:leading-5"
        variants={contentVariants}
        transition={transitionFor(0.28)}
        {...motionProps}
      >
        <RichTextHtml html={body} />
      </motion.div>
    </div>
  );
}

function ProcessStepsMobileCarousel({ steps }: { steps: ProcessStep[] }) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const scrollToStart = () => {
      api.scrollTo(0, true);
    };

    scrollToStart();
    api.on("reInit", scrollToStart);

    return () => {
      api.off("reInit", scrollToStart);
    };
  }, [api, isRtl]);

  return (
    <Carousel
      key={locale}
      dir={isRtl ? "rtl" : "ltr"}
      setApi={setApi}
      opts={{
        align: "start",
        direction: isRtl ? "rtl" : "ltr",
        containScroll: "trimSnaps",
      }}
      className="w-full"
    >
      <CarouselContent>
        {steps.map((step, index) => (
          <CarouselItem key={step.number} className="basis-[84%] sm:basis-[70%]">
            <div className="rounded-[24px] bg-[var(--process-bar)]">
              <ProcessStepCell {...step} index={index} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function ProcessStepsBar({
  steps,
  className,
}: {
  steps: ProcessStep[];
  className?: string;
}) {
  return (
    <div
      dir="rtl"
      className={cn(
        "flex overflow-hidden rounded-[24px] bg-[var(--process-bar)] md:rounded-[28px]",
        className
      )}
    >
      {steps.map((step, index) => (
        <ProcessStepCell
          key={step.number}
          {...step}
          index={index}
          showDivider={index > 0}
        />
      ))}
    </div>
  );
}

export function ProcessSectionDesktop({
  process,
}: {
  process: HomeContent["process"];
}) {
  return (
    <>
      <Heading y={1637} title={process.title} body={process.body} />
      <div className="absolute left-20 top-[1747px] w-[1280px]">
        <ProcessStepsBar steps={process.steps} />
      </div>
    </>
  );
}

export function ProcessSectionMobile({
  process,
}: {
  process: HomeContent["process"];
}) {
  return (
    <section className="py-8 md:py-12">
      <MobileHeading title={process.title} body={process.body} />
      <div className="mx-auto mt-6 max-w-7xl px-5 md:mt-8">
        <ProcessStepsMobileCarousel steps={process.steps} />
      </div>
    </section>
  );
}
