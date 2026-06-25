"use client";

import Image from "next/image";
import type { HomeContent } from "@/lib/i18n/home-content";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { MotionLinkButton, Reveal } from "@/components/motion";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { cn } from "@/lib/utils";
import { sectionIds } from "./data";
import {
  getProductCardRippleVariant,
  ProductGridRipples,
  ProductRipples,
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
  const imageOnRight = layout === "text-start";

  return (
    <motion.article
      data-ar
      className={cn(
        "group relative z-10 h-[317px] overflow-hidden rounded-[32px] bg-card-surface",
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
      <ProductRipples variant={getProductCardRippleVariant(index)} />

      <div
        data-ar
        className={cn(
          "absolute top-[82px] z-10 w-[221px] text-right",
          imageOnRight ? "left-10" : "right-10"
        )}
      >
        <h3 className="text-[28px] font-bold leading-10 text-brand">{title}</h3>
        <RichTextHtml
          html={body}
          className="mt-3 text-[20px] font-medium leading-8 text-ink-tertiary"
        />
      </div>

      <motion.div
        className={cn(
          "absolute bottom-[-28px] z-10 h-[300px] w-[280px]",
          imageOnRight ? "-right-10" : "-left-10"
        )}
        variants={productImageVariants}
        initial="rest"
      >
        <Image
          src={image}
          alt={imageAlt}
          width={280}
          height={300}
          className={cn(
            "h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(1,37,97,0.12)]",
            imageOnRight ? "object-right" : "object-left"
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
    <Reveal variant="section-heading" className={cn("text-center", className)}>
      <div data-ar>
        <h2
          className={cn(
            "text-[42px] font-medium leading-[61px] tracking-[-0.02em]",
            onDark ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
        <RichTextHtml
          html={body}
          className={cn(
            "mx-auto mt-2 max-w-[710px] text-[15px] leading-[25px]",
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
}: ProductsSectionProps) {
  const { title, body, cta, ctaHref, items } = products;

  return (
    <section id={sectionIds.products} className={cn("relative", className)}>
      <ProductsHeading
        title={title}
        body={body}
        onDark
        className={headingClassName}
      />

      <div className="relative mx-auto mt-12 max-w-[1280px]">
        <ProductGridRipples className="hidden md:block" />
        <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          {items.map(({ key, ...item }, index) => (
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
    <div className="absolute left-1/2 top-[2112px] z-10 w-screen -translate-x-1/2">
      <div className="bg-brand">
        <div className="relative mx-auto w-full max-w-[1440px] overflow-visible px-20 pb-6 pt-16">
          <ProductsSection products={products} showCta={false} />
        </div>
      </div>
      <div className="flex justify-center bg-page px-20 pb-2 pt-10">
        <ProductsCta cta={products.cta} href={products.ctaHref} />
      </div>
    </div>
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
