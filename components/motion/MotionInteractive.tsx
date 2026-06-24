"use client";

import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import { Link } from "@/i18n/navigation";
import { glassBtnCn, glassIconBtnCn } from "@/lib/motion/glass-hover";
import { cn } from "@/lib/utils";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { useSmoothScroll } from "./SmoothScrollProvider";

const MotionLink = motion.create(Link);

function GlassContent({ children }: { children: ReactNode }) {
  return (
    <span className="motion-glass-content inline-flex items-center justify-center">
      {children}
    </span>
  );
}

type MotionLinkButtonProps = Omit<ComponentProps<typeof MotionLink>, "children"> & {
  glassVariant?: "btn" | "icon";
  children?: ReactNode;
};

export function MotionLinkButton({
  className,
  children,
  glassVariant = "btn",
  href,
  onClick,
  ...props
}: MotionLinkButtonProps) {
  const reducedMotion = useReducedMotion();
  const { scrollToHash } = useSmoothScroll();
  const glassClass =
    glassVariant === "icon" ? glassIconBtnCn() : glassBtnCn();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof href === "string" && href.includes("#")) {
      event.preventDefault();
      scrollToHash(href);
    }
    onClick?.(event);
  };

  return (
    <MotionLink
      href={href}
      onClick={handleClick}
      className={cn(glassClass, "inline-flex items-center justify-center", className)}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      <GlassContent>{children}</GlassContent>
    </MotionLink>
  );
}

type MotionButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> & {
  children?: ReactNode;
};

export function MotionButton({ className, children, ...props }: MotionButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={cn(glassBtnCn(), "inline-flex items-center justify-center", className)}
      whileTap={reducedMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      <GlassContent>{children}</GlassContent>
    </motion.button>
  );
}

type MotionCardProps = ComponentProps<typeof motion.article> & {
  variants?: Variants;
  transition?: Transition;
};

export function MotionCard({
  className,
  children,
  variants,
  transition,
  ...props
}: MotionCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className={cn(className)}
      variants={variants}
      transition={transition}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -6,
              scale: 1.01,
              boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
            }
      }
      {...props}
    >
      {children}
    </motion.article>
  );
}

type MotionImageProps = ComponentProps<typeof motion.div>;

export function MotionCardImage({ className, children, ...props }: MotionImageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("motion-card-image", className)}
      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type MotionIconLiftProps = ComponentProps<typeof motion.span> & {
  pulseOnView?: boolean;
};

export function MotionIconLift({
  className,
  children,
  pulseOnView = false,
  ...props
}: MotionIconLiftProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      className={cn(className)}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      initial={pulseOnView && !reducedMotion ? { scale: 1 } : false}
      whileInView={
        pulseOnView && !reducedMotion ? { scale: [1, 1.06, 1] } : undefined
      }
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        duration: pulseOnView ? 0.42 : 0.14,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
