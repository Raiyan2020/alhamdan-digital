"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { imageFallbacks, resolveImageSrc } from "@/lib/media/image-url";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function ImageWithFallback({
  src,
  fallbackSrc = imageFallbacks.headerLogo,
  ...props
}: ImageWithFallbackProps) {
  const { alt, ...imageProps } = props;
  const fallback = resolveImageSrc(fallbackSrc);
  const resolvedSrc = resolveImageSrc(src, fallback);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc = failedSrc === resolvedSrc ? fallback : resolvedSrc;

  return (
    <Image
      {...imageProps}
      alt={alt}
      src={currentSrc}
      onError={() => {
        if (currentSrc !== fallback) setFailedSrc(resolvedSrc);
      }}
    />
  );
}
