import { createEffect, createSignal } from 'solid-js'
import type { ParentProps } from 'solid-js'
import style from '../../../styles/pages/dvibd/App.module.css'

const THEME_KEY = 'dvibd-theme'

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function App(props: ParentProps) {
  const [theme, setTheme] = createSignal<'light' | 'dark'>(getInitialTheme())

  createEffect(() => {
    localStorage.setItem(THEME_KEY, theme())
  })

  return (
    <div id={style.app} data-theme={theme()}>
      <button
        id={style.themeToggle}
        type="button"
        aria-label={`Switch to ${theme() === 'light' ? 'dark' : 'light'} mode`}
        onClick={() => setTheme(theme() === 'light' ? 'dark' : 'light')}
      >
        {theme() === 'light' ? 'Dark' : 'Light'}
      </button>
      {props.children}
    </div>
  )
}

export default App