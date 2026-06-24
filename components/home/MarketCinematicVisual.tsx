import Image from "next/image";
import { cn } from "@/lib/utils";

const IMAGE_SRC = "/figma/market-visual.webp";

type MarketCinematicVisualProps = {
  className?: string;
  /** Align image to the start edge (RTL: right bleed) */
  bleedStart?: boolean;
  /** Align image to the end edge (LTR: right bleed) */
  bleedEnd?: boolean;
};

export function MarketCinematicVisual({
  className,
  bleedStart = false,
  bleedEnd = false,
}: MarketCinematicVisualProps) {
  return (
    <div
      className={cn(
        "relative overflow-visible",
        bleedEnd && "flex justify-end",
        className
      )}
      aria-hidden
    >
      <Image
        src={IMAGE_SRC}
        alt=""
        width={603}
        height={550}
        sizes="(min-width: 1440px) 603px, 100vw"
        className={cn(
          "block max-w-none select-none object-contain",
          bleedEnd ? "h-full w-auto object-right" : "h-auto w-[603px]",
          !bleedEnd && !bleedStart && "mx-auto",
          bleedStart && !bleedEnd && "me-auto"
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
