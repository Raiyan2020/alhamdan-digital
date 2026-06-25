"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  adminName: string;
  adminEmail: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenMobileNav?: () => void;
  className?: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardHeader({
  adminName,
  adminEmail,
  searchQuery,
  onSearchChange,
  onOpenMobileNav,
  className,
}: DashboardHeaderProps) {
  const t = useTranslations("dashboard");

  return (
    <header
      className={cn(
        "flex flex-wrap items-center gap-4 border-b border-border/70 bg-dashboard-surface/90 px-4 py-4 backdrop-blur-md sm:px-6",
        className,
      )}
    >
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-dashboard-surface text-dashboard-ink lg:hidden"
        aria-label={t("openMenu")}
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dashboard-ink-muted" />
        <Input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 rounded-full border-border/70 bg-dashboard-sand/50 ps-11 text-sm shadow-none"
        />
      </div>

      <div className="ms-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-dashboard-surface text-dashboard-ink-muted transition-colors hover:text-dashboard-ink"
          aria-label={t("notifications")}
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <div className="flex items-center gap-3 rounded-full border border-border bg-dashboard-surface py-1.5 ps-1.5 pe-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-semibold text-brand-on">
            {getInitials(adminName)}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-dashboard-ink">{adminName}</p>
            <p className="truncate text-xs text-dashboard-ink-muted">{adminEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
