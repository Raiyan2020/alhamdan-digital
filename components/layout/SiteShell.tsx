import type { ReactNode } from "react";
import { SiteFooter } from "@/components/home/SiteFooter";
import { getHomeContent } from "@/lib/i18n/home-content";
import { SiteHeader } from "./SiteHeader";

export async function SiteShell({ children }: { children: ReactNode }) {
  const { footer, footerLinks } = await getHomeContent();

  return (
    <div className="relative">
      <SiteHeader layout="mobile" />
      <div className="pointer-events-none absolute inset-x-0 top-10 z-50 hidden min-[1440px]:block">
        <div className="pointer-events-auto mx-auto w-full max-w-[1440px] px-20">
          <SiteHeader layout="desktop" />
        </div>
      </div>
      {children}
      <SiteFooter footer={footer} footerLinks={footerLinks} />
    </div>
  );
}
