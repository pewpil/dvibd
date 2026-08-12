import { createEffect, createSignal } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import style from "../styles/components/ThemeToggle.module.css";

const THEME_KEY = "dvibd-theme";

function getCookieTheme(): "light" | "dark" {
  const cookie = isServer
    ? getRequestEvent()?.request.headers.get("cookie") ?? ""
    : document.cookie;
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${THEME_KEY}=([^;]+)`));
  return match?.[1] === "dark" ? "dark" : "light";
}

function ThemeToggle() {
  const [theme, setTheme] = createSignal<"light" | "dark">(getCookieTheme());

  createEffect(() => {
    if (isServer) return;
    if (localStorage.getItem(THEME_KEY)) return;
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  });

  createEffect(() => {
    if (isServer) return;
    document.getElementById("app")?.setAttribute("data-theme", theme());
    localStorage.setItem(THEME_KEY, theme());
    document.cookie = `${THEME_KEY}=${theme()};path=/;max-age=31536000;samesite=lax`;
  });

  return (
    <button
      id={style.themeToggle}
      type="button"
      aria-label={`Switch to ${theme() === "light" ? "dark" : "light"} mode`}
      onClick={() => setTheme(theme() === "light" ? "dark" : "light")}
    >
      {theme() === "light" ? "Dark" : "Light"}
    </button>
  );
}

export default ThemeToggle;