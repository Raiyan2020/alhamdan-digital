"use client";

import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { DashboardStats } from "@/lib/dashboard/stats";

type DashboardInsightsPanelProps = {
  adminName: string;
  stats: DashboardStats;
};

export function DashboardInsightsPanel({
  adminName,
  stats,
}: DashboardInsightsPanelProps) {
  const t = useTranslations("dashboard");
  const completion = Math.min(
    100,
    Math.round(
      ((stats.homeProducts + stats.homeServices + stats.aboutProducts + stats.navLinks) /
        24) *
        100,
    ),
  );

  return (
    <aside className="space-y-5">
      <section className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <h3 className="text-sm font-semibold text-foreground">{t("statsTitle")}</h3>
        <div className="mt-5 flex items-center gap-4">
          <div
            className="relative grid h-24 w-24 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--brand) ${completion}%, color-mix(in oklab, var(--muted) 80%, transparent) 0)`,
            }}
          >
            <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-card text-sm font-semibold text-foreground">
              {completion}%
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t("greeting", { name: adminName.split(" ")[0] ?? adminName })}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("statsBody")}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <h3 className="text-sm font-semibold text-foreground">{t("quickLinksTitle")}</h3>
        <div className="mt-4 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span className="inline-flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-brand" />
              {t("linkHome")}
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/about"
            target="_blank"
            className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              {t("linkAbout")}
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
        <Button variant="outline" className="mt-4 w-full rounded-full" asChild>
          <Link href="/about" target="_blank">
            {t("seeAll")}
          </Link>
        </Button>
      </section>

      <section className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <h3 className="text-sm font-semibold text-foreground">{t("tipsTitle")}</h3>
        <ul className="mt-4 space-y-3 text-xs leading-5 text-muted-foreground">
          <li>{t("tipOne")}</li>
          <li>{t("tipTwo")}</li>
          <li>{t("tipThree")}</li>
        </ul>
      </section>
    </aside>
  );
}
