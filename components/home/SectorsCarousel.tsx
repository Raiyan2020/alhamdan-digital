"use client";

import type { SectorIconKey } from "./sector-icons";
import { sectorIconMap } from "./sector-icons";
import AutoScroll from "embla-carousel-auto-scroll";
import { useMemo } from "react";
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

type SectorItem = {
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
  return sectors.map((sector, index) => ({
    ...sector,
    slideKey: `${index}-${sector.icon}`,
  }));
}

export function SectorsCarousel({ className, label, sectors }: SectorsCarouselProps) {
  const reducedMotion = useReducedMotion();
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
          loop: false,
          align: "start",
          dragFree: true,
        }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent
          className="-ml-0"
          style={{ columnGap: `${CARD_GAP_PX}px` }}
        >
          {slides.map(({ title, icon, slideKey }) => (
            <CarouselItem
              key={slideKey}
              className="basis-auto pl-0"
              style={{
                flexBasis: `${CARD_WIDTH_PX}px`,
              }}
            >
              <SectorCard
                title={title}
                Icon={sectorIconMap[icon]}
                className="h-[164px] w-[218px]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
