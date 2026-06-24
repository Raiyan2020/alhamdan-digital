"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BrainCircuit,
  Gauge,
  Handshake,
  Layers3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { Reveal, Stagger } from "@/components/motion";
import { useInViewOnce } from "@/components/motion/useInViewOnce";
import { cn } from "@/lib/utils";

const PHONE_FRAME_SRC = "/figma/why-phone.webp";
const SCREEN_IMAGE_SRC = "/full-website.png";

const reasonIcons: LucideIcon[] = [
  Handshake,
  Gauge,
  Layers3,
  BrainCircuit,
  BadgeCheck,
  Sparkles,
];

type WhySectionProps = {
  id?: string;
  title: string;
  reasons: string[];
  className?: string;
  desktop?: boolean;
};

function WhyPhone({ desktop = false }: { desktop?: boolean }) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, visible } = useInViewOnce({ threshold: 0.35 });
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      inViewRef.current = node;
    },
    [inViewRef]
  );

  const onScreenImageLoad = useCallback(
    (img: HTMLImageElement) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const renderedHeight =
        (img.naturalHeight / img.naturalWidth) * viewport.clientWidth;
      const distance = Math.max(0, renderedHeight - viewport.clientHeight);
      setScrollDistance(distance);
    },
    []
  );

  const shouldScroll = visible && !reducedMotion && scrollDistance > 0;
  const scrollDuration = isHovered ? 7 : 18;

  return (
    <div
      className={cn(
        "group relative mx-auto overflow-visible",
        desktop ? "h-[620px] w-[525px]" : "aspect-[525/620] w-full max-w-[500px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={PHONE_FRAME_SRC}
        alt=""
        width={525}
        height={620}
        priority={desktop}
        className="relative z-20 h-full w-full object-contain"
      />
      <div
        ref={setRefs}
        className="pointer-events-auto absolute z-30 overflow-hidden rounded-t-[36px] rounded-b-none bg-black"
        style={{
          left: "11%",
          top: "10%",
          width: "78%",
          bottom: "1.5%",
        }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-x-0 top-0 w-full"
          initial={false}
          animate={shouldScroll ? { y: [0, -scrollDistance] } : { y: 0 }}
          transition={
            shouldScroll
              ? {
                  duration: scrollDuration,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse",
                }
              : undefined
          }
        >
          <Image
            src={SCREEN_IMAGE_SRC}
            alt=""
            width={390}
            height={3200}
            sizes="(min-width: 1440px) 408px, 70vw"
            className="block h-auto w-[102%] max-w-none -ms-[1%] object-top"
            onLoadingComplete={onScreenImageLoad}
          />
        </motion.div>
      </div>
    </div>
  );
}

function ReasonItem({ reason, index }: { reason: string; index: number }) {
  const Icon = reasonIcons[index % reasonIcons.length];

  return (
    <motion.li
      className="group relative flex items-center gap-4 pb-2 text-left text-[22px] font-semibold text-white max-sm:text-lg"
      whileHover="hover"
    >
      <motion.span
        className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-white text-[#012561]"
        variants={{
          hover: {
            rotate: [0, -8, 8, 0],
            scale: 1.1,
          },
        }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </motion.span>
      <span dir="auto" className="block flex-1 text-start leading-[1.7]">
        {reason}
      </span>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-white/80 transition-transform duration-300 group-hover:scale-x-100"
      />
    </motion.li>
  );
}

export function WhySection({ id, title, reasons, className, desktop = false }: WhySectionProps) {
  return (
    <section id={id} className={cn("text-white", className)}>
      <Reveal variant="image" className={cn(!desktop && "order-2 md:order-none")}>
        <WhyPhone desktop={desktop} />
      </Reveal>
      <div data-ar className={cn(desktop ? "pt-[75px]" : "order-1 md:order-none")}>
        <Reveal variant="section-heading">
          <h2
            dir="auto"
            className={cn(
              "font-medium text-white",
              desktop ? "text-[48px] leading-[72px]" : "text-3xl sm:text-4xl"
            )}
          >
            {title}
          </h2>
        </Reveal>
        <Stagger as="ul" className="mt-8 grid gap-[14px]" staggerMs={70} variant="fade-up">
          {reasons.map((reason, index) => (
            <ReasonItem key={reason} reason={reason} index={index} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
