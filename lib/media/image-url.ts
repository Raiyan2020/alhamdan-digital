export const DEFAULT_IMAGE_FALLBACK = "/figma/logo-header.webp";
const DEFAULT_HEADER_LOGO = DEFAULT_IMAGE_FALLBACK;
const DEFAULT_FOOTER_LOGO = "/figma/logo-footer.webp";
const DEFAULT_ABOUT_PRODUCT_IMAGE = DEFAULT_HEADER_LOGO;

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

export function resolveImageSrc(url?: string | null, fallback = DEFAULT_IMAGE_FALLBACK): string {
  const safeFallback = isValidImageSrc(fallback) ? fallback : DEFAULT_IMAGE_FALLBACK;
  if (!url?.trim()) return safeFallback;

  const trimmed = url.trim();
  return isValidImageSrc(trimmed) ? trimmed : safeFallback;
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
  fallback = DEFAULT_IMAGE_FALLBACK,
): string | null {
  if (!field) return resolveImageSrc(undefined, fallback);

  const defaultUrl = resolveImageSrc(field.defaultUrl, fallback);
  const localizedUrl = locale === "ar" ? field.arUrl : field.enUrl;
  const resolved = resolveImageSrc(localizedUrl, defaultUrl);

  return resolved || DEFAULT_IMAGE_FALLBACK;
}
