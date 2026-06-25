"use client";

import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LocalizedProjectPage } from "@/lib/cms/project-detail";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { Link } from "@/i18n/navigation";
import { AboutFeaturePills } from "@/components/about/AboutFeaturePills";
import { AboutStoreButtons } from "@/components/about/AboutStoreButtons";

type ProjectPageViewProps = {
  project: LocalizedProjectPage;
};

export function ProjectPageView({ project }: ProjectPageViewProps) {
  const t = useTranslations("projects");

  return (
    <div className="min-h-screen bg-page text-ink">
      <div className="border-b border-border-soft bg-card-surface/80">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-5 sm:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToProducts")}
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#03396c] via-[#006ab4] to-[#00bcf5] px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-white/75">{project.number}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
                {project.tagline}
              </p>
            ) : null}
            <RichTextHtml
              html={project.body}
              className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base [&_p]:mb-3"
            />
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[32px] bg-white/10 shadow-2xl">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.imageAlt || project.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            ) : null}
          </div>
        </div>
      </section>

      {project.stats.length > 0 ? (
        <section className="border-b border-border-soft bg-card-surface">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {project.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-3xl border border-border-soft bg-page px-5 py-6 text-center shadow-sm"
              >
                <p className="text-3xl font-semibold text-brand">{stat.value}</p>
                <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.overview ? (
        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t("overviewTitle")}</h2>
          <RichTextHtml
            html={project.overview}
            className="prose prose-lg mt-6 max-w-none text-ink-secondary [&_p]:mb-4"
          />
        </section>
      ) : null}

      {project.highlights.length > 0 ? (
        <section className="bg-card-surface/60 px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">{t("highlightsTitle")}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {project.highlights.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-border-soft bg-page p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {project.gallery.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t("galleryTitle")}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {project.gallery.map((item) => (
              <figure key={item.id} className="overflow-hidden rounded-3xl border border-border-soft bg-card-surface">
                <div className="relative aspect-[16/10]">
                  <Image src={item.image} alt={item.imageAlt || item.caption || project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                {item.caption ? (
                  <figcaption className="px-5 py-4 text-sm text-ink-muted">{item.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-border-soft bg-page px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">{project.offersLabel}</h2>
            <div className="mt-5">
              <AboutFeaturePills items={project.offers} columns={2} itemKeyPrefix={`${project.id}-offer`} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{project.audienceLabel}</h2>
            <div className="mt-5">
              <AboutFeaturePills items={project.audience} columns={2} itemKeyPrefix={`${project.id}-audience`} />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl rounded-[28px] border border-border-soft bg-card-surface p-6 sm:p-8">
          <h2 className="text-xl font-bold text-brand sm:text-2xl">{project.downloadTitle}</h2>
          <div className="mt-5">
            <AboutStoreButtons buttons={project.storeButtons} />
          </div>
          {project.detailCtaHref ? (
            <a
              href={project.detailCtaHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-on hover:bg-brand/90"
            >
              {project.detailCtaLabel || t("externalCta")}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </section>
    </div>
  );
}
