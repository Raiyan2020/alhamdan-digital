"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type MotionHeaderShellProps = {
  children: ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
};

export function MotionHeaderShell({
  children,
  className,
  dir,
}: MotionHeaderShellProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.header
      dir={dir}
      className={cn(className)}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={reducedMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.header>
  );
}

const ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER_S = 0.09;
const BASE_DELAY_S = 1.05;

export function useHeaderEntrance() {
  const reducedMotion = useReducedMotion();

  return (order: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: -10, filter: "blur(4px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            delay: BASE_DELAY_S + order * STAGGER_S,
            duration: 0.38,
            ease: ENTRANCE_EASE,
          },
        };
}

type HeaderEntranceProps = {
  order: number;
  className?: string;
  children: ReactNode;
};

export function HeaderEntrance({ order, className, children }: HeaderEntranceProps) {
  const entrance = useHeaderEntrance();

  return (
    <motion.div className={className} {...entrance(order)}>
      {children}
    </motion.div>
  );
}
