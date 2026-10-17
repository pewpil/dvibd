"use client";

import type { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import style from "../styles/components/ThemeToggle.module.css";

interface ThemeToggleProps {
  fixed?: boolean;
}

export default function ThemeToggle(props: ThemeToggleProps): ReactNode {
  const { theme, toggleTheme } = useTheme();
  const next: string = theme === "light" ? "dark" : "light";

  return (
    <button
      id={style.themeToggle}
      className={props.fixed === true ? style.placementFixed : undefined}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
