import { z } from "zod";
import type { BilingualText } from "@/lib/cms/types";

const bilingualOverrideSchema = z
  .object({
    ar: z.string().max(2000),
    en: z.string().max(2000),
  })
  .nullish();

// Relative in-app path ("/projects/road-80") or absolute http(s) URL.
const redirectUrlSchema = z
  .string()
  .max(1024)
  .refine(
    (value) =>
      value.trim() === "" ||
      value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://"),
    { message: "Redirect URL must be a relative path or an http(s) URL." },
  )
  .nullish();

export const chatbotItemCreateSchema = z.object({
  productId: z.string().min(1).max(191),
  title: bilingualOverrideSchema,
  description: bilingualOverrideSchema,
  redirectUrl: redirectUrlSchema,
  icon: z.string().max(64).nullish(),
  // No zod defaults here: the POST route applies them via `?? true` / `?? 0`.
  // A default would survive `.partial()` and make a partial PATCH (e.g. an
  // active-toggle) silently reset the omitted field.
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const chatbotItemUpdateSchema = chatbotItemCreateSchema.partial();

export type ChatbotItemCreateInput = z.infer<typeof chatbotItemCreateSchema>;
export type ChatbotItemUpdateInput = z.infer<typeof chatbotItemUpdateSchema>;

/** Collapse an override to null when both locales are blank. */
export function normalizeBilingualOverride(
  value: BilingualText | null | undefined,
): BilingualText | null {
  if (!value) return null;
  const ar = value.ar?.trim() ?? "";
  const en = value.en?.trim() ?? "";
  if (!ar && !en) return null;
  return { ar, en };
}

export function normalizeRedirectUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
