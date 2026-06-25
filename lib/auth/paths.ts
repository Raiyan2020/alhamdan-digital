import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && routing.locales.includes(first as Locale)) {
    return `/${segments.slice(1).join("/")}` || "/";
  }

  return pathname;
}

export function localePrefixFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && routing.locales.includes(first as Locale)) {
    return `/${first}`;
  }

  return "";
}

export function withLocalePrefix(pathname: string, localePrefix: string) {
  if (!localePrefix) return pathname;
  return `${localePrefix}${pathname}`;
}
