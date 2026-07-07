"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type MarketCinematicVisualProps = {
  className?: string;
  image?: string;
  imageAlt?: string;
  /** Align image to the start edge (RTL: right bleed) */
  bleedStart?: boolean;
  /** Align image to the end edge (LTR: right bleed) */
  bleedEnd?: boolean;
};

export function MarketCinematicVisual({
  className,
  image = "/figma/market-visual.webp",
  imageAlt = "",
  bleedStart = false,
  bleedEnd = false,
}: MarketCinematicVisualProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div
      className={cn(
        "relative overflow-visible",
        bleedEnd && "flex justify-end",
        bleedStart && "flex justify-start",
        className
      )}
      aria-hidden
    >
      <Image
        src={image}
        alt={imageAlt}
        width={603}
        height={550}
        sizes="(min-width: 1440px) 603px, 100vw"
        className={cn(
          "block max-w-none select-none object-contain",
          !isRtl && "-scale-x-100",
          bleedEnd && (isRtl ? "h-full w-auto object-left" : "h-full w-auto object-right"),
          bleedStart && (isRtl ? "h-full w-auto object-right" : "h-full w-auto object-left"),
          !bleedEnd && !bleedStart && "mx-auto h-auto w-[603px]"
        )}
        draggable={false}
      />
    </div>
  );
}

/** Negative inset so content bleeds to the viewport edge outside a centered max-width canvas. */
export const marketViewportBleedEnd =
  "right-[max(calc((100vw-1440px)/-2),0px)]";

export const marketMobileBleedEnd =
  "right-0 w-[min(100vw,603px)] max-w-none sm:w-[603px]";
