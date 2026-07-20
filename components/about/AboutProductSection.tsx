"use client";

import { motion } from "motion/react";
import type { LocalizedAboutContent } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import { AboutProductContent } from "./AboutProductContent";
import { AboutProductVisual } from "./AboutProductVisual";

type AboutProduct = LocalizedAboutContent["products"][number];

type AboutProductSectionProps = {
  product: AboutProduct;
  index: number;
  layout: "desktop" | "responsive";
};

const IMAGE_FRAME_CLASS = "h-[640px] w-[520px]";

export function AboutProductSection({ product, index, layout }: AboutProductSectionProps) {
  if (layout === "desktop") {
    return (
      <motion.section
        // Auto-height grid: the section grows with its content instead of a fixed
        // height, so longer/added products can never overflow onto the next one.
        className="mx-auto grid w-[1440px] grid-cols-2 items-center gap-6 px-16 py-16"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <AboutProductVisual
          src={product.image}
          alt={product.imageAlt}
          priority={index === 0}
          animate={false}
          frameClassName={cn(IMAGE_FRAME_CLASS, "mx-auto")}
          className={product.imageSide === "right" ? "order-2" : undefined}
        />
        <div className={cn("mx-auto text-center", product.imageSide === "right" ? "order-1" : undefined)}>
          <AboutProductContent product={product} desktop />
        </div>
      </motion.section>
    );
  }

  return (
    <motion.article
      className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-2 md:items-center"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <AboutProductVisual
        src={product.image}
        alt={product.imageAlt}
        priority={index === 0}
        className={product.imageSide === "right" ? "md:order-2" : undefined}
        frameClassName="mx-auto min-h-[320px] w-full max-w-[520px]"
      />
      <div
        className={cn(
          "mx-auto w-full max-w-xl justify-self-center text-center",
          product.imageSide === "right" ? "md:order-1" : undefined,
        )}
      >
        <AboutProductContent product={product} />
      </div>
    </motion.article>
  );
}
