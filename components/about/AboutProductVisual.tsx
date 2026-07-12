"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { imageFallbacks, isValidImageSrc, resolveImageSrc } from "@/lib/media/image-url";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

type AboutProductVisualProps = {
  src: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  style?: CSSProperties;
  priority?: boolean;
  animate?: boolean;
};

export function AboutProductVisual({
  src,
  alt,
  className,
  frameClassName,
  style,
  priority = false,
  animate = true,
}: AboutProductVisualProps) {
  const imageSrc = resolveImageSrc(src, imageFallbacks.aboutProduct);

  const frame = (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[40px] bg-brand",
        frameClassName,
      )}
    >
      {isValidImageSrc(imageSrc) ? (
        <ImageWithFallback
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(min-width: 1440px) 520px, 100vw"
        />
      ) : null}
    </div>
  );

  if (!animate) {
    return (
      <div className={className} style={style}>
        {frame}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {frame}
    </motion.div>
  );
}
