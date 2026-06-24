"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

const WHEEL_COOLDOWN_MS = 900;
const WHEEL_STEP_THRESHOLD = 24;

const smoothEase = [0.16, 1, 0.3, 1] as const;
const smoothTransition = { duration: 0.55, ease: smoothEase };
const springTransition = { type: "spring" as const, stiffness: 340, damping: 36, mass: 0.85 };

type ServiceItem = {
  title: string;
  body: string;
  phoneImage: string;
  visualImage: string;
};

type ServicesContent = {
  carouselLabel: string;
  items: ServiceItem[];
};

type ServicesSectionProps = {
  className?: string;
  id?: string;
  services: ServicesContent;
};

function ServicesMedia({
  item,
  swapKey,
  hasEntered,
  compact,
}: {
  item: ServiceItem;
  swapKey: number;
  hasEntered: boolean;
  compact: boolean;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        className="absolute inset-0"
        initial={
          reducedMotion
            ? false
            : {
                opacity: 0,
                y: hasEntered ? 36 : 72,
                scale: 0.97,
              }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          reducedMotion
            ? undefined
            : { opacity: 0, y: -28, scale: 0.98, transition: { duration: 0.38, ease: smoothEase } }
        }
        transition={smoothTransition}
      >
        <Image
          src={item.visualImage}
          alt=""
          width={519}
          height={554}
          className={cn(
            "absolute object-contain",
            compact
              ? "inset-x-0 bottom-0 mx-auto h-[280px] w-auto sm:h-[340px]"
              : "left-[38px] top-[47px] h-[554px] w-[519px]"
          )}
        />
        <Image
          src={item.phoneImage}
          alt=""
          width={548}
          height={480}
          className={cn(
            "absolute object-contain",
            compact
              ? "inset-x-0 bottom-6 mx-auto h-[240px] w-auto sm:h-[300px]"
              : "left-0 top-[78px] h-[480px] w-[548px]"
          )}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function ServiceRow({
  title,
  body,
  index,
  isActive,
  isLast,
  onSelect,
  goToLabel,
  rowRef,
}: {
  title: string;
  body: string;
  index: number;
  isActive: boolean;
  isLast: boolean;
  onSelect: () => void;
  goToLabel: string;
  rowRef: (node: HTMLElement | null) => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <article
      ref={rowRef}
      data-service-row
      data-index={index}
      data-ar
      className={cn(
        "grid grid-cols-[16px_1fr] items-stretch gap-6 border-b border-[#e8e8e8] py-8 last:border-b-0 lg:min-h-[200px] lg:gap-8 lg:py-12 lg:last:border-b-0",
        !isLast && "lg:border-b lg:border-[#e8e8e8]"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={goToLabel}
        aria-current={isActive ? "true" : undefined}
        className="relative my-auto min-h-[72px] w-4 shrink-0 lg:min-h-[96px]"
      >
        {!isActive && (
          <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 rounded-full bg-[#d1d5db] transition-colors duration-300" />
        )}
        {isActive && (
          <motion.span
            layoutId="services-active-indicator"
            className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-[#012561]"
            transition={reducedMotion ? { duration: 0 } : springTransition}
          />
        )}
      </button>

      <button type="button" onClick={onSelect} className="text-right">
        <motion.h3
          className="text-2xl font-semibold leading-[1.4] lg:text-[28px] lg:leading-[42px]"
          animate={{
            color: isActive ? "#0d0d0d" : "#b8b8b8",
          }}
          transition={smoothTransition}
        >
          {title}
        </motion.h3>
        <motion.p
          className="mt-2 text-lg leading-8 lg:mt-2 lg:text-[24px] lg:leading-9"
          animate={{
            color: isActive ? "#525252" : "#c8c8c8",
            opacity: isActive ? 1 : 0.65,
            y: isActive ? 0 : 6,
          }}
          transition={smoothTransition}
        >
          {body}
        </motion.p>
      </button>
    </article>
  );
}

export function ServicesSection({ className, id, services }: ServicesSectionProps) {
  const t = useTranslations("services");
  const { items, carouselLabel } = services;
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const lastWheelRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const activeIndexRef = useRef(0);
  const suppressObserverUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const activeItem = items[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = useCallback(
    (index: number, lockObserver = false) => {
      const nextIndex = Math.max(0, Math.min(items.length - 1, index));
      activeIndexRef.current = nextIndex;
      if (lockObserver) {
        suppressObserverUntilRef.current = Date.now() + WHEEL_COOLDOWN_MS;
      }
      setActiveIndex(nextIndex);
    },
    [items.length]
  );

  const goNext = useCallback(() => {
    goTo(activeIndexRef.current + 1, true);
  }, [goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndexRef.current - 1, true);
  }, [goTo]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setHasEntered(true);
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(media);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];
    if (!rows.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!best) return;
        if (Date.now() < suppressObserverUntilRef.current) return;

        const index = Number(best.target.getAttribute("data-index"));
        if (!Number.isNaN(index)) {
          setActiveIndex(index);
        }
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: [0.2, 0.45, 0.7] }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [items.length, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const onWheel = (event: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.55 &&
        rect.bottom > window.innerHeight * 0.45;

      if (!inView) return;

      const now = Date.now();
      const currentIndex = activeIndexRef.current;
      const direction = event.deltaY > 0 ? 1 : -1;
      const canMoveNext = direction > 0 && currentIndex < items.length - 1;
      const canMovePrev = direction < 0 && currentIndex > 0;

      if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS) {
        if (canMoveNext || canMovePrev) {
          event.preventDefault();
        }
        return;
      }

      if (!canMoveNext && !canMovePrev) {
        wheelDeltaRef.current = 0;
        return;
      }

      wheelDeltaRef.current += event.deltaY;
      event.preventDefault();

      if (Math.abs(wheelDeltaRef.current) < WHEEL_STEP_THRESHOLD) return;

      if (wheelDeltaRef.current > 0 && currentIndex < items.length - 1) {
        event.preventDefault();
        lastWheelRef.current = now;
        wheelDeltaRef.current = 0;
        goNext();
        return;
      }

      if (wheelDeltaRef.current < 0 && currentIndex > 0) {
        event.preventDefault();
        lastWheelRef.current = now;
        wheelDeltaRef.current = 0;
        goPrev();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev, items.length, reducedMotion]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      goPrev();
    }
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label={carouselLabel}
      className={cn("outline-none", className)}
    >
      <div className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,628px)_minmax(0,1fr)] lg:gap-10">
        <motion.div
          ref={mediaRef}
          className="relative order-2 min-h-[360px] lg:order-none lg:min-h-0"
          initial={reducedMotion ? false : { opacity: 0, y: 80 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.85, ease: smoothEase }}
        >
          <div className="relative hidden h-full min-h-[554px] lg:block">
            <ServicesMedia
              item={activeItem}
              swapKey={activeIndex}
              hasEntered={hasEntered}
              compact={false}
            />
          </div>
          <div className="relative h-[320px] sm:h-[380px] lg:hidden">
            <ServicesMedia
              item={activeItem}
              swapKey={activeIndex}
              hasEntered={hasEntered}
              compact
            />
          </div>
        </motion.div>

        <div className="order-1 flex min-h-0 flex-col gap-2 lg:order-none lg:h-full lg:gap-4">
          {items.map(({ title, body }, index) => (
            <ServiceRow
              key={title}
              title={title}
              body={body}
              index={index}
              isActive={index === activeIndex}
              isLast={index === items.length - 1}
              onSelect={() => goTo(index)}
              goToLabel={t("goToService", { service: title, index: index + 1 })}
              rowRef={(node) => {
                rowRefs.current[index] = node;
              }}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {t("activeService", { service: activeItem.title })}
      </p>
    </section>
  );
}
