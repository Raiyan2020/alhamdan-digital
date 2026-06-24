"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOTION_FAIL_OPEN_MS } from "@/lib/motion/tokens";

type InViewOnceOptions = {
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
};

const recheckCallbacks = new Set<() => void>();

export function registerRecheck(callback: () => void): () => void {
  recheckCallbacks.add(callback);
  return () => recheckCallbacks.delete(callback);
}

export function recheckAllInView(): void {
  recheckCallbacks.forEach((cb) => cb());
}

function isPastViewport(node: Element): boolean {
  const rect = node.getBoundingClientRect();
  return rect.bottom < 0 || rect.top < window.innerHeight * -0.1;
}

export function useInViewOnce({
  threshold = 0.12,
  rootMargin = "0px 0px -5% 0px",
  disabled = false,
}: InViewOnceOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [scrolledVisible, setScrolledVisible] = useState(false);
  const visibleRef = useRef(false);

  const markVisible = useCallback(() => {
    if (visibleRef.current) return;
    visibleRef.current = true;
    setScrolledVisible(true);
  }, []);

  const visible = disabled || scrolledVisible;

  const recheck = useCallback(() => {
    const node = ref.current;
    if (!node || visibleRef.current || disabled) return;
    if (isPastViewport(node)) {
      markVisible();
    }
  }, [disabled, markVisible]);

  useEffect(() => {
    if (disabled) return;

    const node = ref.current;
    if (!node) return;

    if (isPastViewport(node)) {
      markVisible();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      markVisible();
      return;
    }

    const fallback = window.setTimeout(markVisible, MOTION_FAIL_OPEN_MS);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          markVisible();
          observer.disconnect();
          window.clearTimeout(fallback);
        }
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(node);
    const unregister = registerRecheck(recheck);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      unregister();
    };
  }, [disabled, markVisible, recheck, rootMargin, threshold]);

  return { ref, visible };
}
