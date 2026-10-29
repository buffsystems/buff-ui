/** @jsxRuntime automatic */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  isLanguageChoice,
  resolveLocale,
  type LanguageChoice,
  type Locale,
} from '../shared/locale.ts'

/**
 * localStorage key of the language choice (#713). An app's boot script may read the same key
 * before React loads — change both together.
 */
export const LANGUAGE_STORAGE_KEY = 'language'

/** The stored choice; `system` when unset, invalid or storage is unavailable. */
export function readStoredLanguage(): LanguageChoice {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguageChoice(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

/** The browser's preferred languages, most preferred first. */
export function systemLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') return []
  return navigator.languages?.length ? navigator.languages : [navigator.language]
}

/**
 * The ru / en / system choice, persisted in localStorage, with the locale it resolves to.
 * `<html lang>` follows the locale; in `system` mode a change of the browser's languages is
 * picked up live.
 */
export function useLanguage(): {
  choice: LanguageChoice
  locale: Locale
  setChoice: (choice: LanguageChoice) => void
} {
  const [choice, setChoiceState] = useState<LanguageChoice>(readStoredLanguage)
  const [languages, setLanguages] = useState(systemLanguages)
  const locale = resolveLocale(choice, languages)

  const setChoice = useCallback((next: LanguageChoice) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      // storage unavailable — keep the in-memory choice
    }
    setChoiceState(next)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sync = () => setLanguages(systemLanguages())
    window.addEventListener('languagechange', sync)
    return () => window.removeEventListener('languagechange', sync)
  }, [])

  return { choice, locale, setChoice }
}

const LocaleContext = createContext<Locale>('ru')

/** The locale the package's own words (prop defaults, pairing screens) speak in. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

/** The locale a component speaks: its own `locale` prop, else the nearest provider's. */
export function useLocale(override?: Locale): Locale {
  const provided = useContext(LocaleContext)
  return override ?? provided
}
