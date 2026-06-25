"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function DashboardWelcome() {
  const t = useTranslations("dashboard");

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-dashboard-dune via-dashboard-gulf to-dashboard-palm px-6 py-8 text-brand-on shadow-dashboard-lg sm:px-8 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0, transparent 28%), radial-gradient(circle at 80% 0%, rgba(0,188,245,0.35) 0, transparent 24%)",
        }}
      />
      <div className="relative z-10 max-w-2xl">
        <p className="text-sm font-medium text-brand-on/80">{t("welcomeEyebrow")}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("welcomeTitle")}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-brand-on/85 sm:text-base">
          {t("welcomeBody")}
        </p>
        <Button
          asChild
          className="mt-6 h-11 rounded-full bg-dashboard-surface px-6 text-dashboard-gulf hover:bg-dashboard-surface/90"
        >
          <Link href="/" target="_blank" rel="noreferrer">
            {t("viewWebsite")}
            <ArrowUpRight className="ms-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
