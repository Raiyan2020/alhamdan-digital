import type { Locale } from "@/i18n/routing";
import { Suspense } from "react";
import { getCmsAboutPayload, getCmsHomePayload } from "@/lib/cms/service";
import { getHomeContent } from "@/lib/i18n/home-content";
import { getAdminSession } from "@/lib/auth/session";
import { DashboardWorkspace } from "@/components/dashboard/DashboardWorkspace";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function ContentDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [homePayload, aboutPayload, { header }, session] = await Promise.all([
    getCmsHomePayload(),
    getCmsAboutPayload(),
    getHomeContent(),
    getAdminSession(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-dashboard-canvas" />}>
      <DashboardWorkspace
        brandName={header.brandName}
        logoSrc={header.logo}
        logoAlt={header.logoAlt}
        adminName={session?.name ?? "Admin"}
        adminEmail={session?.email ?? ""}
        homePayload={homePayload}
        aboutPayload={aboutPayload}
      />
    </Suspense>
  );
}
