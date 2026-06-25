import type { FieldErrors, FieldValues } from "react-hook-form";

export function countFormErrors(errors: FieldErrors<FieldValues>): number {
  let total = 0;

  function walk(value: unknown) {
    if (!value || typeof value !== "object") return;
    if ("message" in value && typeof (value as { message?: unknown }).message === "string") {
      total += 1;
      return;
    }
    Object.values(value as Record<string, unknown>).forEach(walk);
  }

  Object.values(errors).forEach(walk);
  return total;
}

export function getFirstErrorPath(errors: FieldErrors<FieldValues>): string | null {
  function walk(node: FieldErrors<FieldValues>, prefix = ""): string | null {
    for (const [key, value] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (!value || typeof value !== "object") continue;
      if ("message" in value && value.message) return path;
      const nested = walk(value as FieldErrors<FieldValues>, path);
      if (nested) return nested;
    }
    return null;
  }

  return walk(errors);
}

export function getErrorPaths(errors: FieldErrors<FieldValues>): string[] {
  const paths: string[] = [];

  function walk(node: FieldErrors<FieldValues>, prefix = "") {
    for (const [key, value] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (!value || typeof value !== "object") continue;
      if ("message" in value && value.message) {
        paths.push(path);
        continue;
      }
      walk(value as FieldErrors<FieldValues>, path);
    }
  }

  walk(errors);
  return paths;
}

const HOME_SECTION_BY_ROOT: Record<string, string> = {
  seo: "seo",
  header: "shell",
  loading: "shell",
  nav: "nav",
  footerLinks: "nav",
  hero: "hero",
  about: "about",
  aboutCards: "about",
  visionMission: "vision",
  process: "process",
  products: "products",
  services: "services",
  sectors: "sectors",
  why: "why",
  market: "market",
  footer: "footer",
};

const ABOUT_SECTION_BY_ROOT: Record<string, string> = {
  seo: "seo",
  hero: "hero",
  products: "products",
};

export function resolveHomeSectionFromFieldPath(path: string) {
  const root = path.split(".")[0] ?? "seo";
  return HOME_SECTION_BY_ROOT[root] ?? "seo";
}

export function resolveAboutSectionFromFieldPath(path: string) {
  const root = path.split(".")[0] ?? "seo";
  return ABOUT_SECTION_BY_ROOT[root] ?? "seo";
}
