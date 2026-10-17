import { createEffect, createSignal } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import style from "../styles/components/ThemeToggle.module.css";

const THEME_KEY = "dvibd-theme";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
} as const;

function getCookieTheme(): "light" | "dark" {
  const cookie = isServer
    ? getRequestEvent()?.request.headers.get("cookie") ?? ""
    : document.cookie;
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${THEME_KEY}=([^;]+)`));
  return match?.[1] === "dark" ? "dark" : "light";
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = createSignal<"light" | "dark">(getCookieTheme());
  const next = () => (theme() === "light" ? "dark" : "light");

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
      aria-label={`Switch to ${next()} mode`}
      title={`Switch to ${next()} mode`}
      onClick={() => setTheme(next())}
    >
      {theme() === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

export default ThemeToggle;