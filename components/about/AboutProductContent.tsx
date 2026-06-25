"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Reveal, Stagger, WordRevealText, richTextToPlainText } from "@/components/motion";
import { RichTextHtml } from "@/lib/cms/rich-text";
import type { LocalizedAboutContent } from "@/lib/cms/types";
import { Link } from "@/i18n/navigation";
import { AboutFeaturePills } from "./AboutFeaturePills";
import { AboutStoreButtons } from "./AboutStoreButtons";
import { cn } from "@/lib/utils";

type AboutProduct = LocalizedAboutContent["products"][number];

type AboutProductContentProps = {
  product: AboutProduct;
  desktop?: boolean;
};

export function AboutProductContent({ product, desktop = false }: AboutProductContentProps) {
  const t = useTranslations("projects");
  const numberClass = desktop
    ? "text-[40px] font-medium leading-[56px] text-brand"
    : "text-3xl font-medium leading-tight text-brand";
  const titleClass = desktop
    ? "text-[48px] font-semibold leading-[68px] text-ink"
    : "text-3xl font-semibold leading-tight text-ink";
  const bodyClass = desktop
    ? "text-[24px] font-medium leading-9 text-ink-secondary"
    : "text-lg leading-8 text-ink-secondary";
  const labelClass = desktop ? "text-[28px] font-medium text-ink" : "text-2xl font-medium text-ink";
  const downloadClass = desktop
    ? "text-[24px] font-bold text-brand"
    : "text-xl font-bold text-brand";

  return (
    <Stagger
      className={cn("text-center", desktop ? "mx-auto w-[628px]" : "w-full")}
      staggerMs={90}
      variant="fade-up"
      delayChildrenMs={40}
    >
      <motion.p className={numberClass}>{product.number}</motion.p>
      <motion.h2 className={cn(titleClass, desktop ? "mt-4" : "mt-3")}>{product.title}</motion.h2>
      <motion.div className={desktop ? "mt-8" : "mt-5"}>
        <RichTextHtml html={product.body} className={bodyClass} />
      </motion.div>
      {product.projectHref ? (
        <motion.div className={desktop ? "mt-8" : "mt-6"}>
          <Link
            href={product.projectHref}
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            {t("exploreProject")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : null}
      <motion.h3 className={cn(labelClass, desktop ? "mt-9" : "mt-7")}>{product.offersLabel}</motion.h3>
      <motion.div className={desktop ? "mt-6" : "mt-4"}>
        <AboutFeaturePills items={product.offers} columns={4} itemKeyPrefix={`${product.id}-offer`} />
      </motion.div>
      <motion.h3 className={cn(labelClass, desktop ? "mt-8" : "mt-7")}>{product.audienceLabel}</motion.h3>
      <motion.div className={desktop ? "mt-6" : "mt-4"}>
        <AboutFeaturePills items={product.audience} columns={3} itemKeyPrefix={`${product.id}-audience`} />
      </motion.div>
      <motion.h3 className={cn(downloadClass, desktop ? "mt-8" : "mt-7")}>{product.downloadTitle}</motion.h3>
      <motion.div className={desktop ? "mt-5" : "mt-4"}>
        <AboutStoreButtons
          buttons={product.storeButtons}
          className="justify-center"
        />
      </motion.div>
    </Stagger>
  );
}

type AboutHeroProps = {
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
  desktop?: boolean;
};

export function AboutHero({ title, body, cta, ctaHref, desktop = false }: AboutHeroProps) {
  const plainBody = useMemo(() => richTextToPlainText(body), [body]);
  const titleWordCount = title.trim().split(/\s+/).filter(Boolean).length;
  const bodyWordCount = plainBody.split(/\s+/).filter(Boolean).length;
  const bodyStartDelayMs = titleWordCount > 0 ? titleWordCount * 120 + 280 : 0;
  const ctaDelayMs =
    bodyStartDelayMs + (bodyWordCount > 0 ? bodyWordCount * 120 + 280 : 0);

  const content = (
    <div className="text-center">
      <WordRevealText
        as="h1"
        text={title}
        className={
          desktop
            ? "text-[56px] font-medium leading-[72px] text-ink"
            : "text-4xl font-medium leading-tight text-ink"
        }
      />
      <div className={desktop ? "mx-auto mt-8 w-[922px]" : "mx-auto mt-6 max-w-3xl"}>
        <WordRevealText
          text={plainBody}
          startDelayMs={bodyStartDelayMs}
          className={
            desktop
              ? "text-[28px] font-medium leading-[42px] text-ink-muted"
              : "text-lg leading-9 text-ink-neutral"
          }
        />
      </div>
      <Reveal variant="fade-up" immediate delay={ctaDelayMs} className="mt-8">
        <Link
          href={ctaHref}
          className={
            desktop
              ? "inline-flex h-[76px] items-center rounded-2xl bg-brand px-10 text-[24px] leading-9 text-white"
              : "inline-flex h-14 items-center rounded-2xl bg-brand px-8 text-lg text-white"
          }
        >
          {cta}
        </Link>
      </Reveal>
    </div>
  );

  if (desktop) {
    return <section className="absolute left-20 top-[274px] h-[338px] w-[1280px]">{content}</section>;
  }

  return <section className="px-5 py-14">{content}</section>;
}
