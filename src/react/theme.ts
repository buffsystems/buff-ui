import { useCallback, useEffect, useState } from 'react'

/** The viewer's choice. `system` follows the OS via `prefers-color-scheme`. */
export type Theme = 'light' | 'dark' | 'system'
/** The mode actually painted. */
export type EffectiveTheme = 'light' | 'dark'

/**
 * localStorage key of the choice. An app's anti-flash boot script in index.html reads the same
 * key before React loads — change both together.
 */
export const THEME_STORAGE_KEY = 'theme'

const THEMES: readonly Theme[] = ['light', 'dark', 'system']
const PREFERS_DARK = '(prefers-color-scheme: dark)'

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/** The stored choice; `system` when unset, invalid or storage is unavailable. */
export function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

/** The mode a choice resolves to, given the OS preference. */
export function resolveTheme(theme: Theme, prefersDark: boolean): EffectiveTheme {
  if (theme === 'system') return prefersDark ? 'dark' : 'light'
  return theme
}

/** Paint a mode: `.dark` on <html>, the contract every Buff stylesheet follows. */
export function applyTheme(effective: EffectiveTheme): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', effective === 'dark')
}

function darkQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null
  return window.matchMedia(PREFERS_DARK)
}

/**
 * The light / dark / system choice, persisted in localStorage and painted on <html>. In
 * `system` mode it follows live OS changes. Returns the effective mode too.
 */
export function useTheme(): {
  theme: Theme
  effective: EffectiveTheme
  setTheme: (theme: Theme) => void
} {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [effective, setEffective] = useState<EffectiveTheme>(() =>
    resolveTheme(readStoredTheme(), darkQuery()?.matches ?? false),
  )

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // storage unavailable — keep the in-memory choice
    }
    setThemeState(next)
  }, [])

  useEffect(() => {
    const query = darkQuery()
    const sync = () => {
      const next = resolveTheme(theme, query?.matches ?? false)
      applyTheme(next)
      setEffective(next)
    }
    sync()
    if (theme === 'system' && query) {
      query.addEventListener('change', sync)
      return () => query.removeEventListener('change', sync)
    }
  }, [theme])

  return { theme, effective, setTheme }
}
