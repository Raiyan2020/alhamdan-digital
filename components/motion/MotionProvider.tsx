"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isLowBattery } from "@/lib/motion/capability";
import { recheckAllInView } from "@/components/motion/useInViewOnce";

type MotionContextValue = {
  fastScroll: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  fastScroll: false,
});

export function useMotionContext(): MotionContextValue {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [fastScroll, setFastScroll] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        recheckAllInView();
      }
    };

    const onResize = () => {
      recheckAllInView();
    };

    const onScroll = () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaTime = now - lastScrollTime;

      if (deltaTime > 0 && deltaTime < 300) {
        const viewports = deltaY / window.innerHeight;
        if (viewports > 1.5) {
          setFastScroll(true);
          root.classList.add("motion-fast-scroll");
        }
      }

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    void isLowBattery().then((low) => {
      if (low) root.setAttribute("data-low-battery", "true");
    });

    return () => {
      root.classList.remove("motion-fast-scroll");
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ fastScroll }}>
      {children}
    </MotionContext.Provider>
  );
}
