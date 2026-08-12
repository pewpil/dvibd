import { createEffect, createSignal } from "solid-js";
import style from "../styles/components/ThemeToggle.module.css";

const THEME_KEY = "dvibd-theme";

function ThemeToggle() {
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  createEffect(() => {
    const app = document.getElementById("app");
    app?.setAttribute("data-theme", theme());
    localStorage.setItem(THEME_KEY, theme());
  });

  createEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    }
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