"use client";

import { motion } from "motion/react";
import type { LocalizedAboutContent } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import {
  ABOUT_DESKTOP_LAYOUT,
  getAboutProductContentLeft,
  getAboutProductTop,
} from "./aboutLayout";
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
  const imageOnLeft = product.imageSide === "left";

  if (layout === "desktop") {
    const top = getAboutProductTop(index);
    const { image, contentTop } = ABOUT_DESKTOP_LAYOUT;
    const contentLeft = getAboutProductContentLeft(imageOnLeft);

    return (
      <motion.section
        className="absolute left-0 w-[1440px]"
        style={{ top, minHeight: ABOUT_DESKTOP_LAYOUT.productSectionHeight }}
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
          className="absolute"
          frameClassName={IMAGE_FRAME_CLASS}
          style={
            imageOnLeft
              ? { left: image.left, top: image.topLeft, width: image.width }
              : { left: image.right, top: image.topRight, width: image.width }
          }
        />
        <div
          data-ar
          className="absolute text-center"
          style={{
            top: contentTop,
            left: contentLeft,
            width: ABOUT_DESKTOP_LAYOUT.contentWidth,
          }}
        >
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
        data-ar
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
