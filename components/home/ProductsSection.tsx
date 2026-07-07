"use client";

import Image from "next/image";
import type { HomeContent } from "@/lib/i18n/home-content";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { MotionLinkButton, Reveal } from "@/components/motion";
import { useLocale } from "next-intl";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { cn } from "@/lib/utils";
import { sectionIds } from "./data";
import {
  CardPhoneRipples,
} from "./ProductRipples";

export type ProductItem = HomeContent["products"]["items"][number];

type ProductCardProps = {
  title: string;
  body: string;
  image: string;
  imageAlt?: string;
  layout: ProductItem["layout"];
  index?: number;
  className?: string;
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
  index = 0,
  className,
}: ProductCardProps) {
  const reducedMotion = useReducedMotion();
  const displayTitle = title === "نفس" ? "NAFAS" : title;
  // Row 0 (index 0,1): phone on right side of text. Row 1 (index 2,3): phone on left side.
  const imageOnRight = Math.floor(index / 2) % 2 === 0;

  // Phone center X position as percentage within the card
  const phoneX = imageOnRight ? 73 : 27;

  return (
    <motion.article
      className={cn(
        "group relative z-10 h-[317px] overflow-hidden rounded-[32px] bg-card-surface isolate",
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
      {/* Rings centered on the phone image */}
      <CardPhoneRipples phoneX={phoneX} phoneY={55} />

      {/* Text block */}
      <div
        className={cn(
          "absolute top-[64px] z-10 w-[210px]",
          imageOnRight ? "left-8" : "right-8"
        )}
      >
        <h3 className="text-[26px] font-bold leading-9 text-brand">{displayTitle}</h3>
        <RichTextHtml
          html={body}
          className="mt-3 text-[18px] font-medium leading-7 text-ink-tertiary"
        />
      </div>

      {/* Phone image — overflows top of card */}
      <motion.div
        className={cn(
          "absolute z-10 w-[52%]",
          imageOnRight ? "right-0 -top-4 bottom-0" : "left-0 -top-4 bottom-0"
        )}
        variants={productImageVariants}
        initial="rest"
      >
        <Image
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

function ProductsCta({ cta, href }: { cta: string; href: string }) {
  return (
    <Reveal variant="fade-up">
      <MotionLinkButton
        href={href}
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
  const { title, body, cta, ctaHref, items } = products;

  // Sort items to match design order: bohamdan, diddeed, road80, nafas
  const orderKeys = ["bohamdan", "diddeed", "road80", "nafas"];
  const sortedItems = [...items].sort((a, b) => {
    return orderKeys.indexOf(a.key) - orderKeys.indexOf(b.key);
  });

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
          {sortedItems.map(({ key, ...item }, index) => (
            <ProductCard key={key} {...item} index={index} />
          ))}
        </div>
      </div>

      {showCta ? (
        <div className="relative z-20 mt-10 flex justify-center">
          <ProductsCta cta={cta} href={ctaHref} />
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
        <ProductsCta cta={products.cta} href={products.ctaHref} />
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
        <ProductsCta cta={products.cta} href={products.ctaHref} />
      </div>
    </div>
  );
}
