"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LocalizedHomeContent } from "@/lib/cms/types";

type AppDownloadLink = LocalizedHomeContent["appDownloadLinks"][number];

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 20.5v-17c0-.83 1-.99 1.49-.5l14 8.5-14 8.5c-.49.49-1.49.33-1.49-.5zM3.01 3.5L16.5 12 3.01 20.5V3.5z" />
      <path d="M13.5 12L3.01 3.5l1.5-.91L16.5 12l-12 9.41-1.5-.91L13.5 12z" />
    </svg>
  );
}

function StoreBadge({ link }: { link: AppDownloadLink }) {
  const isAppStore = link.platform === "app-store";
  const isHref = link.href && link.href !== "#";

  if (!isHref) return null;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={link.label}
      className="sticky-cta-btn group flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-all duration-200"
      style={
        isAppStore
          ? { background: "#1c1c1e", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }
          : { background: "#01073d", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
      }}
    >
      <span className="flex-shrink-0 opacity-90">
        {isAppStore ? <AppleIcon /> : <GooglePlayIcon />}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] opacity-70">
          {isAppStore ? "Download on the" : "Get it on"}
        </span>
        <span className="text-[13px] font-semibold tracking-tight">{link.label}</span>
      </div>
    </a>
  );
}

export function StickyDownloadBar({
  links,
  scrollThreshold = 320,
}: {
  links: AppDownloadLink[];
  scrollThreshold?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const ticking = useRef(false);

  // Filter to only App Store + Google Play with valid hrefs
  const activeLinks = links.filter(
    (l) => (l.platform === "app-store" || l.platform === "google-play") && l.href && l.href !== "#"
  );

  useEffect(() => {
    if (dismissed || activeLinks.length === 0) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > scrollThreshold);
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed, activeLinks.length, scrollThreshold]);

  // Retract the bar once the footer scrolls into view so it never covers the footer content.
  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const showBar = visible && !dismissed && !footerInView;

  // Publish the bar's height as a CSS variable; every floating element (WhatsApp button,
  // assistant button, assistant teaser) adds it to its own bottom offset so they all rise
  // together and keep their relative spacing.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sticky-bar-lift", showBar ? "72px" : "0px");
    return () => { root.style.removeProperty("--sticky-bar-lift"); };
  }, [showBar]);

  if (activeLinks.length === 0) return null;

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          role="complementary"
          aria-label="تحميل التطبيق"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 start-0 end-0 z-[55] flex items-center justify-between gap-3 px-4 py-3 shadow-[0_-4px_32px_rgba(0,0,0,0.22)]"
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* Label */}
          <p className="hidden text-[13px] font-medium text-[#1c1c1e] sm:block">
            حمّل التطبيق الآن
          </p>

          {/* Buttons */}
          <div className="flex flex-1 items-center justify-center gap-3 sm:flex-initial sm:justify-start">
            {activeLinks.map((link) => (
              <StoreBadge key={link.id} link={link} />
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="إغلاق"
            className="flex-shrink-0 rounded-full p-1.5 text-[#8e8e93] transition hover:bg-black/5 hover:text-[#1c1c1e]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
