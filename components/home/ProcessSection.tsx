"use client";

import type { HomeContent } from "@/lib/i18n/home-content";
import { motion, useReducedMotion, type Variants } from "motion/react";
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
        "relative flex min-h-[220px] min-w-[11.5rem] flex-1 flex-col items-center justify-start px-2 py-8 text-center sm:px-3 md:min-h-[276px] md:min-w-0 md:py-10",
        className
      )}
    >
      {showDivider ? (
        <span
          aria-hidden
          className="absolute inset-y-6 start-0 hidden w-px bg-[#012561]/12 md:block"
        />
      ) : null}

      <motion.p
        dir="rtl"
        className="inline-flex items-center gap-1.5 text-[14px] font-semibold tracking-wide text-[#012561]"
        variants={contentVariants}
        transition={transitionFor(0)}
        {...motionProps}
      >
        <span className="text-[#4da3ff]" aria-hidden>
          •
        </span>
        <span data-bidi="ltr">{number}</span>
      </motion.p>

      <motion.h3
        dir="rtl"
        className="mt-4 whitespace-nowrap text-[13px] font-bold leading-snug text-[#0d0d0d] md:text-[14px]"
        variants={contentVariants}
        transition={transitionFor(0.14)}
        {...motionProps}
      >
        {title.replace(/\s*\n\s*/g, " ")}
      </motion.h3>

      <motion.p
        dir="rtl"
        className="mt-2 max-w-[11rem] text-[12px] leading-[18px] text-[#64748b] md:max-w-[12.5rem] md:text-[13px] md:leading-5"
        variants={contentVariants}
        transition={transitionFor(0.28)}
        {...motionProps}
      >
        {body}
      </motion.p>
    </div>
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
        "flex overflow-hidden rounded-[24px] bg-[#eef5fc] md:rounded-[28px]",
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
    <section className="py-12">
      <MobileHeading title={process.title} body={process.body} />
      <div className="mx-auto mt-8 max-w-7xl px-5">
        <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:thin] md:overflow-visible">
          <ProcessStepsBar
            steps={process.steps}
            className="min-w-[1140px] md:min-w-0"
          />
        </div>
      </div>
    </section>
  );
}
