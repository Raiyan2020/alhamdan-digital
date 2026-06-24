"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type HeroCinematicVisualProps = {
  className?: string;
  imageClassName?: string;
  entranceDelayMs?: number;
  priority?: boolean;
};

const brushStrokes = [
  {
    d: "M36 305 C112 228 248 182 440 224 C512 240 556 276 584 314",
    width: 138,
    delay: 0,
    duration: 1.1,
  },
  {
    d: "M44 348 C156 284 310 258 558 300",
    width: 96,
    delay: 0.36,
    duration: 1,
  },
  {
    d: "M64 402 C194 342 378 332 570 382",
    width: 86,
    delay: 0.68,
    duration: 0.94,
  },
  {
    d: "M80 452 C214 412 396 410 566 432",
    width: 62,
    delay: 0.96,
    duration: 0.8,
  },
] as const;

const PERSON_REVEAL_OFFSET_S = 1.62;

export function HeroCinematicVisual({
  className,
  imageClassName,
  entranceDelayMs = 0,
  priority = false,
}: HeroCinematicVisualProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion;
  const maskId = `hero-brush-reveal-${useId().replace(/:/g, "")}`;
  const [replayKey, setReplayKey] = useState(0);
  const replayDelay = replayKey === 0 ? entranceDelayMs / 1000 : 0;

  return (
    <motion.div
      className={cn(
        "relative mx-auto aspect-[604/500] w-full max-w-[604px] overflow-visible",
        className
      )}
      aria-hidden
      onHoverStart={() => {
        if (shouldAnimate) setReplayKey((key) => key + 1);
      }}
    >
      <svg
        key={`brush-${replayKey}`}
        viewBox="0 0 604 500"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="presentation"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width="604" height="500" fill="black" />
            {brushStrokes.map((stroke) => (
              <motion.path
                key={stroke.d}
                d={stroke.d}
                fill="none"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={stroke.width}
                pathLength={1}
                initial={shouldAnimate ? { pathLength: 0, opacity: 0.98 } : false}
                animate={shouldAnimate ? { pathLength: 1, opacity: 0.98 } : undefined}
                transition={{
                  delay: replayDelay + stroke.delay,
                  duration: stroke.duration,
                  ease: [0.42, 0, 0.2, 1],
                }}
              />
            ))}
          </mask>
        </defs>
        <image
          href="/figma/hero-brush-layer.webp"
          width="604"
          height="500"
          preserveAspectRatio="xMidYMid meet"
          mask={`url(#${maskId})`}
        />
      </svg>

      <motion.div
        key={`person-${replayKey}`}
        className="absolute inset-0"
        initial={shouldAnimate ? { opacity: 0, y: 28, scale: 0.965, filter: "blur(5px)" } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{
          delay: replayDelay + PERSON_REVEAL_OFFSET_S,
          duration: 0.72,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Image
          src="/figma/hero-person-layer.webp"
          alt=""
          width={604}
          height={500}
          priority={priority}
          sizes="(min-width: 1440px) 604px, (min-width: 768px) 48vw, 100vw"
          className={cn(
            "h-full w-full object-contain object-center",
            imageClassName
          )}
        />
      </motion.div>
    </motion.div>
  );
}
