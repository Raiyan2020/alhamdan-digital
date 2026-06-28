"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getDashboardStats } from "@/lib/dashboard/stats";
import type { CmsAboutPayload, CmsHomePayload } from "@/lib/cms/types";
import { DashboardQuickCards } from "./DashboardQuickCards";
import { DashboardWelcome } from "./DashboardWelcome";
import type { DashboardView } from "./types";

type DashboardWorkspaceProps = {
  homePayload: CmsHomePayload;
  aboutPayload: CmsAboutPayload;
};

export function DashboardWorkspace({
  homePayload,
  aboutPayload,
}: DashboardWorkspaceProps) {
  const t = useTranslations("dashboard");
  const stats = useMemo(
    () => getDashboardStats(homePayload, aboutPayload),
    [homePayload, aboutPayload],
  );

  return (
    <>
      <DashboardWelcome />
      <DashboardQuickCards stats={stats} />
      <section className="rounded-[24px] border border-border/70 bg-dashboard-surface p-5 shadow-dashboard">
        <h3 className="text-lg font-semibold text-dashboard-ink">{t("continueEditing")}</h3>
        <p className="mt-1 text-sm text-dashboard-ink-muted">{t("continueEditingBody")}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={"/dashboard/home" satisfies `/dashboard/${DashboardView}`}
            className="rounded-full bg-dashboard-gulf px-5 py-2.5 text-sm font-medium text-brand-on shadow-dashboard"
          >
            {t("openHomeCms")}
          </Link>
          <Link
            href={"/dashboard/about" satisfies `/dashboard/${DashboardView}`}
            className="rounded-full border border-border bg-dashboard-surface px-5 py-2.5 text-sm font-medium text-dashboard-ink shadow-dashboard"
          >
            {t("openAboutCms")}
          </Link>
        </div>
      </section>
    </>
  );
}
