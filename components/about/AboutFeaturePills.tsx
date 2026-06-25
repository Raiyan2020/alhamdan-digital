"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { getViewportOptions } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type AboutFeaturePillsProps = {
  items: string[];
  columns?: 2 | 3 | 4;
  className?: string;
  itemKeyPrefix?: string;
};

const columnClassName = {
  4: "grid-cols-2 sm:grid-cols-4",
  3: "grid-cols-1 sm:grid-cols-3",
  2: "grid-cols-2",
} as const;

const pillDirectionVariants: Variants[] = [
  {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
  {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  {
    hidden: { opacity: 0, y: -28 },
    visible: { opacity: 1, y: 0 },
  },
  {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
];

const pillContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

function getPillVariants(index: number): Variants {
  return pillDirectionVariants[index % pillDirectionVariants.length]!;
}

export function AboutFeaturePills({
  items,
  columns = 4,
  className,
  itemKeyPrefix = "pill",
}: AboutFeaturePillsProps) {
  const reducedMotion = useReducedMotion();
  const viewport = getViewportOptions("fade-up");

  return (
    <motion.ul
      className={cn("grid w-full list-none gap-3", columnClassName[columns], className)}
      variants={reducedMotion ? undefined : pillContainerVariants}
      initial={reducedMotion ? false : "hidden"}
      whileInView={reducedMotion ? undefined : "visible"}
      viewport={viewport}
    >
      {items.map((item, index) => (
        <motion.li
          key={`${itemKeyPrefix}-${index}`}
          variants={reducedMotion ? undefined : getPillVariants(index)}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-11 items-center justify-start gap-2 rounded-full bg-card-muted px-4 text-sm font-bold text-ink"
        >
          <Check className="h-5 w-5 shrink-0 rounded-full bg-brand p-1 text-white" aria-hidden />
          <span className="text-start leading-snug">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
