export class ApiError extends Error {
  readonly status?: number;
  readonly issues?: unknown;

  constructor(message: string, status?: number, issues?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const issues = formatApiIssues(error.issues);
    return issues ? `${error.message}\n${issues}` : error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
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
