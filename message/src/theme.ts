export type ThemeName = "light" | "dark";

export const THEME_KEY: string = "dvibd-theme";
export const THEME_ROOT_ID: string = "app";

export function resolveThemeCookie(value: string | undefined): ThemeName | null {
  return value === "dark" || value === "light" ? value : null;
}
