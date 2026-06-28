"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useLogoutAdminMutation } from "@/hooks/use-auth-mutations";
import { useDashboardUrl } from "@/hooks/use-dashboard-url";
import type { DashboardView } from "./types";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardFrameProps = {
  brandName: string;
  logoSrc: string;
  logoAlt: string;
  adminName: string;
  adminEmail: string;
  children: React.ReactNode;
};

export function DashboardFrame({
  brandName,
  logoSrc,
  logoAlt,
  adminName,
  adminEmail,
  children,
}: DashboardFrameProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const logoutMutation = useLogoutAdminMutation();
  const { view: activeView, setView } = useDashboardUrl();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
          <div className="min-w-0 flex-1 space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
