"use client";

import type { SectorIconKey } from "./sector-icons";
import { getSectorIcon } from "./sector-icons";
import AutoScroll from "embla-carousel-auto-scroll";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { getDirection, type Locale } from "@/i18n/routing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";
import { SectorCard } from "./SectorCard";

const CARD_WIDTH_PX = 218;
const CARD_GAP_PX = 38;

// Embla can only loop when the track is wider than the viewport, and an auto-scrolling
// ribbon needs a second copy so the seam is always filled. 16 slides ≈ 4096px covers
// ultrawide screens; sparsely-configured sector lists get repeated up to that count.
const MIN_SLIDES = 16;

type SectorItem = {
  id: string;
  title: string;
  icon: SectorIconKey;
};

type SlideItem = SectorItem & {
  slideKey: string;
};

type SectorsCarouselProps = {
  className?: string;
  label: string;
  sectors: SectorItem[];
};

function buildSlides(sectors: SectorItem[]): SlideItem[] {
  if (!sectors.length) return [];
  const repeats = Math.max(2, Math.ceil(MIN_SLIDES / sectors.length));
  return Array.from({ length: repeats }, () => sectors)
    .flat()
    .map((sector, index) => ({
      ...sector,
      slideKey: `${index}-${sector.id}-${sector.icon}`,
    }));
}

export function SectorsCarousel({ className, label, sectors }: SectorsCarouselProps) {
  const reducedMotion = useReducedMotion();
  const locale = useLocale();
  const direction = getDirection(locale as Locale);
  const slides = useMemo(() => buildSlides(sectors), [sectors]);
  const plugins = useMemo(
    () =>
      reducedMotion
        ? []
        : [
            AutoScroll({
              direction: "forward",
              playOnInit: true,
              speed: 0.75,
              stopOnFocusIn: true,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ],
    [reducedMotion]
  );

  return (
    <section
      className={cn("relative w-full", className)}
      aria-label={label}
      aria-live="off"
    >
      <Carousel
        opts={{
          // Seamless infinite loop — the ribbon scrolls forever with no stop/jump at the end.
          loop: true,
          align: "start",
          dragFree: true,
          // Embla measures LTR unless told otherwise; on the Arabic (RTL) page that made
          // the track drift out of the viewport and dragging fight the auto-scroll.
          direction,
        }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent
          // Spacing lives on each slide (padding-left) rather than the container's
          // column-gap, so the gap is preserved at the auto-scroll loop seam too —
          // otherwise the last card wraps flush against the first and overlaps it.
          // The negative margin cancels the leading slide's padding to keep alignment.
          style={{ marginInlineStart: `-${CARD_GAP_PX}px` }}
        >
          {slides.map(({ id, title, icon, slideKey }) => (
            <CarouselItem
              key={slideKey}
              className="basis-auto"
              style={{
                flexBasis: `${CARD_WIDTH_PX + CARD_GAP_PX}px`,
                paddingInlineStart: `${CARD_GAP_PX}px`,
              }}
            >
              <SectorCard
                title={title}
                Icon={getSectorIcon(id, icon)}
                className="h-[164px] w-[218px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
