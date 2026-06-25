import type { ReactNode } from "react";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getHomeContent } from "@/lib/i18n/home-content";
import { SiteHeader } from "./SiteHeader";
import { SiteLoadingOverlay } from "./SiteLoadingOverlay";

export async function SiteShell({ children }: { children: ReactNode }) {
  const { footer, footerLinks, header, loading, nav } = await getHomeContent();

  return (
    <div className="relative">
      <SiteLoadingOverlay label={loading.label} animation={loading.animation} />
      <SiteHeader layout="mobile" navItems={nav} header={header} />
      <div className="pointer-events-none absolute inset-x-0 top-10 z-50 hidden min-[1440px]:block">
        <div className="pointer-events-auto mx-auto w-full max-w-[1440px] px-20">
          <SiteHeader layout="desktop" navItems={nav} header={header} />
        </div>
      </div>
      {children}
      <SiteFooter footer={footer} footerLinks={footerLinks} />
    </div>
  );
}
