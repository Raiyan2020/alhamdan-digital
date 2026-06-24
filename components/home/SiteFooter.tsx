"use client";

import Image from "next/image";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import type { HomeContent } from "@/lib/i18n/home-content";
import { Stagger, useSmoothScroll } from "@/components/motion";
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
          "grid shrink-0 place-items-center rounded-full bg-white/55 text-[#012561]"
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
  kuwait,
}: {
  className?: string;
  kuwait: string;
}) {
  const items = [
    { key: "phone", content: <span dir="ltr">(+20) 1212043552</span>, icon: Phone },
    { key: "mail", content: <span dir="ltr">(+20) 1212043552</span>, icon: Mail },
    { key: "location", content: <span>{kuwait}</span>, icon: MapPin },
  ] as const;

  return (
    <Stagger as="ul" {...wave} staggerMs={55} className={className}>
      {items.map(({ key, content, icon: Icon }) => (
        <motion.li key={key} className="flex items-center justify-end gap-3">
          {content}
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        </motion.li>
      ))}
    </Stagger>
  );
}

function SocialIcons({
  className,
  labels,
}: {
  className?: string;
  labels: { youtube: string; linkedin: string; instagram: string; facebook: string };
}) {
  const iconClass = "h-7 w-7 fill-none stroke-current stroke-[1.5]";

  const networks = [
    {
      key: "youtube",
      label: labels.youtube,
      icon: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path d="M22 8.5a2.5 2.5 0 0 0-1.76-1.77C18.55 6.25 12 6.25 12 6.25s-6.55 0-8.24.48A2.5 2.5 0 0 0 2 8.5 26 26 0 0 0 1.75 12 26 26 0 0 0 2 15.5a2.5 2.5 0 0 0 1.76 1.77C5.45 17.75 12 17.75 12 17.75s6.55 0 8.24-.48A2.5 2.5 0 0 0 22 15.5 26 26 0 0 0 22.25 12 26 26 0 0 0 22 8.5Z" />
          <path d="m10 15 6-3-6-3v6Z" />
        </svg>
      ),
    },
    {
      key: "linkedin",
      label: labels.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: labels.instagram,
      icon: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      key: "facebook",
      label: labels.facebook,
      icon: (
        <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <Stagger
      {...wave}
      staggerMs={50}
      staggerDirection={-1}
      className={cn("flex items-center justify-end gap-7", className)}
    >
      {networks.map(({ key, label, icon }) => (
        <motion.a
          key={key}
          href="#"
          aria-label={label}
          className={glassIconBtnCn("inline-flex rounded-full p-1.5")}
        >
          <span className="motion-glass-content">{icon}</span>
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

  return (
    <Stagger as="ul" {...wave} staggerMs={55} className={className}>
      {links.map((item) => (
        <motion.li key={item.href}>
          <Link
            href={item.href}
            onClick={(event) => {
              if (!item.href.includes("#")) return;
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
  const socialLabels = {
    youtube: footer.youtube,
    linkedin: footer.linkedin,
    instagram: footer.instagram,
    facebook: footer.facebook,
  };

  return (
    <footer
      id={sectionIds.contact}
      className={cn("w-full bg-[#012561] text-white", className)}
    >
      <div className="relative mx-auto hidden w-full max-w-[1440px] px-20 pt-14 min-[1440px]:block">
        <Stagger
          {...wave}
          staggerMs={100}
          staggerDirection={-1}
          delayChildrenMs={80}
          className="grid grid-cols-[auto_minmax(0,321px)_minmax(0,184px)_minmax(0,393px)] items-start gap-x-12"
        >
          <motion.div>
            <BackToTopButton label={footer.backToTop} className="h-20 w-20" />
          </motion.div>

          <motion.div data-ar className="text-right">
            <h3 className="text-[24px] font-semibold">{footer.contactTitle}</h3>
            <ContactList
              className="mt-8 grid gap-4 text-[20px] text-white/80"
              kuwait={footer.kuwait}
            />
            <SocialIcons className="mt-6 text-white/90" labels={socialLabels} />
          </motion.div>

          <motion.div data-ar className="text-right">
            <h3 className="text-[24px] font-semibold">{footer.quickLinks}</h3>
            <QuickLinks
              className="mt-8 grid gap-3 text-[20px] text-white/80"
              links={footerLinks}
            />
          </motion.div>

          <motion.div data-ar className="text-right">
            <Image
              src="/figma/logo-footer.webp"
              alt="Al Hamdan Digital"
              width={125}
              height={112}
              className="ml-auto h-28 w-[125px] object-contain"
            />
            <p className="mt-5 text-[20px] leading-[30px] text-white/80">
              {footer.description}
            </p>
          </motion.div>
        </Stagger>

        <Stagger {...wave} staggerMs={120} className="mt-12">
          <motion.div className="h-px w-full max-w-[1280px] bg-white/50" aria-hidden />
          <motion.p className="mx-auto mt-6 max-w-[480px] pb-10 text-center text-[18px] text-white/75">
            {footer.copyright}
          </motion.p>
        </Stagger>
      </div>

      <div className="px-5 py-10 min-[1440px]:hidden lg:px-20">
        <Stagger
          {...wave}
          staggerMs={85}
          staggerDirection={-1}
          delayChildrenMs={60}
          className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8"
        >
          <motion.div className="grid gap-10 md:grid-cols-2">
            <motion.div data-ar className="text-right md:col-span-2">
              <Image
                src="/figma/logo-footer.webp"
                alt="Al Hamdan Digital"
                width={125}
                height={112}
                className="ml-auto h-28 w-auto object-contain"
              />
              <p className="mt-5 text-lg leading-8 text-white/80">
                {footer.description}
              </p>
            </motion.div>
            <motion.div data-ar className="text-right">
              <h3 className="text-2xl font-semibold">{footer.quickLinks}</h3>
              <QuickLinks
                className="mt-6 grid gap-3 text-lg text-white/80"
                links={footerLinks}
              />
            </motion.div>
            <motion.div data-ar className="text-right">
              <h3 className="text-2xl font-semibold">{footer.contactTitle}</h3>
              <ContactList
                className="mt-6 grid gap-4 text-lg text-white/80"
                kuwait={footer.kuwait}
              />
              <SocialIcons
                className="mt-6 gap-6 text-white/90"
                labels={socialLabels}
              />
            </motion.div>
          </motion.div>

          <motion.div>
            <BackToTopButton
              label={footer.backToTop}
              className="mx-auto h-16 w-16 lg:mx-0"
              iconClassName="h-8 w-8"
            />
          </motion.div>
        </Stagger>

        <Stagger {...wave} staggerMs={100} className="mt-8 w-full border-t border-white/40 pt-6 text-center text-white/75">
          <motion.p>{footer.copyright}</motion.p>
        </Stagger>
      </div>
    </footer>
  );
}
