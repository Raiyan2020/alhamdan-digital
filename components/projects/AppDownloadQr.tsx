"use client";

import QRCode from "qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type StoreButton = { id: string; label: string; href: string; qrImage?: string };

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
          width: variant === "compact" ? 72 : 112,
          color: { dark: "#032e5d", light: "#ffffff" },
        }),
      ] as const),
    ).then((entries) => {
      if (active) setGeneratedCodes((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });

    return () => { active = false; };
  }, [generatedCodes, stores, variant]);

  if (!stores.length) return null;

  if (variant === "compact") {
    const store = stores[0];
    const src = store.qrImage || generatedCodes[store.id];
    if (!src) return null;
    return <div className={cn("rounded-xl border border-brand/15 bg-white p-1.5 shadow-sm", className)} title={t("scanToDownload")}><Image unoptimized src={src} width={54} height={54} alt={`${t("qrAlt")} ${store.label}`} className="h-[54px] w-[54px] rounded-lg" /></div>;
  }

  return <div className={cn("flex flex-wrap gap-3", className)}>{stores.map((store) => {
    const src = store.qrImage || generatedCodes[store.id];
    return <div key={store.id} className="flex items-center gap-3 rounded-2xl border border-border-soft bg-page p-2.5 shadow-sm"><div className="grid h-16 w-16 place-items-center rounded-xl bg-white">{src ? <Image unoptimized src={src} width={56} height={56} alt={`${t("qrAlt")} ${store.label}`} className="h-14 w-14 rounded-lg" /> : null}</div><p className="max-w-28 text-xs font-semibold leading-5 text-ink-secondary">{t("scanToDownload")}</p></div>;
  })}</div>;
}
