"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bot, Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fetchPublicChatbotItems } from "@/lib/api/chatbot";
import { queryKeys } from "@/lib/query/keys";
import type { PublicChatbotItem } from "@/lib/chatbot/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const TEASER_DELAY_MS = 1600;

export function FloatingAssistant() {
  const t = useTranslations("assistant");
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.chatbot.public(locale),
    queryFn: () => fetchPublicChatbotItems(locale),
    enabled: open,
    staleTime: 60_000,
  });

  const items = data?.items ?? [];
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: EASE };

  // Show the welcome teaser shortly after the visitor lands, once per session.
  useEffect(() => {
    if (teaserDismissed || open) return;
    const timer = setTimeout(() => setTeaserVisible(true), TEASER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [teaserDismissed, open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setTeaserVisible(false);
      setTeaserDismissed(true);
    }
  };

  const openFromTeaser = () => handleOpenChange(true);
  const dismissTeaser = () => {
    setTeaserVisible(false);
    setTeaserDismissed(true);
  };

  return (
    <>
      <AnimatePresence>
        {teaserVisible && !open ? (
          <motion.div
            key="teaser"
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
            transition={transition}
            // z-[59]: one below the trigger button, so the button stays clickable if they ever meet.
            className="fixed start-5 z-[59] w-[min(280px,calc(100vw-2rem))]"
            // Clears the h-14 button (20px offset + 56px tall) with room to spare.
            style={{ bottom: "6.5rem" }}
          >
            <div className="relative rounded-2xl rounded-es-sm border border-border/70 bg-page/95 p-3 pe-8 shadow-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label={t("closeLabel")}
                className="absolute end-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gulf"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={openFromTeaser}
                className="flex w-full items-start gap-2.5 text-start focus-visible:outline-none"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-deep to-dashboard-gulf text-brand-on">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-sm leading-relaxed text-ink">{t("welcome")}</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t("openLabel")}
            className={cn(
              "group fixed bottom-5 start-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full",
              "bg-gradient-to-br from-brand-deep to-dashboard-gulf text-brand-on shadow-xl",
              "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gulf focus-visible:ring-offset-2 focus-visible:ring-offset-page",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={transition}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={transition}
                >
                  <Bot className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
            {!open && !teaserVisible ? (
              <span
                aria-hidden
                className="absolute -end-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-dashboard-coral ring-2 ring-page motion-safe:animate-pulse"
              />
            ) : null}
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="start"
          sideOffset={16}
          collisionPadding={16}
          className={cn(
            "z-[70] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border/70 p-0",
            "bg-page/95 text-ink shadow-2xl backdrop-blur-xl",
          )}
        >
          <AssistantHeader
            title={t("headerTitle")}
            subtitle={t("headerSubtitle")}
            onClose={() => handleOpenChange(false)}
            closeLabel={t("closeLabel")}
          />

          <div
            data-lenis-prevent
            className="max-h-[min(60vh,460px)] space-y-3 overflow-y-auto overscroll-contain px-4 pb-4 pt-3"
          >
            <GreetingBubble text={t("greeting")} />

            {isLoading ? (
              <OptionsSkeleton />
            ) : isError ? (
              <ErrorState
                message={t("errorBody")}
                retryLabel={t("retryLabel")}
                onRetry={() => refetch()}
              />
            ) : items.length === 0 ? (
              <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
            ) : (
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <OptionCard
                    key={item.id}
                    item={item}
                    index={index}
                    reducedMotion={Boolean(reducedMotion)}
                    onNavigate={() => handleOpenChange(false)}
                  />
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

function AssistantHeader({
  title,
  subtitle,
  onClose,
  closeLabel,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-br from-brand-deep to-dashboard-gulf px-4 py-3.5 text-brand-on">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
        <Sparkles className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{title}</p>
        <p className="truncate text-xs text-brand-on/80">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-on/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function GreetingBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-dashboard-gulf-light text-dashboard-gulf">
        <Bot className="h-4 w-4" />
      </span>
      <p className="max-w-[85%] rounded-2xl rounded-ss-sm bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-ink">
        {text}
      </p>
    </div>
  );
}

function OptionCard({
  item,
  index,
  reducedMotion,
  onNavigate,
}: {
  item: PublicChatbotItem;
  index: number;
  reducedMotion: boolean;
  onNavigate: () => void;
}) {
  const isExternal = /^https?:\/\//.test(item.redirectUrl ?? "");
  const cardClass = cn(
    "group flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-card px-3.5 py-3 text-start",
    "transition-all duration-200 hover:border-dashboard-gulf/60 hover:bg-dashboard-gulf-light/40 hover:shadow-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gulf",
  );

  const inner = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-xl transition-transform duration-200 group-hover:scale-110">
        {item.icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
        {item.title}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </>
  );

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: reducedMotion ? 0 : index * 0.04, ease: EASE }}
    >
      {item.redirectUrl ? (
        isExternal ? (
          <a
            href={item.redirectUrl}
            target="_blank"
            rel="noreferrer"
            onClick={onNavigate}
            className={cardClass}
          >
            {inner}
          </a>
        ) : (
          <Link href={item.redirectUrl} onClick={onNavigate} className={cardClass}>
            {inner}
          </Link>
        )
      ) : (
        <span className={cn(cardClass, "cursor-default opacity-70")}>{inner}</span>
      )}
    </motion.li>
  );
}

function OptionsSkeleton() {
  return (
    <ul className="space-y-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 rounded-2xl border border-border/70 px-3.5 py-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 flex-1" />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-muted text-muted-foreground">
        <Sparkles className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

function ErrorState({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
      <p className="text-sm text-ink">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gulf"
      >
        {retryLabel}
      </button>
    </div>
  );
}
