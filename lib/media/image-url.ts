const DEFAULT_HEADER_LOGO = "/figma/logo-header.webp";
const DEFAULT_FOOTER_LOGO = "/figma/logo-footer.webp";
const DEFAULT_ABOUT_PRODUCT_IMAGE = "/figma/hero-visual.webp";

export function isValidImageSrc(url?: string | null): url is string {
  if (!url?.trim()) return false;

  const trimmed = url.trim();
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  );
}

export function resolveImageSrc(url?: string | null, fallback = ""): string {
  if (!url?.trim()) return fallback;

  const trimmed = url.trim();
  return isValidImageSrc(trimmed) ? trimmed : fallback;
}

export const imageFallbacks = {
  headerLogo: DEFAULT_HEADER_LOGO,
  footerLogo: DEFAULT_FOOTER_LOGO,
  aboutProduct: DEFAULT_ABOUT_PRODUCT_IMAGE,
} as const;

type LocalizedMediaLike = {
  defaultUrl: string;
  arUrl?: string | null;
  enUrl?: string | null;
};

export function pickLocalizedMediaUrl(
  field: LocalizedMediaLike | null | undefined,
  locale: "ar" | "en",
  fallback = "",
): string | null {
  if (!field) return fallback || null;

  const defaultUrl = resolveImageSrc(field.defaultUrl, fallback);
  const localizedUrl = locale === "ar" ? field.arUrl : field.enUrl;
  const resolved = resolveImageSrc(localizedUrl, defaultUrl);

  return resolved || null;
}
