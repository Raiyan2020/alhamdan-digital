import { ApiError } from "./errors";

type ApiEnvelope<T> = {
  ok?: boolean;
  message?: string;
  issues?: unknown;
  code?: string;
} & T;

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "same-origin",
    ...init,
  });

  let data: ApiEnvelope<T>;
  try {
    data = (await response.json()) as ApiEnvelope<T>;
  } catch {
    if (!response.ok) {
      throw new ApiError(response.statusText || "Request failed.", response.status);
    }
    throw new ApiError("Invalid response from server.");
  }

  if (!response.ok || data.ok === false) {
    throw new ApiError(data.message ?? "Request failed.", response.status, data.issues, data.code);
  }

  return data as T;
}
