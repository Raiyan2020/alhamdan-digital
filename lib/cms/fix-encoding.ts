function looksLikeMojibake(value: string) {
  return /[ØÙÃÂ][\u0080-\u00FF]/.test(value);
}

export function fixMojibake(value: string): string {
  if (!looksLikeMojibake(value)) return value;

  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    return looksLikeMojibake(repaired) ? value : repaired;
  } catch {
    return value;
  }
}

export function fixMojibakeDeep<T>(value: T): T {
  if (typeof value === "string") {
    return fixMojibake(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => fixMojibakeDeep(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, fixMojibakeDeep(item)]),
    ) as T;
  }

  return value;
}
