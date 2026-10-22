export type ThemeName = "light" | "dark";

export const THEME_KEY: string = "mail.theme";

export function readStoredTheme(): ThemeName | null {
  const stored: string | null = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

export function initialTheme(): ThemeName {
  const stored: ThemeName | null = readStoredTheme();
  if (stored !== null) {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
