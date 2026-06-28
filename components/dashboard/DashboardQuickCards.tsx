"use client";

import { FileText, Home, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DASHBOARD_VIEW_PATHS } from "@/lib/dashboard/navigation";
import type { DashboardStats } from "@/lib/dashboard/stats";
import { cn } from "@/lib/utils";

type DashboardQuickCardsProps = {
  stats: DashboardStats;
};

const cards = [
  {
    view: "home" as const,
    icon: Home,
    labelKey: "cardHome",
    valueKey: "cardHomeValue",
    accent: "bg-dashboard-gulf-light text-dashboard-gulf",
  },
  {
    view: "about" as const,
    icon: FileText,
    labelKey: "cardAbout",
    valueKey: "cardAboutValue",
    accent: "bg-dashboard-palm-light text-dashboard-palm",
  },
  {
    view: "home" as const,
    icon: ImageIcon,
    labelKey: "cardMedia",
    valueKey: "cardMediaValue",
    accent: "bg-dashboard-dune-light text-dashboard-dune",
  },
] as const;

export function DashboardQuickCards({ stats }: DashboardQuickCardsProps) {
  const t = useTranslations("dashboard");

  const values = [
    t("cardHomeValue", { sections: stats.homeSections, products: stats.homeProducts }),
    t("cardAboutValue", { products: stats.aboutProducts }),
    t("cardMediaValue", { count: stats.mediaFields }),
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.labelKey}
            href={DASHBOARD_VIEW_PATHS[card.view]}
            className="rounded-[22px] border border-border/70 bg-dashboard-surface p-4 text-start shadow-dashboard transition-transform hover:-translate-y-0.5 hover:shadow-dashboard-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-dashboard-ink-muted">{t(card.labelKey)}</p>
                <p className="mt-2 text-sm font-semibold text-dashboard-ink">{values[index]}</p>
              </div>
              <div className={cn("grid h-10 w-10 place-items-center rounded-2xl", card.accent)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
