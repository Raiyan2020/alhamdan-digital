import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export type Direction = "ltr" | "rtl";

export function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

