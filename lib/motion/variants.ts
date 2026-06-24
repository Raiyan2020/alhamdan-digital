import type { Transition, Variants } from "motion/react";
import {
  MOTION_DURATION,
  MOTION_ROOT_MARGIN,
  MOTION_THRESHOLD,
} from "./tokens";

export type MotionRevealVariant =
  | "reveal"
  | "fade"
  | "fade-up"
  | "fade-down"
  | "scale-in"
  | "slide-rtl"
  | "section-heading"
  | "image"
  | "band-wipe"
  | "hero-text"
  | "hero-image"
  | "footer"
  | "footer-wave";

const emphasizedEase = [0.2, 0.8, 0.2, 1] as const;

export const motionEase = {
  emphasized: emphasizedEase,
  out: [0.16, 1, 0.3, 1] as const,
} as const;

export const motionItemVariants: Record<MotionRevealVariant, Variants> = {
  reveal: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-up": {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -28 },
    visible: { opacity: 1, y: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  "slide-rtl": {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  "section-heading": {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  image: {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "band-wipe": {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  "hero-text": {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  "hero-image": {
    hidden: { opacity: 0, scale: 1.04 },
    visible: { opacity: 1, scale: 1 },
  },
  footer: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  "footer-wave": {
    hidden: { opacity: 0, y: 44, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 26,
        mass: 0.85,
      },
    },
  },
};

export function getRevealTransition(
  variant: MotionRevealVariant,
  delayMs = 0
): Transition {
  const delay = delayMs / 1000;
  const isHero = variant === "hero-text" || variant === "hero-image";

  return {
    duration: (isHero ? MOTION_DURATION.cinematic : MOTION_DURATION.slow) / 1000,
    delay,
    ease: motionEase.emphasized,
  };
}

export function getStaggerTransition(
  staggerMs: number,
  options?: { staggerDirection?: 1 | -1; delayChildrenMs?: number }
): Transition {
  return {
    staggerChildren: staggerMs / 1000,
    delayChildren: (options?.delayChildrenMs ?? 0) / 1000,
    ...(options?.staggerDirection !== undefined
      ? { staggerDirection: options.staggerDirection }
      : {}),
  };
}

export function getViewportOptions(
  variant: MotionRevealVariant,
  mobile = false
) {
  if (variant === "footer" || variant === "footer-wave") {
    return {
      once: true,
      amount: mobile
        ? MOTION_THRESHOLD.footer.mobile
        : MOTION_THRESHOLD.footer.desktop,
      margin: MOTION_ROOT_MARGIN.footer,
    } as const;
  }

  if (variant === "image") {
    return {
      once: true,
      amount: mobile
        ? MOTION_THRESHOLD.images.mobile
        : MOTION_THRESHOLD.images.desktop,
      margin: MOTION_ROOT_MARGIN.images,
    } as const;
  }

  if (variant === "section-heading") {
    return {
      once: true,
      amount: mobile
        ? MOTION_THRESHOLD.sectionHeading.mobile
        : MOTION_THRESHOLD.sectionHeading.desktop,
      margin: MOTION_ROOT_MARGIN.sectionHeading,
    } as const;
  }

  return {
    once: true,
    amount: mobile
      ? MOTION_THRESHOLD.cards.mobile
      : MOTION_THRESHOLD.cards.desktop,
    margin: MOTION_ROOT_MARGIN.cards,
  } as const;
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {},
};

export const logoHoverTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 18,
};
