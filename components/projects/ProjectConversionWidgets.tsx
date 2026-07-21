"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/components/motion";
import { useInViewOnce } from "@/components/motion/useInViewOnce";
import type { LocalizedProjectPage } from "@/lib/cms/project-detail";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function track(name: string, detail: Record<string, string> = {}) {
  const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, unknown>>; gtag?: (...args: unknown[]) => void };
  analyticsWindow.dataLayer?.push({ event: name, ...detail });
  analyticsWindow.gtag?.("event", name, detail);
  window.dispatchEvent(new CustomEvent("alhamdan:analytics", { detail: { name, ...detail } }));
}

// Full literal class strings so Tailwind's scanner picks them up; keyed by stat count
// so the row always fills the container instead of leaving empty grid tracks.
const STATS_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function AnimatedStats({ stats }: { stats: LocalizedProjectPage["stats"] }) {
  const columns = STATS_COLUMNS[Math.min(stats.length, 4)] ?? STATS_COLUMNS[4];
  return <div className={cn("grid gap-4", columns)}>{stats.map((stat) => <AnimatedStat key={stat.id} {...stat} />)}</div>;
}

function AnimatedStat({ value, label, description }: { value: string; label: string; description?: string }) {
  const reducedMotion = useReducedMotion();
  const { ref, visible } = useInViewOnce({ disabled: Boolean(reducedMotion) });
  const parsed = useMemo(() => {
    const match = value.match(/\d[\d,]*(?:\.\d+)?/);
    return match ? { raw: match[0], target: Number(match[0].replace(/,/g, "")), decimals: match[0].split(".")[1]?.length ?? 0 } : null;
  }, [value]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!parsed || !visible || reducedMotion) return;
    const started = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => { const next = Math.min(1, (now - started) / duration); setProgress(next); if (next < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [parsed, reducedMotion, visible]);
  const displayed = !parsed ? value : value.replace(parsed.raw, (parsed.target * (reducedMotion ? 1 : progress)).toLocaleString(undefined, { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals }));
  return (
    <div ref={(node) => { ref.current = node; }} className="rounded-lg border border-border-soft bg-page px-5 py-6 text-center shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-3xl font-semibold text-brand">{displayed}</p>
        <p className="mt-2 text-sm text-ink-muted font-medium">{label}</p>
      </div>
      {description ? (
        <p className="mt-3 text-xs leading-5 text-ink-muted/80 border-t border-border-soft/60 pt-2.5">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function CardStat({ value, label }: { value: string; label: string }) {
  const reducedMotion = useReducedMotion();
  const { ref, visible } = useInViewOnce({ disabled: Boolean(reducedMotion) });
  const parsed = useMemo(() => {
    const match = value.match(/\d[\d,]*(?:\.\d+)?/);
    return match ? { raw: match[0], target: Number(match[0].replace(/,/g, "")), decimals: match[0].split(".")[1]?.length ?? 0 } : null;
  }, [value]);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!parsed || !visible || reducedMotion) return;
    const started = performance.now();
    const duration = 1200;
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(1, (now - started) / duration);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [parsed, reducedMotion, visible]);

  const displayed = !parsed
    ? value
    : value.replace(
        parsed.raw,
        (parsed.target * (reducedMotion ? 1 : progress)).toLocaleString(undefined, {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
        })
      );

  return (
    <div ref={(node) => { ref.current = node; }} className="flex flex-col">
      <span className="text-[16px] font-bold text-brand leading-none">{displayed}</span>
      <span className="text-[10px] text-ink-muted font-medium mt-0.5">{label}</span>
    </div>
  );
}

export function ProjectQuiz({ projects }: { projects: LocalizedProjectPage[] }) {
  const t = useTranslations("projects");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const categories = Array.from(new Set(projects.map((project) => project.category)));
  const selected = projects.find((project) => project.category === category && project.featuredInProjects) ?? projects.find((project) => project.category === category);
  const goals = ["discover", "download", "support"] as const;
  return <section className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-8"><h2 className="text-2xl font-semibold">{t("quizTitle")}</h2><p className="mt-2 text-sm text-ink-muted">{t("quizBody")}</p><div className="mt-6"><p className="mb-3 text-sm font-semibold">{t("quizQuestionOne")}</p><div className="flex flex-wrap justify-center gap-3">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setGoal(""); }} className="rounded-full border border-border-soft px-5 py-3 text-sm font-semibold transition hover:border-brand aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-brand-on">{t(`categories.${item}`)}</button>)}</div></div>{selected ? <div className="mt-6"><p className="mb-3 text-sm font-semibold">{t("quizQuestionTwo")}</p><div className="flex flex-wrap justify-center gap-3">{goals.map((item) => <button key={item} type="button" aria-pressed={goal === item} onClick={() => setGoal(item)} className="rounded-full border border-border-soft px-5 py-3 text-sm transition hover:border-brand aria-pressed:border-brand aria-pressed:text-brand">{t(`quizGoals.${item}`)}</button>)}</div></div> : null}{selected && goal ? <Link onClick={() => track("quiz_complete", { project: selected.slug, goal })} href={`/projects/${selected.slug}`} className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-on">{t("quizCta")}: {selected.title}</Link> : null}</section>;
}

export function ProjectsFloatingActions({ projects }: { projects: LocalizedProjectPage[] }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const update = () => setVisible(window.scrollY > 320); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  const stores = projects.flatMap((project) => project.storeButtons.filter((button) => button.href && button.href !== "#").map((button) => ({ ...button, project: project.title, slug: project.slug })));
  if (!stores.length) return null;
  return <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-border-soft bg-card-surface/95 px-4 py-3 shadow-2xl backdrop-blur transition-transform sm:inset-x-auto sm:bottom-4 sm:end-24 sm:max-w-[calc(100vw-7rem)] sm:rounded-lg sm:border ${visible ? "translate-y-0" : "translate-y-full sm:translate-y-[calc(100%+2rem)]"}`}><div className="flex max-w-full items-center gap-2 overflow-x-auto">{stores.map((button) => <a key={`${button.slug}-${button.id}`} href={button.href} target="_blank" rel="noreferrer" onClick={() => track("sticky_store_click", { project: button.slug, platform: button.platform })} className="shrink-0 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white"><span className="block text-[10px] text-white/65">{button.project}</span>{button.label}</a>)}</div></div>;
}

export function ProjectQr({ project }: { project: LocalizedProjectPage }) {
  const t = useTranslations("projects");
  const buttons = project.storeButtons.filter((button) => button.qrImage && button.href && button.href !== "#");
  if (!buttons.length) return null;
  return <div className="hidden gap-4 md:flex">{buttons.map((button) => <a key={button.id} href={button.href} target="_blank" rel="noreferrer" onClick={() => track("qr_click", { project: project.slug, platform: button.platform })} className="flex items-center gap-3 rounded-lg border border-border-soft bg-page p-4"><Image src={button.qrImage} width={96} height={96} alt={`${t("qrAlt")} ${button.label}`} className="rounded-lg" /><p className="text-sm font-semibold">{button.label}<span className="mt-1 block font-normal text-ink-muted">{t("qrBody")}</span></p></a>)}</div>;
}

export function ProjectFloatingActions({ project }: { project: LocalizedProjectPage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const update = () => setVisible(window.scrollY > 320); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  const stores = project.storeButtons.filter((button) => button.href && button.href !== "#");
  const hasStores = stores.length > 0;
  if (!hasStores) return null;
  return <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-border-soft bg-card-surface/95 px-4 py-3 shadow-2xl backdrop-blur transition-transform sm:inset-x-auto sm:bottom-4 sm:end-24 sm:max-w-[calc(100vw-7rem)] sm:rounded-lg sm:border ${visible ? "translate-y-0" : "translate-y-full sm:translate-y-[calc(100%+2rem)]"}`}><div className="flex items-center gap-3"><Download className="hidden h-5 w-5 text-brand sm:block" /><span className="hidden text-sm font-semibold sm:inline">{project.downloadTitle}</span><div className="flex gap-2">{stores.map((button) => <a key={button.id} href={button.href} target="_blank" rel="noreferrer" onClick={() => track("sticky_store_click", { project: project.slug, platform: button.platform })} className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white">{button.label}</a>)}</div></div></div>;
}
