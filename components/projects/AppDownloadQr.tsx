"use client";

import QRCode from "qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type StoreButton = { id: string; label: string; href: string; qrImage?: string; platform?: "app-store" | "google-play" | "other" };

// Store names are brand names, so they stay untranslated in both locales.
const PLATFORM_NAMES: Record<string, string> = { "app-store": "App Store", "google-play": "Google Play" };

const storeName = (store: StoreButton) => store.label?.trim() || PLATFORM_NAMES[store.platform ?? "other"] || "";

export function AppDownloadQr({
  buttons,
  className,
  variant = "card",
}: {
  buttons: StoreButton[];
  className?: string;
  variant?: "card" | "compact";
}) {
  const t = useTranslations("projects");
  const stores = buttons.filter((button) => Boolean(button.href) && button.href !== "#");
  const [generatedCodes, setGeneratedCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const missingCodes = stores.filter((store) => !store.qrImage && !generatedCodes[store.id]);
    if (!missingCodes.length) return;

    Promise.all(
      missingCodes.map(async (store) => [
        store.id,
        await QRCode.toDataURL(store.href, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: variant === "compact" ? 128 : 112,
          color: { dark: "#032e5d", light: "#ffffff" },
        }),
      ] as const),
    ).then((entries) => {
      if (active) setGeneratedCodes((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });

    return () => { active = false; };
  }, [generatedCodes, stores, variant]);

  if (!stores.length) return null;

  // Collapse store buttons that point to the same link so the same QR isn't shown twice.
  const uniqueStores = stores.filter(
    (store, index) => stores.findIndex((other) => other.href === store.href) === index,
  );

  if (variant === "compact") {
    const tiles = uniqueStores
      .map((store) => ({ store, src: store.qrImage || generatedCodes[store.id] }))
      .filter((tile) => Boolean(tile.src));
    if (!tiles.length) return null;
    return <div className={cn("flex flex-wrap items-start justify-center gap-3", className)}>{tiles.map(({ store, src }) => {
      const name = storeName(store);
      return <div key={store.id} className="flex flex-col items-center gap-1" title={name ? t("scanToDownloadFrom", { store: name }) : t("scanToDownload")}><div className="rounded-xl bg-white p-1.5"><Image unoptimized src={src} width={96} height={96} alt={`${t("qrAlt")} ${store.label}`} className="h-20 w-20 rounded-lg" /></div>{name ? <p className="text-[10px] font-bold leading-4 text-ink-heading" dir="ltr">{name}</p> : null}</div>;
    })}</div>;
  }

  return <div className={cn("flex flex-wrap gap-3", className)}>{uniqueStores.map((store) => {
    const src = store.qrImage || generatedCodes[store.id];
    const name = storeName(store);
    return <div key={store.id} className="flex flex-col items-center gap-2 rounded-2xl border border-border-soft bg-page p-3 text-center shadow-sm"><div className="grid h-24 w-24 place-items-center rounded-xl bg-white">{src ? <Image unoptimized src={src} width={88} height={88} alt={`${t("qrAlt")} ${store.label}`} className="h-20 w-20 rounded-lg" /> : null}</div><div className="max-w-28"><p className="text-xs font-semibold leading-5 text-ink-secondary">{t("scanToDownload")}</p>{name ? <p className="text-xs font-bold leading-5 text-ink-heading" dir="ltr">{name}</p> : null}</div></div>;
  })}</div>;
}
