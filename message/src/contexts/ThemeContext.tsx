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
import { THEME_KEY, THEME_ROOT_ID, type ThemeName } from "../theme";

export type { ThemeName };

function readSystemTheme(): ThemeName {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider(props: {
  initialTheme: ThemeName;
  children: ReactNode;
}): ReactNode {
  const [theme, setTheme] = useState<ThemeName>(props.initialTheme);

  const applyTheme = useCallback((next: ThemeName): void => {
    document
      .getElementById(THEME_ROOT_ID)
      ?.setAttribute("data-theme", next);
    window.localStorage.setItem(THEME_KEY, next);
    document.cookie =
      `${THEME_KEY}=${next};path=/;max-age=31536000;samesite=lax`;
  }, []);

  useEffect((): void => {
    const stored: string | null = window.localStorage.getItem(THEME_KEY);
    const resolved: ThemeName =
      stored === "dark" || stored === "light" ? stored : readSystemTheme();

    if (resolved !== props.initialTheme) {
      setTheme(resolved);
      applyTheme(resolved);
    }
  }, [applyTheme, props.initialTheme]);

  const toggleTheme = useCallback((): void => {
    const next: ThemeName = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  }, [applyTheme, theme]);

  const value: ThemeContextValue = useMemo(
    (): ThemeContextValue => ({ theme: theme, toggleTheme: toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context: ThemeContextValue | null = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
