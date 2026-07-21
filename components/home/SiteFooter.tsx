"use client";

import Image from "next/image";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import type { HomeContent } from "@/lib/i18n/home-content";
import { Stagger, useSmoothScroll } from "@/components/motion";
import { RichTextHtml } from "@/lib/cms/rich-text";
import { imageFallbacks, resolveImageSrc } from "@/lib/media/image-url";
import { glassIconBtnCn, glassLinkCn } from "@/lib/motion/glass-hover";
import { cn } from "@/lib/utils";
import { sectionIds } from "./data";

type SiteFooterProps = {
  footerLinks: HomeContent["footerLinks"];
  footer: HomeContent["footer"];
  className?: string;
};

const wave = {
  variant: "footer-wave" as const,
  staggerMs: 70,
};

function BackToTopButton({
  label,
  className,
  iconClassName,
}: {
  label: string;
  className?: string;
  iconClassName?: string;
}) {
  const { scrollToTop } = useSmoothScroll();

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      className={cn(
        glassIconBtnCn(
          "grid shrink-0 place-items-center rounded-full bg-white/55 text-brand"
        ),
        className
      )}
    >
      <span className="motion-glass-content">
        <ArrowUp className={cn("h-10 w-10", iconClassName)} strokeWidth={1.75} />
      </span>
    </button>
  );
}

function ContactList({
  className,
  items,
}: {
  className?: string;
  items: HomeContent["footer"]["contactMethods"];
}) {
  const iconMap = {
    phone: Phone,
    email: Mail,
    address: MapPin,
  } as const;

  return (
    <Stagger as="ul" {...wave} staggerMs={55} className={className}>
      {items.map(({ id, type, displayValue, href }) => {
        const Icon = iconMap[type];
        const content =
          href && href !== "#" ? (
            <a href={href} dir={type === "address" ? undefined : "ltr"}>
              {displayValue}
            </a>
          ) : (
            <span dir={type === "address" ? undefined : "ltr"}>{displayValue}</span>
          );

        return (
          <motion.li key={id} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="min-w-0">{content}</span>
          </motion.li>
        );
      })}
    </Stagger>
  );
}

function SocialIcons({
  className,
  links,
}: {
  className?: string;
  links: HomeContent["footer"]["socialLinks"];
}) {
  const iconClass = "h-7 w-7 fill-none stroke-current stroke-[1.5]";

  const icons = {
    youtube: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path d="M22 8.5a2.5 2.5 0 0 0-1.76-1.77C18.55 6.25 12 6.25 12 6.25s-6.55 0-8.24.48A2.5 2.5 0 0 0 2 8.5 26 26 0 0 0 1.75 12 26 26 0 0 0 2 15.5a2.5 2.5 0 0 0 1.76 1.77C5.45 17.75 12 17.75 12 17.75s6.55 0 8.24-.48A2.5 2.5 0 0 0 22 15.5 26 26 0 0 0 22.25 12 26 26 0 0 0 22 8.5Z" />
          <path d="m10 15 6-3-6-3v6Z" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
    ),
    instagram: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),
    facebook: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
        </svg>
    ),
  } as const;

  const validLinks = links.filter((item) => item.href && item.href !== "#" && item.href.trim() !== "");

  if (!validLinks.length) return null;

  return (
    <Stagger
      {...wave}
      staggerMs={50}
      staggerDirection={-1}
      className={cn("flex flex-wrap items-center gap-6", className)}
    >
      {validLinks.map((item) => (
        <motion.a
          key={item.id}
          href={item.href}
          aria-label={item.label}
          className={glassIconBtnCn("inline-flex rounded-full p-1.5")}
        >
          <span className="motion-glass-content">{icons[item.network]}</span>
        </motion.a>
      ))}
    </Stagger>
  );
}

function QuickLinks({
  className,
  links,
}: {
  className?: string;
  links: HomeContent["footerLinks"];
}) {
  const { scrollToHash } = useSmoothScroll();
  const pathname = usePathname();

  return (
    <Stagger as="ul" {...wave} staggerMs={55} className={className}>
      {links.map((item) => (
        <motion.li key={item.href}>
          <Link
            href={item.href}
            onClick={(event) => {
              if (!item.href.includes("#")) return;
              if (pathname !== "/") return;
              event.preventDefault();
              scrollToHash(item.href);
            }}
            className={glassLinkCn(false, true, "motion-nav-link inline-block rounded-md px-2 py-1")}
          >
            <span className="motion-glass-content">{item.label}</span>
          </Link>
        </motion.li>
      ))}
    </Stagger>
  );
}

export function SiteFooter({ footerLinks, footer, className }: SiteFooterProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const logoSrc = resolveImageSrc(footer.logo, imageFallbacks.footerLogo);

  return (
    <footer
      id={sectionIds.contact}
      // Hook for StickyDownloadBar — a plain "footer" selector would match the
      // <footer> bylines inside testimonial cards, which precede this in the DOM.
      data-site-footer=""
      dir={isRtl ? "rtl" : "ltr"}
      className={cn("w-full bg-brand text-white", className)}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 lg:px-20 lg:py-14">
        <Stagger
          {...wave}
          staggerMs={85}
          delayChildrenMs={60}
          className="flex flex-col gap-10 min-[1440px]:flex-row min-[1440px]:items-start min-[1440px]:justify-between min-[1440px]:gap-12"
        >
          <motion.div className="min-w-0 max-w-xl min-[1440px]:max-w-[393px] min-[1440px]:shrink-0">
            <Image
              src={logoSrc}
              alt={footer.logoAlt}
              width={125}
              height={112}
              className="h-28 w-auto max-w-[125px] object-contain"
            />
            <RichTextHtml
              html={footer.description}
              className="mt-5 text-lg leading-8 text-white/80 min-[1440px]:text-[20px] min-[1440px]:leading-[30px]"
            />
          </motion.div>

          <motion.div className="min-w-0 min-[1440px]:max-w-[184px] min-[1440px]:shrink-0">
            <h3 className="text-2xl font-semibold min-[1440px]:text-[24px]">{footer.quickLinks}</h3>
            <QuickLinks
              className="mt-6 grid gap-3 text-lg text-white/80 min-[1440px]:mt-8 min-[1440px]:text-[20px]"
              links={footerLinks}
            />
          </motion.div>

          <motion.div className="min-w-0 min-[1440px]:max-w-[321px] min-[1440px]:shrink-0">
            <h3 className="text-2xl font-semibold min-[1440px]:text-[24px]">{footer.contactTitle}</h3>
            <ContactList
              className="mt-6 grid gap-4 text-lg text-white/80 min-[1440px]:mt-8 min-[1440px]:text-[20px]"
              items={footer.contactMethods}
            />
            <SocialIcons
              className="mt-6 text-white/90"
              links={footer.socialLinks}
            />
          </motion.div>

          <motion.div className="flex justify-center min-[1440px]:shrink-0 min-[1440px]:justify-start">
            <BackToTopButton
              label={footer.backToTop}
              className="h-16 w-16 min-[1440px]:h-20 min-[1440px]:w-20"
              iconClassName="h-8 w-8 min-[1440px]:h-10 min-[1440px]:w-10"
            />
          </motion.div>
        </Stagger>

        <Stagger {...wave} staggerMs={100} className="mt-8 border-t border-white/40 pt-6 min-[1440px]:mt-12">
          <motion.p className="text-center text-sm text-white/75 min-[1440px]:pb-4 min-[1440px]:text-[18px]">
            {footer.copyright}
          </motion.p>
        </Stagger>
      </div>
    </footer>
  );
}
