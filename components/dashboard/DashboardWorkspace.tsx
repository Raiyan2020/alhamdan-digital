"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { BlogManager } from "@/components/cms/BlogManager";
import { AboutCmsForm } from "@/components/cms/AboutCmsForm";
import { HomeCmsForm } from "@/components/cms/HomeCmsForm";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useLogoutAdminMutation } from "@/hooks/use-auth-mutations";
import { useDashboardUrl } from "@/hooks/use-dashboard-url";
import { getDashboardStats } from "@/lib/dashboard/stats";
import type { CmsAboutPayload, CmsHomePayload } from "@/lib/cms/types";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardQuickCards } from "./DashboardQuickCards";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardWelcome } from "./DashboardWelcome";
import type { DashboardView } from "./types";

type DashboardWorkspaceProps = {
  brandName: string;
  logoSrc: string;
  logoAlt: string;
  adminName: string;
  adminEmail: string;
  homePayload: CmsHomePayload;
  aboutPayload: CmsAboutPayload;
};

function matchesSearch(query: string, labels: string[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return labels.some((label) => label.toLowerCase().includes(normalized));
}

export function DashboardWorkspace({
  brandName,
  logoSrc,
  logoAlt,
  adminName,
  adminEmail,
  homePayload,
  aboutPayload,
}: DashboardWorkspaceProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const logoutMutation = useLogoutAdminMutation();
  const { view: activeView, setView } = useDashboardUrl();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const stats = useMemo(
    () => getDashboardStats(homePayload, aboutPayload),
    [homePayload, aboutPayload],
  );

  const navLabels = useMemo(
    () => [t("navOverview"), t("navHome"), t("navAbout"), t("navBlog"), t("navSettings"), t("navLogout")],
    [t],
  );

  const filteredView = useMemo(() => {
    if (matchesSearch(searchQuery, navLabels)) return activeView;
    if (matchesSearch(searchQuery, [t("navHome")])) return "home";
    if (matchesSearch(searchQuery, [t("navAbout")])) return "about";
    if (matchesSearch(searchQuery, [t("navBlog")])) return "blog";
    return activeView;
  }, [activeView, navLabels, searchQuery, t]);

  const handleNavigate = (view: DashboardView) => {
    setView(view);
    setMobileNavOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/dashboard/login");
        router.refresh();
      },
    });
  };

  const sidebar = (
    <DashboardSidebar
      brandName={brandName}
      logoSrc={logoSrc}
      logoAlt={logoAlt}
      activeView={activeView}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      isLoggingOut={logoutMutation.isPending}
    />
  );

  return (
    <div className="dashboard-layout">
      <div className="hidden shrink-0 lg:block">{sidebar}</div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          adminName={adminName}
          adminEmail={adminEmail}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <div className="flex flex-1 gap-8 p-5 sm:p-8 xl:gap-10 xl:p-10">
          <div className="min-w-0 flex-1 space-y-8">
            {filteredView === "overview" ? (
              <>
                <DashboardWelcome />
                <DashboardQuickCards stats={stats} onNavigate={handleNavigate} />
                <section className="rounded-[24px] border border-border/70 bg-dashboard-surface p-5 shadow-dashboard">
                  <h3 className="text-lg font-semibold text-dashboard-ink">{t("continueEditing")}</h3>
                  <p className="mt-1 text-sm text-dashboard-ink-muted">{t("continueEditingBody")}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleNavigate("home")}
                      className="rounded-full bg-dashboard-gulf px-5 py-2.5 text-sm font-medium text-brand-on shadow-dashboard"
                    >
                      {t("openHomeCms")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate("about")}
                      className="rounded-full border border-border bg-dashboard-surface px-5 py-2.5 text-sm font-medium text-dashboard-ink shadow-dashboard"
                    >
                      {t("openAboutCms")}
                    </button>
                  </div>
                </section>
              </>
            ) : null}

            {filteredView === "home" ? (
              <HomeCmsForm initialValue={homePayload} embedded />
            ) : null}

            {filteredView === "about" ? (
              <AboutCmsForm initialValue={aboutPayload} embedded />
            ) : null}

            {filteredView === "blog" ? <BlogManager embedded /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
