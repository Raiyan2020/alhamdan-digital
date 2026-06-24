"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import {
  aboutCardIconClass,
  aboutCardSharedClass,
  aboutCardStyles,
  type AboutCardKey,
} from "./about-card-styles";
import { aboutCardIconMap, type AboutCardIconKey } from "./sector-icons";

type AboutFeatureCardProps = {
  cardKey: AboutCardKey;
  title: string;
  body: string;
  icon: AboutCardIconKey;
  delayMs?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  iconWrapClassName?: string;
};

const offsetByDirection = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 42, y: 0 },
  right: { x: -42, y: 0 },
} as const;

const iconVariants: Variants = {
  rest: { rotate: 0, scale: 1, y: 0 },
  hover: {
    rotate: [0, -10, 9, 0],
    scale: [1, 1.12, 1.04],
    y: -4,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AboutFeatureCard({
  cardKey,
  title,
  body,
  icon,
  delayMs = 0,
  direction = "up",
  className,
  titleClassName,
  bodyClassName,
  iconWrapClassName,
}: AboutFeatureCardProps) {
  const reducedMotion = useReducedMotion();
  const Icon = aboutCardIconMap[icon];
  const { bg } = aboutCardStyles[cardKey];
  const offset = offsetByDirection[direction];

  return (
    <motion.article
      data-ar
      className={cn(
        "flex flex-col items-center justify-center p-6",
        aboutCardSharedClass,
        className,
      )}
      style={{ backgroundColor: bg }}
      initial={reducedMotion ? false : { opacity: 0, x: offset.x, y: offset.y, scale: 0.96 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, x: 0, y: 0, scale: 1 }}
      whileHover={reducedMotion ? undefined : "hover"}
      viewport={{ once: true, amount: 0.45, margin: "0px 0px -8% 0px" }}
      transition={{
        delay: delayMs / 1000,
        duration: 0.64,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.span
        className={cn(aboutCardIconClass, iconWrapClassName)}
        variants={iconVariants}
        initial="rest"
      >
        <Icon className="h-6 w-6" aria-hidden />
      </motion.span>
      <h3 className={titleClassName}>{title}</h3>
      <p className={bodyClassName}>{body}</p>
    </motion.article>
  );
}
