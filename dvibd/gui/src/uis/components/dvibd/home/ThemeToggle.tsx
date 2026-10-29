import { useTheme } from "../../../contexts/dvibd/ThemeContext.tsx";
import style from "../../../../styles/components/dvibd/home/ThemeToggle.module.css";

function ThemeToggle() {
  const theme = useTheme();

  return (
    <button
      id={style.themeToggle}
      type="button"
      aria-label={
        theme.theme() === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={theme.toggleTheme}
    >
      {theme.theme() === "dark" ? "Light" : "Dark"}
    </button>
  );
}

export default ThemeToggle;
