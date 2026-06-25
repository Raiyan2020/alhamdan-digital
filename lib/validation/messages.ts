/** i18n keys passed as Zod `message` values and resolved in `FormMessage`. */
export const validationMessages = {
  required: "validation.required",
  arabicRequired: "validation.arabicRequired",
  englishRequired: "validation.englishRequired",
  invalidEmail: "validation.invalidEmail",
  passwordRequired: "validation.passwordRequired",
  invalidSlug: "validation.invalidSlug",
  invalidUrl: "validation.invalidUrl",
} as const;

export type ValidationMessageKey =
  (typeof validationMessages)[keyof typeof validationMessages];

const legacyEnglishMessages: Record<string, ValidationMessageKey> = {
  "Arabic value is required": validationMessages.arabicRequired,
  "English value is required": validationMessages.englishRequired,
  "Enter a valid email address.": validationMessages.invalidEmail,
  "Password is required.": validationMessages.passwordRequired,
  "Slug must be lowercase letters, numbers, and hyphens.":
    validationMessages.invalidSlug,
};

export function resolveValidationMessage(
  message: string,
  translate: (key: ValidationMessageKey) => string,
): string {
  if (!message) return message;

  if (message.startsWith("validation.")) {
    return translate(message as ValidationMessageKey);
  }

  const legacyKey = legacyEnglishMessages[message];
  if (legacyKey) {
    return translate(legacyKey);
  }

  return message;
}
