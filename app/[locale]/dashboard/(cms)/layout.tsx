import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAdminSession } from "@/lib/auth/session";
import { getHomeContent } from "@/lib/i18n/home-content";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";

export default async function DashboardCmsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const session = await getAdminSession();
  if (!session) {
    redirect("/dashboard/login");
  }

  const { header } = await getHomeContent();

  return (
    <DashboardFrame
      brandName={header.brandName}
      logoSrc={header.logo}
      logoAlt={header.logoAlt}
      adminName={session.name}
      adminEmail={session.email}
    >
      {children}
    </DashboardFrame>
  );
}
