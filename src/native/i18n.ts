/*
  The screen strings of `@buff/ui/native` (#629): Russian and English, as the cabinet speaks.
  Each area registers its own dictionary (`strings/*.ts`); a key is `area.name`. The app may
  swap the translator for its own, the components only ever call `t(key)`.
*/
import type { Locale } from '../shared/locale.ts'

export type { Locale }

export type Dictionary = Record<string, { ru: string; en: string }>

export type Translate = (key: string, vars?: Record<string, string | number>) => string

const registry: Dictionary = {}

/** Register an area's strings; keys are global, a duplicate is a programming error. */
export function defineStrings<T extends Dictionary>(strings: T): { [K in keyof T]: K } {
  const keys = {} as { [K in keyof T]: K }
  for (const key of Object.keys(strings) as (keyof T & string)[]) {
    if (key in registry) throw new Error(`@buff/ui/native: duplicate string key ${key}`)
    registry[key] = strings[key]
    keys[key] = key
  }
  return keys
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

export function makeTranslate(locale: Locale): Translate {
  return (key, vars) => {
    const entry = registry[key]
    // An unknown key shows itself: visible in a story, never a crash.
    return entry ? interpolate(entry[locale], vars) : key
  }
}

/** Every registered key — the test that proves each one has both languages. */
export function registeredStrings(): Readonly<Dictionary> {
  return registry
}

/** An amount of roubles as a person reads it: at most kopecks, in the interface's language. */
export function rubles(n: number, locale: Locale): string {
  return n.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 2 })
}
