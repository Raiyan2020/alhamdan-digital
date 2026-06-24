export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canUseAdvancedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (isReducedMotion()) return false;
  if (window.innerWidth < 1024) return false;

  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (memory && memory < 4) return false;

  return true;
}

export function canUseParallax(): boolean {
  if (!canUseAdvancedMotion()) return false;
  if (window.innerWidth < 1024) return false;
  return true;
}

export async function isLowBattery(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as Navigator & {
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
  };

  if (!nav.getBattery) return false;

  try {
    const battery = await nav.getBattery();
    return !battery.charging && battery.level < 0.2;
  } catch {
    return false;
  }
}
