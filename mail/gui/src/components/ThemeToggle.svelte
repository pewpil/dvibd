<script lang="ts">
  import style from "../styles/components/ThemeToggle.module.css";
  import { applyTheme, initialTheme, type ThemeName } from "../lib/theme.ts";

  let theme = $state<ThemeName>(initialTheme());

  let nextTheme: ThemeName = $derived(theme === "light" ? "dark" : "light");

  function handleToggle(): void {
    theme = nextTheme;
    applyTheme(theme);
  }
</script>

<button
  type="button"
  id={style.themeToggle}
  onclick={handleToggle}
  aria-label={`Switch to ${nextTheme} mode`}
  title={`Switch to ${nextTheme} mode`}
>
  {#if theme === "light"}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  {:else}
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  {/if}
</button>
