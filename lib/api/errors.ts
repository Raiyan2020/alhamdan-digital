export class ApiError extends Error {
  readonly status?: number;
  readonly issues?: unknown;
  readonly code?: string;

  constructor(message: string, status?: number, issues?: unknown, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
    this.code = code;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const issues = formatApiIssues(error.issues);
    const message = localizeApiError(error.code) ?? error.message;
    return issues ? `${message}\n${issues}` : message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

function localizeApiError(code?: string): string | null {
  if (code !== "CURRENT_PASSWORD_INCORRECT") return null;

  const locale = typeof document !== "undefined" && document.documentElement.lang.startsWith("ar")
    ? "ar"
    : "en";

  return locale === "ar"
    ? "كلمة المرور الحالية غير صحيحة."
    : "Current password is incorrect.";
}

function formatApiIssues(issues: unknown): string | null {
  if (!issues || typeof issues !== "object") return null;

  const flattened = issues as {
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
  };

  const lines = [
    ...(flattened.formErrors ?? []),
    ...Object.entries(flattened.fieldErrors ?? {}).flatMap(([field, messages]) =>
      messages.map((message) => `${field}: ${message}`),
    ),
  ].filter(Boolean);

  return lines.length > 0 ? lines.slice(0, 6).join("\n") : null;
}
