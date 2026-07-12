"use client";

import { toast as sonnerToast } from "sonner";

const ERROR_DEDUPLICATION_WINDOW_MS = 2_500;
const recentErrors = new Map<string, number>();

function errorKey(message: string) {
  return message.trim().replace(/\s+/g, " ").toLowerCase();
}

function showErrorOnce(message: string) {
  const key = errorKey(message);
  const now = Date.now();
  const lastShownAt = recentErrors.get(key);

  if (lastShownAt && now - lastShownAt < ERROR_DEDUPLICATION_WINDOW_MS) {
    return;
  }

  recentErrors.set(key, now);
  sonnerToast.error(message, { id: `error:${key}` });
}

export const toast = {
  success: sonnerToast.success,
  error: showErrorOnce,
  info: sonnerToast.info,
  warning: sonnerToast.warning,
  loading: sonnerToast.loading,
  dismiss: sonnerToast.dismiss,
};
