"use client";

import type { HomeContent } from "@/lib/i18n/home-content";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { MotionLinkButton, Reveal } from "@/components/motion";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { cn } from "@/lib/utils";
import { sectionIds } from "./data";
import {
  CardPhoneRipples,
} from "./ProductRipples";

import { Link } from "@/i18n/navigation";
import { CardStat } from "@/components/projects/ProjectConversionWidgets";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { AppDownloadQr } from "@/components/projects/AppDownloadQr";

export type ProductItem = HomeContent["products"]["items"][number];
type StoreButton = ProductItem["storeButtons"][number];

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199a1 1 0 010 1.732l-2.26 1.305L13.135 12l2.303-2.305 2.26 1.813zM5.864 3.658L16.8 9.99l-2.302 2.302-8.635-8.634z" />
    </svg>
  );
}

function MiniStoreBadge({ store }: { store: StoreButton }) {
  const isApple = store.platform === "app-store";
  const hasLink = store.href && store.href !== "#";

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white transition-all duration-150",
        isApple ? "bg-[#1c1c1e]" : "bg-[#01073d]",
        "border border-white/10 hover:brightness-125 hover:scale-105"
      )}
    >
      {isApple ? <AppleIcon /> : <GooglePlayIcon />}
      <span className="leading-none">{store.label}</span>
    </span>
  );

  if (!hasLink) return badge;

  return (
    <a
      href={store.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={store.label}
      onClick={(e) => e.stopPropagation()}
      dir="ltr"
    >
      {badge}
    </a>
  );
}

type ProductCardProps = {
  title: string;
  body: string;
  image: string;
  imageAlt?: string;
  layout: ProductItem["layout"];
  storeButtons?: StoreButton[];
  index?: number;
  className?: string;
  projectHref?: string | null;
  stats?: Array<{ id: string; value: string; label: string }>;
};

const productCardVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.96, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

const productImageVariants: Variants = {
  rest: { scale: 1, rotate: 0, y: 0 },
  hover: {
    scale: 1.08,
    rotate: -2,
    y: -8,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProductCard({
  title,
  body,
  image,
  imageAlt = "",
  layout,
  storeButtons = [],
  index = 0,
  className,
  projectHref,
  stats = [],
}: ProductCardProps) {
  const reducedMotion = useReducedMotion();
  const displayTitle = title === "نفس" ? "NAFAS" : title;
  // Row 0 (index 0,1): phone on right side of text. Row 1 (index 2,3): phone on left side.
  const imageOnRight = layout === "text-start";

  // Phone center X position as percentage within the card
  const phoneX = imageOnRight ? 73 : 27;

  return (
    <motion.article
      className={cn(
        "group relative z-10 h-[317px] overflow-hidden rounded-[32px] bg-card-surface isolate border border-white/5 transition-all duration-300 hover:shadow-[0_24px_48px_rgba(0,106,180,0.12)]",
        className
      )}
      initial={reducedMotion ? false : "hidden"}
      whileInView={reducedMotion ? undefined : "visible"}
      whileHover={reducedMotion ? undefined : "hover"}
      viewport={{ once: true, amount: 0.35 }}
      variants={productCardVariants}
      transition={{
        delay: index * 0.1,
        duration: 0.68,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Absolute overlay link covering the card */}
      {projectHref && (
        <Link
          href={projectHref}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={title}
        />
      )}

      {/* Rings centered on the phone image */}
      <CardPhoneRipples phoneX={phoneX} phoneY={55} />

      {/* Text block */}
      <div
        className={cn(
          "absolute top-[40px] z-20 w-[210px] pointer-events-none",
          imageOnRight ? "left-8" : "right-8"
        )}
      >
        <h3 className="text-[26px] font-bold leading-9 text-brand pointer-events-none">{displayTitle}</h3>
        <RichTextHtml
          html={body}
          className="mt-2 text-[14px] font-medium leading-5 text-ink-tertiary pointer-events-none line-clamp-2"
        />

        {/* Stats on the card */}
        {stats && stats.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 pointer-events-none">
            {stats.slice(0, 2).map((stat) => (
              <CardStat key={stat.id} value={stat.value} label={stat.label} />
            ))}
          </div>
        ) : null}

        {storeButtons && storeButtons.length > 0 ? (
          <div className="mt-3.5 flex flex-wrap gap-1.5 pointer-events-auto">
            {storeButtons.map((btn) => (
              <MiniStoreBadge key={btn.id} store={btn} />
            ))}
          </div>
        ) : null}
        {storeButtons.length > 0 ? <AppDownloadQr buttons={storeButtons} variant="compact" className="mt-3 pointer-events-auto" /> : null}
      </div>

      {/* Phone image — overflows top of card */}
      <motion.div
        className={cn(
          "absolute z-20 w-[52%] pointer-events-none",
          imageOnRight ? "right-0 -top-4 bottom-0" : "left-0 -top-4 bottom-0"
        )}
        variants={productImageVariants}
        initial="rest"
      >
        <ImageWithFallback
          src={image}
          alt={imageAlt}
          width={300}
          height={340}
          className={cn(
            "h-full w-full object-contain object-bottom drop-shadow-[0_18px_40px_rgba(1,37,97,0.18)]",
          )}
        />
      </motion.div>
    </motion.article>
  );
}

type ProductsSectionProps = {
  products: HomeContent["products"];
  className?: string;
  headingClassName?: string;
  showCta?: boolean;
  id?: string;
};

function ProductsCta({ cta }: { cta: string }) {
  return (
    <Reveal variant="fade-up">
      <MotionLinkButton
        href="/projects"
        className="inline-flex h-[76px] min-w-[220px] items-center justify-center rounded-2xl border border-white/20 bg-brand px-10 text-[24px] font-medium text-white shadow-[0_16px_48px_rgba(0,0,0,0.28)]"
      >
        {cta}
      </MotionLinkButton>
    </Reveal>
  );
}

function ProductsHeading({
  title,
  body,
  className,
  onDark = false,
}: {
  title: string;
  body: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Reveal variant="section-heading" className={cn("w-full text-center", className)}>
      <div className="flex flex-col items-center w-full">
        <h2
          className={cn(
            "w-full text-center text-[42px] font-medium leading-[61px] tracking-[-0.02em]",
            onDark ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
        <RichTextHtml
          html={body}
          className={cn(
            "mx-auto mt-2 w-full max-w-[710px] text-center text-[15px] leading-[25px]",
            onDark ? "text-white/78" : "text-ink-muted"
          )}
        />
      </div>
    </Reveal>
  );
}

export function ProductsSection({
  products,
  className,
  headingClassName,
  showCta = true,
  id,
}: ProductsSectionProps) {
  const { title, body, cta, items } = products;

  return (
    <section id={id ?? sectionIds.products} className={cn("relative", className)}>
      <ProductsHeading
        title={title}
        body={body}
        onDark
        className={headingClassName}
      />

      <div className="relative mx-auto mt-12 max-w-[1280px]">
        <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          {items.map(({ key, ...item }, index) => (
            <ProductCard key={key} {...item} index={index} />
          ))}
        </div>
      </div>

      {showCta ? (
        <div className="relative z-20 mt-10 flex justify-center">
          <ProductsCta cta={cta} />
        </div>
      ) : null}
    </section>
  );
}

export function ProductsSectionDesktop({
  products,
}: {
  products: HomeContent["products"];
}) {
  return (
    <section id={sectionIds.products} className="relative w-full bg-page pt-16 pb-24">
      <div className="relative mx-auto w-[1280px] overflow-visible">
        {/* Absolute dark blue background block ending midway behind the second row of cards */}
        <div className="absolute inset-x-0 top-0 bottom-[160px] rounded-[48px] bg-brand pointer-events-none z-0" />
        
        {/* Content wrapper */}
        <div className="relative z-10 px-16 pt-20 pb-0">
          <ProductsSection products={products} showCta={false} id="_products-inner" />
        </div>
      </div>
      <div className="flex justify-center bg-page pt-16">
        <ProductsCta cta={products.cta} />
      </div>
    </section>
  );
}

export function ProductsSectionMobile({
  products,
}: {
  products: HomeContent["products"];
}) {
  return (
    <div className="sm:mx-auto sm:max-w-7xl">
      <div className="relative mx-5 overflow-visible bg-brand pt-12 sm:px-8">
        <div className="overflow-visible rounded-t-[32px] px-5 pb-6 sm:px-0">
          <ProductsSection products={products} showCta={false} />
        </div>
      </div>
      <div className="flex justify-center px-5 pt-5 pb-3 md:py-10">
        <ProductsCta cta={products.cta} />
      </div>
    </div>
  );
}
