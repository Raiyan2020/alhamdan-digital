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
        "relative flex min-h-0 flex-col items-center text-center justify-start px-3 py-5 sm:px-4 bg-[#E5EFFF] w-full",
        "md:flex-1 md:h-full md:py-6 md:px-3.5 md:justify-center md:min-h-0",
        className
      )}
    >
      <motion.p
        dir="ltr"
        className="flex flex-row flex-nowrap items-center gap-2 text-[30px] font-normal leading-[36px] text-[#012561] font-sans [direction:ltr] whitespace-nowrap"
        variants={contentVariants}
        transition={transitionFor(0)}
        {...motionProps}
      >
        <span className="h-2 w-2 rounded-full bg-[#012561]" aria-hidden />
        <span>{number.padStart(2, "0")}</span>
      </motion.p>

      <motion.h3
        className="mt-3 text-lg font-medium leading-[28px] text-[#0D0D0D] tracking-[-0.02em] md:mt-4 md:w-full"
        variants={contentVariants}
        transition={transitionFor(0.14)}
        {...motionProps}
      >
        {title.replace(/\s*\n\s*/g, " ")}
      </motion.h3>

      <motion.div
        className="mt-2 text-xs leading-[23px] text-[#525252] font-normal md:text-[14px] md:w-full"
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
            <div className="overflow-hidden rounded-[24px] bg-[#DCDCDC] p-[1px]">
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
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "flex w-full md:w-[1280px] md:h-[248px] overflow-hidden rounded-[24px] md:rounded-2xl bg-[#DCDCDC] border-2 border-[#E5EFFF] gap-[1px]",
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
  topOffset,
}: {
  process: HomeContent["process"];
  topOffset?: number;
}) {
  const isAbsolute = topOffset !== undefined;
  if (isAbsolute) {
    return (
      <>
        <Heading y={1637 + topOffset} title={process.title} body={process.body} />
        <div
          className="absolute left-20 w-[1280px]"
          style={{ top: 1747 + topOffset }}
        >
          <ProcessStepsBar steps={process.steps} />
        </div>
      </>
    );
  }

  return (
    <section className="relative mx-auto w-[1280px] py-16">
      <Heading title={process.title} body={process.body} />
      <div className="mt-14 w-full">
        <ProcessStepsBar steps={process.steps} />
      </div>
    </section>
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
