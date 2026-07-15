"use client";

import Image from "next/image";
import {
  Bot,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  UserRoundCog,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { imageFallbacks, resolveImageSrc } from "@/lib/media/image-url";
import { dashboardNavItemBase } from "@/lib/dashboard/classes";
import type { DashboardView } from "./types";

type DashboardSidebarProps = {
  brandName: string;
  logoSrc: string;
  logoAlt: string;
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  className?: string;
};

const overviewItems: Array<{
  view: DashboardView;
  icon: typeof LayoutDashboard;
  labelKey: "navOverview" | "navHome" | "navProducts" | "navAbout" | "navBlog" | "navAssistant";
}> = [
  { view: "overview", icon: LayoutDashboard, labelKey: "navOverview" },
  { view: "home", icon: Home, labelKey: "navHome" },
  { view: "products", icon: Package, labelKey: "navProducts" },
  { view: "about", icon: FileText, labelKey: "navAbout" },
  { view: "blog", icon: FileText, labelKey: "navBlog" },
  { view: "assistant", icon: Bot, labelKey: "navAssistant" },
];

export function DashboardSidebar({
  brandName,
  logoSrc,
  logoAlt,
  activeView,
  onNavigate,
  onLogout,
  isLoggingOut,
  className,
}: DashboardSidebarProps) {
  const t = useTranslations("dashboard");

  return (
    <aside
      className={cn(
        "flex h-full w-[248px] shrink-0 flex-col border-border/80 border-inline-end bg-dashboard-surface px-4 py-6 shadow-dashboard",
        className,
      )}
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <Image
          src={resolveImageSrc(logoSrc, imageFallbacks.headerLogo)}
          alt={logoAlt}
          width={40}
          height={36}
          className="h-9 w-auto object-contain"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-dashboard-ink">{brandName}</p>
          <p className="truncate text-xs text-dashboard-ink-muted">{t("brandTagline")}</p>
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="h-px flex-1 bg-border/80" aria-hidden />
            <span className="shrink-0 text-[10px] font-normal tracking-wide text-dashboard-ink-muted/80">
              {t("sectionOverview")}
            </span>
            <span className="h-px flex-1 bg-border/80" aria-hidden />
          </div>
          <nav className="space-y-1">
            {overviewItems.map(({ view, icon: Icon, labelKey }) => {
              const active = activeView === view;
              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => onNavigate(view)}
                  data-active={active ? "true" : undefined}
                  className={cn(
                    dashboardNavItemBase,
                    "flex items-center gap-3",
                    active && "shadow-dashboard-lg",
                  )}
                >
                  {active ? (
                    <span
                      className="absolute inset-y-2 start-1.5 w-1 rounded-full bg-brand-on/90"
                      aria-hidden
                    />
                  ) : null}
                  <Icon className={cn("h-4 w-4 shrink-0", active && "ms-1.5")} />
                  <span>{t(labelKey)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 px-2">
            <span className="h-px flex-1 bg-border/80" aria-hidden />
            <span className="shrink-0 text-[10px] font-normal tracking-wide text-dashboard-ink-muted/80">
              {t("sectionSettings")}
            </span>
            <span className="h-px flex-1 bg-border/80" aria-hidden />
          </div>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            data-active={activeView === "profile" ? "true" : undefined}
            className={cn(
              dashboardNavItemBase,
              "flex items-center gap-3",
              activeView === "profile" && "shadow-dashboard-lg",
            )}
          >
            {activeView === "profile" ? (
              <span
                className="absolute inset-y-2 start-1.5 w-1 rounded-full bg-brand-on/90"
                aria-hidden
              />
            ) : null}
            <UserRoundCog className={cn("h-4 w-4 shrink-0", activeView === "profile" && "ms-1.5")} />
            <span>{t("navSettings")}</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{isLoggingOut ? t("signingOut") : t("navLogout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
