"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

type HeroCinematicVisualProps = {
  className?: string;
  imageClassName?: string;
  entranceDelayMs?: number;
  priority?: boolean;
  personImage?: string;
  personImageAlt?: string;
  brushImage?: string;
};

const PERSON_REVEAL_OFFSET_S = 0.12;
const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

function floatLoop(duration: number, delay = 0): Transition {
  return {
    duration,
    delay,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror",
  };
}

export function HeroCinematicVisual({
  className,
  imageClassName,
  entranceDelayMs = 0,
  priority = false,
  personImage = "/figma/hero-person-layer.webp",
  personImageAlt = "",
  brushImage = "/bg-hero.png",
}: HeroCinematicVisualProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = !reducedMotion;
  const [replayKey, setReplayKey] = useState(0);
  const replayDelay = replayKey === 0 ? entranceDelayMs / 1000 : 0;

  return (
    <motion.div
      className={cn(
        "relative isolate mx-auto aspect-604/500 w-full max-w-[604px] overflow-visible",
        className,
      )}
      aria-hidden={personImageAlt ? undefined : true}
      onHoverStart={() => {
        if (shouldAnimate) setReplayKey((key) => key + 1);
      }}
    >
      {/* Brush stroke background — sits behind the person, revealed first */}
      <motion.div
        className="pointer-events-none absolute bottom-[-4%] left-1/2 z-0 w-[120%] -translate-x-1/2"
        initial={shouldAnimate ? { opacity: 0, scale: 0.85, filter: "blur(6px)" } : false}
        animate={shouldAnimate ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{
          delay: replayDelay,
          duration: 0.8,
          ease: CINEMATIC_EASE,
        }}
        aria-hidden
      >
        <Image
          src={brushImage}
          alt=""
          width={725}
          height={530}
          className="h-auto w-full object-contain"
        />
      </motion.div>

      {/* Entrance + breathing wrapper */}
      <motion.div
        key={`person-${replayKey}`}
        className="absolute inset-0 flex items-end justify-center"
        initial={shouldAnimate ? { opacity: 0, y: 40, scale: 0.94, filter: "blur(8px)" } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{
          delay: replayDelay + PERSON_REVEAL_OFFSET_S,
          duration: 0.9,
          ease: CINEMATIC_EASE,
        }}
      >
        {/* Slow ambient float */}
        <motion.div
          className="relative h-full w-full"
          animate={
            shouldAnimate
              ? { y: [0, -14, 0], rotate: [0, 0.6, 0] }
              : undefined
          }
          transition={{
            y: floatLoop(6.5, replayDelay + 0.9),
            rotate: floatLoop(9, replayDelay + 0.9),
          }}
          style={{ transformOrigin: "center bottom" }}
        >
          {/* Grounding shadow — moves opposite to the float for depth */}
          <motion.div
            className={cn(
              "pointer-events-none absolute bottom-[3%] left-1/2 h-[7%] w-[52%] -translate-x-1/2 rounded-[100%]",
              "bg-[radial-gradient(ellipse_at_center,rgba(1,37,97,0.28),transparent_70%)] blur-md",
              "dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),transparent_70%)]",
            )}
            animate={
              shouldAnimate
                ? { scaleX: [1, 0.82, 1], opacity: [0.55, 0.32, 0.55] }
                : undefined
            }
            transition={floatLoop(6.5, replayDelay + 0.9)}
            aria-hidden
          />

          <Image
            src={personImage}
            alt={personImageAlt}
            width={604}
            height={500}
            priority={priority}
            sizes="(min-width: 1440px) 604px, (min-width: 768px) 48vw, 100vw"
            className={cn(
              "relative z-10 h-full w-full object-contain object-bottom",
              "drop-shadow-[0_30px_55px_-22px_rgba(1,37,97,0.45)]",
              "dark:drop-shadow-[0_30px_55px_-20px_rgba(0,0,0,0.7)]",
              imageClassName,
            )}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
