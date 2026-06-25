"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion";
import { usePathname } from "@/i18n/navigation";

const MIN_INITIAL_MS = 900;
const MIN_ROUTE_MS = 650;
const FADE_MS = 450;

type SiteLoadingOverlayProps = {
  label: string;
  animation: string;
};

export function SiteLoadingOverlay({ label, animation }: SiteLoadingOverlayProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const isFirstPathname = useRef(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(
    (delayMs: number) => {
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        setVisible(false);
        hideTimerRef.current = null;
      }, delayMs);
    },
    [clearHideTimer],
  );

  useEffect(() => {
    const startedAt = performance.now();

    const finishInitial = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, MIN_INITIAL_MS - elapsed);
      scheduleHide(reducedMotion ? Math.min(wait, 200) : wait);
    };

    if (document.readyState === "complete") {
      finishInitial();
    } else {
      window.addEventListener("load", finishInitial, { once: true });
    }

    return () => {
      window.removeEventListener("load", finishInitial);
      clearHideTimer();
    };
  }, [clearHideTimer, reducedMotion, scheduleHide]);

  useEffect(() => {
    if (isFirstPathname.current) {
      isFirstPathname.current = false;
      return;
    }

    setVisible(true);
    const startedAt = performance.now();

    const finishRoute = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, MIN_ROUTE_MS - elapsed);
      scheduleHide(reducedMotion ? Math.min(wait, 150) : wait);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(finishRoute);
    });

    return clearHideTimer;
  }, [pathname, clearHideTimer, reducedMotion, scheduleHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loading"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label={label}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page"
          initial={reducedMotion ? false : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: FADE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex w-[min(88vw,280px)] flex-col items-center">
            <div className="h-[min(52vw,220px)] w-full">
              <DotLottieReact src={animation} loop autoplay />
            </div>
            <p className="mt-2 text-sm font-medium tracking-[0.2em] text-brand/70 uppercase">
              {label}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
