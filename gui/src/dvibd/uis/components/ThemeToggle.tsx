import { createSignal, onMount, type JSX } from "solid-js";

import styles from "@src/dvibd/styles/components/ThemeToggle.module.css";

const STORAGE_KEY = "dvibd-theme";

function readTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = createSignal<"light" | "dark">(readTheme());

  onMount(() => {
    setTheme(readTheme());
  });

  function toggle(): void {
    const next = theme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      class={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme() === "dark" ? "light" : "dark"} mode`}
    >
      {theme() === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default ThemeToggle;
