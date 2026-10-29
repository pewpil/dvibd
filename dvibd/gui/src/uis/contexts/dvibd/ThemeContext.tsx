import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";

export type Theme = "dark" | "light";

const THEME_KEY = "dvibd-theme";

interface ThemeContextValue {
  theme: Accessor<Theme>;
  setTheme(next: Theme): void;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue>();

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "light" ? "light" : "dark";
}

function ThemeProvider(props: ParentProps) {
  const [theme, setThemeSignal] = createSignal<Theme>(readStoredTheme());

  const setTheme = (next: Theme): void => {
    localStorage.setItem(THEME_KEY, next);
    setThemeSignal(next);
  };

  const toggleTheme = (): void => {
    setTheme(theme() === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}

export { ThemeProvider, useTheme };
