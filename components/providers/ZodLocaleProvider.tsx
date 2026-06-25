"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect, type ReactNode } from "react";
import { z } from "zod";
import * as zodLocales from "zod/locales";

function applyZodLocale(locale: string) {
  const factory = locale === "ar" ? zodLocales.ar : zodLocales.en;
  z.config(factory());
}

type ZodLocaleProviderProps = {
  children: ReactNode;
};

/**
 * Keeps Zod's built-in error strings aligned with the active dashboard locale.
 */
export function ZodLocaleProvider({ children }: ZodLocaleProviderProps) {
  const locale = useLocale();

  applyZodLocale(locale);

  useLayoutEffect(() => {
    applyZodLocale(locale);
  }, [locale]);

  return children;
}
