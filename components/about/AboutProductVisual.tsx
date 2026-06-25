"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { imageFallbacks, isValidImageSrc, resolveImageSrc } from "@/lib/media/image-url";
import { cn } from "@/lib/utils";

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
        "flex items-center justify-center overflow-hidden rounded-[40px] bg-brand px-6 py-8",
        frameClassName,
      )}
    >
      {isValidImageSrc(imageSrc) ? (
        <Image
          src={imageSrc}
          alt={alt}
          width={603}
          height={600}
          priority={priority}
          className="h-auto max-h-[560px] w-full max-w-[420px] object-contain"
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
