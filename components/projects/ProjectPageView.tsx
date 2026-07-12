"use client";

import { ArrowLeft, CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import type { LocalizedProjectPage } from "@/lib/cms/project-detail";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { Link } from "@/i18n/navigation";
import { AboutFeaturePills } from "@/components/about/AboutFeaturePills";
import { AboutStoreButtons } from "@/components/about/AboutStoreButtons";
import { AnimatedStats, ProjectFloatingActions, track } from "./ProjectConversionWidgets";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { AppDownloadQr } from "./AppDownloadQr";

type ProjectPageViewProps = {
  project: LocalizedProjectPage;
};

export function ProjectPageView({ project }: ProjectPageViewProps) {
  const t = useTranslations("projects");
  const hasLaunchOffer = project.visibility.launchOffer && Boolean(project.launchOffer);
  const hasComparison = project.visibility.comparison && project.comparisonRows.length > 0;
  useEffect(() => track("project_detail_view", { project: project.slug }), [project.slug]);

  return (
    <div className="min-h-screen bg-[#f7fafc] text-ink">
      <div className="bg-page px-5 pt-5 sm:px-8 sm:pt-8">
        <div className="mx-auto flex max-w-6xl items-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-card-surface px-4 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToProducts")}
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden bg-page px-5 pb-10 pt-5 sm:px-8 sm:pb-14">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-bl from-[#032e5d] via-[#006ab4] to-[#00b8ed] px-6 py-10 text-white shadow-[0_28px_70px_rgba(3,57,108,0.22)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -end-24 -top-28 h-80 w-80 rounded-full border-[28px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 start-[38%] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-white/90">{project.number}</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
                {project.tagline}
              </p>
            ) : null}
            <RichTextHtml
              html={project.body}
              className="mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base [&_p]:mb-3"
            />
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[30px] border border-white/30 bg-white/15 p-2 shadow-2xl backdrop-blur-sm">
            {project.image ? (
              <ImageWithFallback
                src={project.image}
                alt={project.imageAlt || project.title}
                fill
                className="rounded-[22px] object-contain bg-white/95 p-5"
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            ) : null}
          </div>
          </div>
        </div>
      </section>

      {project.stats.length > 0 ? (
        <section className="px-5 pb-8 sm:px-8 sm:pb-12">
          <div className="mx-auto max-w-6xl rounded-[28px] border border-border-soft bg-card-surface px-5 py-6 shadow-sm sm:px-8 sm:py-8">
            <AnimatedStats stats={project.stats} />
          </div>
        </section>
      ) : null}

      {project.overview ? (
        <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="rounded-[28px] border border-border-soft bg-card-surface p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{project.title}</p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{t("overviewTitle")}</h2>
          <RichTextHtml
            html={project.overview}
            className="prose prose-lg mt-6 max-w-none text-ink-secondary [&_p]:mb-4"
          />
          </div>
        </section>
      ) : null}

      {project.visibility.useCase && project.useCaseStory ? <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8"><p className="rounded-[24px] border-s-4 border-brand bg-brand/[0.04] p-6 text-lg leading-9 text-ink-secondary shadow-sm sm:p-8">{project.useCaseStory}</p></section> : null}

      {hasLaunchOffer || hasComparison ? <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className={hasLaunchOffer && hasComparison ? "grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" : "grid gap-6"}>
          {hasLaunchOffer ? <div className="relative overflow-hidden rounded-[28px] bg-brand px-6 py-8 text-brand-on shadow-[0_18px_45px_rgba(3,57,108,0.20)] sm:p-10">
            <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full border-[20px] border-white/10" />
            <div className="relative">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold tracking-wide">{t("launchIncentive")}</p>
            <p className="mt-4 text-sm font-semibold opacity-75">{t("launchOfferLabel")}</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{project.launchOffer}</h2>
            {project.launchOfferTerms ? <p className="mt-4 text-sm leading-7 opacity-85">{project.launchOfferTerms}</p> : null}
            {project.launchOfferEndsAt ? <p className="mt-3 text-xs opacity-70">{t("offerEnds")}: {new Date(project.launchOfferEndsAt).toLocaleDateString()}</p> : null}
            {project.launchOfferCtaHref && project.launchOfferCtaLabel ? <a href={project.launchOfferCtaHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand">{project.launchOfferCtaLabel}</a> : null}
            </div>
          </div> : null}
          {hasComparison ? (
            <section className="overflow-hidden rounded-[28px] border border-border-soft bg-card-surface shadow-[0_18px_45px_rgba(3,57,108,0.10)]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-soft bg-gradient-to-l from-brand/[0.07] to-transparent px-5 py-6 sm:px-8 sm:py-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/70">{project.title}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t("comparisonTitle")}</h2>
                </div>
                <span className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm">VS</span>
              </div>
              <div className="grid grid-cols-2 border-b border-border-soft text-xs font-bold sm:text-sm">
                <div className="flex items-center gap-2 bg-rose-50 px-4 py-4 text-rose-700 sm:px-6 sm:py-5">
                  <XCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                  <span>{t("comparisonTraditional")}</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-4 text-emerald-700 sm:px-6 sm:py-5">
                  <CheckCircle2 className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                  <span>{t("comparisonWithApp", { app: project.title })}</span>
                </div>
              </div>
              <div className="divide-y divide-border-soft">
                {project.comparisonRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-2 text-sm sm:text-base">
                    <p className="flex min-h-16 items-center bg-rose-50/30 px-4 py-4 leading-6 text-ink-muted sm:px-6 sm:py-5">{row.traditional}</p>
                    <p className="flex min-h-16 items-center bg-emerald-50/35 px-4 py-4 font-semibold leading-6 text-emerald-800 sm:px-6 sm:py-5">{row.withApp}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section> : null}

      {project.highlights.length > 0 ? (
        <section className="px-5 py-8 sm:px-8 sm:py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">{t("highlightsTitle")}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {project.highlights.map((item) => (
                <article
                  key={item.id}
                  className="group rounded-[24px] border border-border-soft bg-card-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
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
              <figure key={item.id} className="group overflow-hidden rounded-[28px] border border-border-soft bg-card-surface shadow-sm">
                <div className="relative aspect-[16/10]">
                <ImageWithFallback src={item.image} alt={item.imageAlt || item.caption || project.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                {item.caption ? (
                  <figcaption className="px-5 py-4 text-sm text-ink-muted">{item.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {project.visibility.mockup && (project.mockupVideoUrl || project.mockupMedia) ? <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><div className="relative aspect-video overflow-hidden rounded-[28px] border-8 border-card-surface bg-[#031d3b] shadow-2xl">{project.mockupVideoUrl ? <video className="h-full w-full object-contain" controls muted playsInline preload="metadata" poster={project.mockupMedia || undefined}><source src={project.mockupVideoUrl} /></video> : <ImageWithFallback src={project.mockupMedia} alt={project.title} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 800px" />}</div></section> : null}

      {project.visibility.testimonials && project.testimonials.length > 0 ? <section className="px-5 py-12 sm:px-8"><div className="mx-auto max-w-6xl"><h2 className="text-2xl font-semibold sm:text-3xl">{t("testimonialsTitle")}</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{project.testimonials.map((item) => <blockquote key={item.id} className="rounded-[24px] border border-border-soft bg-card-surface p-6 shadow-sm"><p className="text-lg leading-8 text-ink-secondary">“{item.quote}”</p><footer className="mt-6 flex items-center gap-3 border-t border-border-soft pt-5">{item.avatar ? <ImageWithFallback src={item.avatar} width={48} height={48} alt={item.name} className="h-12 w-12 rounded-full object-cover" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 font-semibold text-brand">{item.name.slice(0, 1)}</span>}<span><strong className="block text-sm text-brand">{item.name}</strong>{item.role ? <span className="mt-1 block text-xs text-ink-muted">{item.role}</span> : null}</span></footer></blockquote>)}</div></div></section> : null}

      {project.visibility.faqs && project.faqs.length ? <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">{t("faqTitle")}</h2>
        <div className="mt-7 divide-y divide-border-soft rounded-[28px] border border-border-soft bg-card-surface px-6 shadow-sm sm:px-8">
          {project.faqs.map((faq) => <details key={faq.id} className="group py-6"><summary className="cursor-pointer list-none font-semibold marker:hidden after:ms-3 after:inline-block after:text-brand after:content-['+'] group-open:after:content-['−']">{faq.question}</summary><p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">{faq.answer}</p></details>)}
        </div>
      </section> : null}

      <section className="mt-8 bg-[#032e5d] px-5 py-12 text-white sm:px-8 sm:py-16">
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

        <div className="mx-auto mt-12 max-w-6xl rounded-[28px] bg-white p-6 text-ink shadow-2xl sm:p-10">
          <h2 className="text-xl font-bold text-brand sm:text-2xl">{project.downloadTitle}</h2>
          <div className="mt-5">
            <AboutStoreButtons buttons={project.storeButtons} size="lg" />
          </div>
          <AppDownloadQr buttons={project.storeButtons} className="mt-6" />
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
      <ProjectFloatingActions project={project} />
    </div>
  );
}
