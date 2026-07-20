"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { LocalizedProjectPage } from "@/lib/cms/project-detail";
import { ProjectsFloatingActions, CardStat, track } from "./ProjectConversionWidgets";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { AppDownloadQr } from "./AppDownloadQr";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199a1 1 0 010 1.732l-2.26 1.305L13.135 12l2.303-2.305 2.26 1.813zM5.864 3.658L16.8 9.99l-2.302 2.302-8.635-8.634z" />
    </svg>
  );
}

function ProjectStoreBadges({ project }: { project: LocalizedProjectPage }) {
  const buttons = (project.storeButtons || []).filter(
    (b) => b.platform === "app-store" || b.platform === "google-play"
  );
  if (!buttons.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2" dir="ltr">
      {buttons.map((btn) => {
        const hasLink = btn.href && btn.href !== "#";
        const badge = (
          <span
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-[#1c1c1e] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-all duration-150 hover:brightness-125 hover:scale-105"
            style={{ background: btn.platform === "app-store" ? "#1c1c1e" : "#01073d" }}
          >
            {btn.platform === "app-store" ? <AppleIcon /> : <GooglePlayIcon />}
            <span className="leading-none">{btn.label}</span>
          </span>
        );

        if (!hasLink) {
          return (
            <div key={btn.id} className="opacity-40 cursor-not-allowed">
              {badge}
            </div>
          );
        }

        return (
          <a
            key={btn.id}
            href={btn.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={btn.label}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(btn.href, "_blank"); }}
          >
            {badge}
          </a>
        );
      })}
    </div>
  );
}

export function ProjectsIndexView({ projects }: { projects: LocalizedProjectPage[] }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const [category, setCategory] = useState("all");
  const categories = Array.from(new Set(projects.map((project) => project.category)));
  const visibleProjects = category === "all" ? projects : projects.filter((project) => project.category === category);
  useEffect(() => track("projects_index_view"), []);
  return (
    <main className="min-h-screen bg-page text-ink">
      <section className="bg-gradient-to-br from-[#03396c] via-[#006ab4] to-[#00bcf5] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-white/70">Al Hamdan Digital</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">{t("indexTitle")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{t("indexBody")}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {categories.length > 1 ? <div className="mb-8 flex flex-wrap gap-2"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className="rounded-full border border-border-soft px-4 py-2 text-sm aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-on">{t("allProjects")}</button>{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className="rounded-full border border-border-soft px-4 py-2 text-sm aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-on">{t(`categories.${item}`)}</button>)}</div> : null}
        {projects.length === 0 ? <p className="text-ink-muted">{t("empty")}</p> : (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} onClick={() => track("project_card_click", { project: project.slug })} className="group overflow-hidden rounded-lg border border-border-soft bg-card-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/9] bg-brand/10"><ImageWithFallback src={project.projectCardImage || project.image} alt={project.imageAlt || project.title} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 50vw" />{project.featuredInProjects ? <span className="absolute start-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-on">{t("featured")}</span> : null}</div>
                <div className="p-6"><p className="text-sm text-brand">{project.number}</p><h2 className="mt-2 text-2xl font-semibold">{project.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-7 text-ink-muted">{project.projectCardDescription || project.tagline || project.body.replace(/<[^>]+>/g, " ")}</p>
                  {project.stats && project.stats.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {project.stats.slice(0, 2).map((stat) => (
                        <CardStat key={stat.id} value={stat.value} label={stat.label} />
                      ))}
                    </div>
                  ) : null}
                  <ProjectStoreBadges project={project} />
                  <AppDownloadQr buttons={project.storeButtons} variant="compact" className="mt-4" />
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">{t("exploreProject")} <Arrow className="h-4 w-4 transition group-hover:translate-x-1" /></span></div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <ProjectsFloatingActions projects={projects} />
    </main>
  );
}
