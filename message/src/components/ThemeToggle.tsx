"use client";

import type { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import style from "../styles/components/ThemeToggle.module.css";

interface ThemeToggleProps {
  fixed?: boolean;
}

function MoonIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon(): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
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
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}