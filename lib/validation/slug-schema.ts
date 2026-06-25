import { z } from "zod";
import { normalizeSlug, SLUG_MAX_LENGTH, slugify } from "@/lib/slugify";
import { validationMessages } from "@/lib/validation/messages";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugRules = z
  .string()
  .max(SLUG_MAX_LENGTH)
  .regex(SLUG_PATTERN, validationMessages.invalidSlug);

/** Zod field that normalizes free-form input into a valid slug before validation. */
export function slugFieldSchema(options?: { required?: boolean; fallback?: string }) {
  const required = options?.required !== false;
  const fallback = options?.fallback ?? "";

  return z
    .string()
    .transform((value) => normalizeSlug(value, required ? fallback : ""))
    .pipe(required ? slugRules.min(1, validationMessages.required) : slugRules.or(z.literal("")));
}

export { slugify };
