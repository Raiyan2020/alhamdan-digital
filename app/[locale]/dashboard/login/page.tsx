import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { AdminLoginHero } from "@/components/auth/AdminLoginHero";
import { AdminLoginMobileVisual } from "@/components/auth/AdminLoginMobileVisual";
import { ThemeToggle } from "@/components/theme";
import { getHomeContent } from "@/lib/i18n/home-content";

export const metadata: Metadata = {
  title: "Admin Sign In | Al Hamdan Digital",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const { header, loading } = await getHomeContent();

  return (
    <div className="dashboard-layout min-h-screen">
      <div className="flex w-full flex-1 flex-col">
        <div className="flex justify-end p-4 lg:absolute lg:end-4 lg:top-4">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 lg:px-16">
          <div className="w-full max-w-md">
            <AdminLoginMobileVisual
              logoSrc={header.logo}
              logoAlt={header.logoAlt}
              animationSrc={loading.animation}
            />

            <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted" />}>
              <AdminLoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      <AdminLoginHero
        logoSrc={header.logo}
        logoAlt={header.logoAlt}
        animationSrc={loading.animation}
      />
    </div>
  );
}
