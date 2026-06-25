"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { resolveImageSrc, imageFallbacks } from "@/lib/media/image-url";
import { Link } from "@/i18n/navigation";
import { logoHoverTransition } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type HeaderLogoProps = {
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  src?: string;
  alt?: string;
};

export function HeaderLogo({
  className,
  imageClassName,
  width = 80,
  height = 72,
  priority = false,
  src = imageFallbacks.headerLogo,
  alt = "Al Hamdan Digital",
}: HeaderLogoProps) {
  const reducedMotion = useReducedMotion();
  const logoSrc = resolveImageSrc(src, imageFallbacks.headerLogo);

  return (
    <Link href="/" className={cn("inline-flex shrink-0", className)}>
      <motion.span
        className="inline-flex origin-center"
        initial={false}
        whileHover={
          reducedMotion
            ? undefined
            : {
                rotate: 360,
                scale: 1.06,
                opacity: 0.92,
              }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.96, opacity: 1 }}
        transition={logoHoverTransition}
      >
        <Image
          src={logoSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "h-14 w-auto object-contain sm:h-[72px] sm:w-[80px]",
            imageClassName
          )}
          priority={priority}
        />
      </motion.span>
    </Link>
  );
}
