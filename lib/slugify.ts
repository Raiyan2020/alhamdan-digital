export const SLUG_MAX_LENGTH = 120;

/** Lowercase URL slug: letters, numbers, and single hyphens only. */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

export function normalizeSlug(value: string, fallback = "") {
  const normalized = slugify(value);
  return normalized || fallback;
}
