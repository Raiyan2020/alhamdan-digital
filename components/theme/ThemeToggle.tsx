"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSyncExternalStore } from "react";
import { MotionButton } from "@/components/motion";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  variant?: "header" | "icon";
};

export function ThemeToggle({ className, variant = "header" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const t = useTranslations("shell");

  if (!mounted) {
    return (
      <span
        className={cn(
          variant === "header" ? "h-10 w-10 shrink-0 rounded-full" : "h-9 w-9",
          className,
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <MotionButton
      type="button"
      data-bidi="ltr"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        variant === "header" &&
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-medium text-page shadow-[0_2px_12px_rgba(8,37,87,0.2)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
        variant === "icon" &&
          "grid h-9 w-9 place-items-center rounded-full bg-brand-deep/10 text-brand-deep transition-colors hover:bg-brand-deep/15",
        className,
      )}
      aria-label={isDark ? t("themeLight") : t("themeDark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </MotionButton>
  );
}
