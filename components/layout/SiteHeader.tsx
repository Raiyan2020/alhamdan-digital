"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HeaderEntrance,
  HeaderLogo,
  MotionButton,
  MotionHeaderShell,
  useHeaderEntrance,
  useSmoothScroll,
} from "@/components/motion";
import { ThemeToggle } from "@/components/theme";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { glassBtnCn, glassIconBtnCn, glassNavLinkCn } from "@/lib/motion/glass-hover";
import { cn } from "@/lib/utils";
import { resolveImageSrc, imageFallbacks } from "@/lib/media/image-url";
import { sectionIds } from "@/components/home/data";
import type { HomeContent } from "@/lib/i18n/home-content";

const MotionNavLink = motion.create(Link);

type SiteHeaderProps = {
  layout: "desktop" | "mobile";
  navItems?: HomeContent["nav"];
  header: HomeContent["header"];
  className?: string;
};

const navHrefs = [
  { key: "home", href: `/#${sectionIds.hero}` },
  { key: "about", href: "/about" },
  { key: "products", href: "/projects" },
  { key: "services", href: `/#${sectionIds.services}` },
  { key: "why", href: `/#${sectionIds.why}` },
  { key: "blog", href: "/blogs" },
] as const;

const LOGO_ORDER = 0;
const NAV_START_ORDER = 1;
const LANG_ORDER = NAV_START_ORDER + navHrefs.length;
const THEME_ORDER = LANG_ORDER + 1;

export function SiteHeader({ layout, navItems, header, className }: SiteHeaderProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const entrance = useHeaderEntrance();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollToHash } = useSmoothScroll();

  const onHashNavClick = (href: string) => (event: MouseEvent) => {
    if (!href.includes("#")) return;
    if (pathname !== "/") {
      // Navigate to home page with hash — let browser handle scroll
      setOpen(false);
      router.push(href as Parameters<typeof router.push>[0]);
      return;
    }
    event.preventDefault();
    scrollToHash(href);
    setOpen(false);
  };

  const switchLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  };

  const isNavActive = (href: string) => {
    if (href === "/about") return pathname === "/about";
    if (href === "/blogs") {
      return pathname === "/blogs" || pathname.startsWith("/blogs/");
    }
    if (href === "/projects") return pathname === "/projects" || pathname.startsWith("/projects/");
    return pathname === "/" && href === `/#${sectionIds.hero}`;
  };

  const navLinkClass = (active: boolean, inSheet = false) =>
    glassNavLinkCn(
      active,
      cn(
        "font-[family-name:var(--font-ibm-plex-arabic)]",
        inSheet
          ? "inline-flex w-full rounded-xl px-5 py-3.5 text-[17px] leading-[1.3]"
          : "inline-flex rounded-xl px-4 py-2 text-base leading-[1.2]",
        active
          ? "!border-brand !bg-brand font-medium !text-brand-on !shadow-[0_4px_16px_rgba(1,37,97,0.28)] before:!hidden hover:!translate-y-0 hover:!bg-brand focus-visible:!translate-y-0 focus-visible:!bg-brand"
          : inSheet
            ? "font-normal text-ink/85"
            : "font-normal text-ink/80",
        inSheet && (isRtl ? "justify-start text-right" : "justify-start text-left")
      )
    );

  const headerShellClass = cn(
    "w-full items-center gap-4 rounded-2xl px-5 py-2 sm:px-8",
    isRtl
      ? "bg-[linear-gradient(270deg,var(--header-fade)_0%,var(--header-fill)_100%)]"
      : "bg-[linear-gradient(90deg,var(--header-fade)_0%,var(--header-fill)_100%)]",
    "shadow-[var(--shadow-header)] backdrop-blur-[24px]",
    layout === "desktop" &&
      "grid h-[88px] w-full grid-cols-[auto_1fr_auto] gap-[82px] px-8",
    layout === "mobile" &&
      "sticky top-0 z-50 flex min-h-[88px] justify-between min-[1440px]:hidden",
    className
  );

  const langButton = (
    <HeaderEntrance order={layout === "desktop" ? LANG_ORDER : 3}>
      <MotionButton
        onClick={switchLocale}
        data-bidi="ltr"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-medium tracking-[-0.165px] text-page shadow-[0_2px_12px_rgba(8,37,87,0.2)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        aria-label={locale === "ar" ? header.switchToEnglishLabel : header.switchToArabicLabel}
      >
        {locale === "ar" ? "En" : "Ar"}
      </MotionButton>
    </HeaderEntrance>
  );

  const themeButton = (
    <HeaderEntrance order={layout === "desktop" ? THEME_ORDER : 2}>
      <ThemeToggle />
    </HeaderEntrance>
  );

  const utilityButtons = (
    <div className="flex items-center gap-2">
      {themeButton}
      {langButton}
    </div>
  );

  const logo = (
    <HeaderEntrance order={LOGO_ORDER}>
      <HeaderLogo src={header.logo} alt={header.logoAlt} priority />
    </HeaderEntrance>
  );

  const desktopNav = (
    <nav
      dir={isRtl ? "rtl" : "ltr"}
      className="hidden items-center justify-center gap-6 min-[1440px]:flex"
    >
      {(navItems ?? navHrefs.map((item) => ({ ...item, label: t(item.key) }))).map((item, index) => (
        <MotionNavLink
          key={item.key}
          href={item.href}
          onClick={onHashNavClick(item.href)}
          className={navLinkClass(isNavActive(item.href))}
          {...entrance(NAV_START_ORDER + index)}
        >
          <span className="motion-glass-content">{item.label}</span>
        </MotionNavLink>
      ))}
    </nav>
  );

  const mobileMenu = (
    <HeaderEntrance order={1}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={glassIconBtnCn(
              "motion-header-link grid h-10 w-10 place-items-center rounded-xl border border-brand-deep/10 bg-card-surface/60 text-brand-deep shadow-sm backdrop-blur-sm min-[1440px]:hidden"
            )}
            aria-label={t("menu")}
          >
            <span className="motion-glass-content">
              <Menu className="h-5 w-5" />
            </span>
          </button>
        </SheetTrigger>
        <SheetContent
          side={isRtl ? "left" : "right"}
          showCloseButton={false}
          className={cn(
            "flex w-[min(100vw-1.5rem,380px)] flex-col gap-0 border-0 p-0",
            "bg-[linear-gradient(180deg,var(--sheet-gradient-top)_0%,var(--sheet-gradient-mid)_42%,var(--sheet-gradient-mid)_100%)]",
            "shadow-[var(--shadow-sheet)]"
          )}
        >
          <SheetTitle className="sr-only">{t("menu")}</SheetTitle>

          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="flex items-center justify-between border-b border-brand-deep/8 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <Image
                src={resolveImageSrc(header.logo, imageFallbacks.headerLogo)}
                alt={header.logoAlt || header.brandName}
                width={48}
                height={44}
                className="h-11 w-auto object-contain"
              />
              <div>
                <p className="font-[family-name:var(--font-ibm-plex-arabic)] text-sm font-medium text-brand">
                  {header.brandName}
                </p>
                <p className="text-xs text-ink/50">
                  {header.mobileSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-deep/8 text-brand-deep transition-colors hover:bg-brand-deep/12"
              aria-label={t("closeMenu")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav
            dir={isRtl ? "rtl" : "ltr"}
            className="flex flex-1 flex-col gap-1.5 p-4"
          >
            {(navItems ?? navHrefs.map((item) => ({ ...item, label: t(item.key) }))).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={onHashNavClick(item.href)}
              className={navLinkClass(isNavActive(item.href), true)}
            >
              <span className="motion-glass-content">{item.label}</span>
            </Link>
            ))}
          </nav>

          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="flex flex-col gap-3 border-t border-brand-deep/8 p-4"
          >
          <ThemeToggle variant="icon" className="w-full rounded-full" />
          <button
            type="button"
            onClick={switchLocale}
            className={glassBtnCn(
              "flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-5 py-3 text-sm font-medium text-page shadow-[0_4px_16px_rgba(8,37,87,0.25)]"
            )}
          >
            <span className="motion-glass-content" data-bidi="ltr">
              {locale === "ar" ? header.switchToEnglishLabel : header.switchToArabicLabel}
            </span>
          </button>
          </div>
        </SheetContent>
      </Sheet>
    </HeaderEntrance>
  );

  const headerContent =
    layout === "desktop" ? (
      isRtl ? (
        <>
          {logo}
          {desktopNav}
          {utilityButtons}
        </>
      ) : (
        <>
          {logo}
          {desktopNav}
          {utilityButtons}
        </>
      )
    ) : (
      <div dir="ltr" className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          {utilityButtons}
          {mobileMenu}
        </div>
        {logo}
      </div>
    );

  return (
    <MotionHeaderShell dir={isRtl ? "rtl" : "ltr"} className={headerShellClass}>
      {headerContent}
    </MotionHeaderShell>
  );
}
