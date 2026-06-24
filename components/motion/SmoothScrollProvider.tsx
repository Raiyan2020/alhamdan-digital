"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { SCROLL_HEADER_OFFSET } from "@/lib/scroll/constants";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import "lenis/dist/lenis.css";

type SmoothScrollContextValue = {
  scrollToTop: () => void;
  scrollToId: (id: string) => void;
  scrollToHash: (href: string) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

function fallbackScrollToId(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_HEADER_OFFSET;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}

function isHomePath(pathname: string) {
  if (pathname === "/") return true;
  if (typeof window === "undefined") return false;
  return /^\/(?:ar|en)\/?$/.test(window.location.pathname);
}

function localizedHomeHash(locale: string, hash: string) {
  return locale === "ar" ? `/#${hash}` : `/${locale}/#${hash}`;
}

export function useSmoothScroll(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  if (ctx) return ctx;

  return {
    scrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    scrollToId: (id) => fallbackScrollToId(id, true),
    scrollToHash: (href) => {
      const hash = href.split("#").pop();
      if (hash) fallbackScrollToId(hash, true);
    },
  };
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = lenisRef.current;
    const duration = reducedMotionRef.current ? 0 : 1.15;

    if (lenis) {
      lenis.scrollTo(el, { offset: -SCROLL_HEADER_OFFSET, duration });
      return;
    }

    fallbackScrollToId(id, !reducedMotionRef.current);
  }, []);

  const scrollToTop = useCallback(() => {
    const lenis = lenisRef.current;
    const duration = reducedMotionRef.current ? 0 : 1.4;

    if (lenis) {
      lenis.scrollTo(0, { duration });
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: reducedMotionRef.current ? "auto" : "smooth",
    });
  }, []);

  const scrollToHash = useCallback(
    (href: string) => {
      const hash = href.split("#").pop();
      if (!hash) return;

      const onHome = isHomePath(pathname);
      if (!onHome) {
        router.push(localizedHomeHash(locale, hash));
        return;
      }

      const target = document.getElementById(hash);
      if (!target) {
        router.push(localizedHomeHash(locale, hash));
        return;
      }

      scrollToId(hash);
      window.history.replaceState(null, "", `#${hash}`);
    },
    [locale, pathname, router, scrollToId]
  );

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: {
        offset: -SCROLL_HEADER_OFFSET,
        duration: 1.15,
      },
    });

    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const firstTimer = window.setTimeout(() => scrollToId(hash), 120);
    const secondTimer = window.setTimeout(() => scrollToId(hash), 420);
    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
    };
  }, [pathname, scrollToId]);

  const value: SmoothScrollContextValue = {
    scrollToTop,
    scrollToId,
    scrollToHash,
  };

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
