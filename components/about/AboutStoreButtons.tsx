"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Stagger } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { LocalizedAboutContent } from "@/lib/cms/types";

type StoreButton = LocalizedAboutContent["products"][number]["storeButtons"][number];

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199a1 1 0 010 1.732l-2.26 1.305L13.135 12l2.303-2.305 2.26 1.813zM5.864 3.658L16.8 9.99l-2.302 2.302-8.635-8.634z" />
    </svg>
  );
}

export function StoreBadge({
  store,
  size = "md",
  className,
}: {
  store: StoreButton;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const isApple = store.platform === "app-store";
  const hasLink = store.href && store.href !== "#";

  const sizeClasses = {
    sm: "h-10 min-w-[130px] rounded-xl px-3 gap-2",
    md: "h-14 min-w-[160px] rounded-2xl px-4 gap-3",
    lg: "h-16 min-w-[200px] rounded-2xl px-5 gap-3.5",
  };
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };
  const preLabelSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
  };
  const labelSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const inner = (
    <span
      className={cn(
        "inline-flex items-center font-medium text-white transition-all duration-200",
        isApple ? "bg-[#1c1c1e]" : "bg-[#01073d]",
        sizeClasses[size],
        "border border-white/10 shadow-lg hover:brightness-110 hover:-translate-y-0.5 hover:shadow-xl",
        className
      )}
      style={{ borderRadius: size === "sm" ? "0.75rem" : "1rem" }}
    >
      <span className="shrink-0 opacity-90">
        {isApple ? (
          <AppleIcon className={iconSizes[size]} />
        ) : (
          <GooglePlayIcon className={iconSizes[size]} />
        )}
      </span>
      <span className="flex flex-col leading-tight text-start">
        <span className={cn("opacity-70 font-normal", preLabelSizes[size])}>
          {store.preLabel || (isApple ? "Download on the" : "Get it on")}
        </span>
        <span className={cn("font-semibold tracking-tight", labelSizes[size])}>
          {store.label}
        </span>
      </span>
    </span>
  );

  if (!hasLink) return inner;

  return (
    <Link href={store.href} target="_blank" rel="noreferrer noopener" dir="ltr">
      {inner}
    </Link>
  );
}

export function AboutStoreButtons({
  buttons,
  className,
  size = "md",
}: {
  buttons: StoreButton[];
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Stagger className={cn("flex flex-wrap gap-4", className)} staggerMs={80} variant="fade-up">
      {buttons.map((store) => (
        <motion.div key={store.id}>
          <StoreBadge store={store} size={size} />
        </motion.div>
      ))}
    </Stagger>
  );
}
