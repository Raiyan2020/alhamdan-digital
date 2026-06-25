"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeSetting = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme?: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
  resolvedTheme?: ResolvedTheme;
  systemTheme?: ResolvedTheme;
};

const STORAGE_KEY = "theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

function readStoredTheme(): ThemeSetting {
  if (typeof localStorage === "undefined") return "light";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Ignore storage access errors.
  }
  return "light";
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeSetting>(readStoredTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors.
    }
  }, [resolvedTheme, theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(getSystemTheme());

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((nextTheme: ThemeSetting) => {
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
    }),
    [resolvedTheme, setTheme, systemTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: "light" as ThemeSetting,
      setTheme: () => {},
      resolvedTheme: undefined,
      systemTheme: undefined,
    };
  }
  return context;
}
