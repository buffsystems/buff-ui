/*
  The one language rule of every Buff client (#565, #713): Russian and English, Russian by
  default. The system's preferred languages are read in order and the first Russian or English
  one wins; anything else, or nothing at all, gives Russian.
*/
export type Locale = 'ru' | 'en'

/** The person's choice: a language, or whatever the system says. */
export type LanguageChoice = Locale | 'system'

export const DEFAULT_LOCALE: Locale = 'ru'

/** The locale for the system's preferred languages (BCP 47 tags, most preferred first). */
export function pickLocale(languages: readonly (string | undefined)[]): Locale {
  for (const tag of languages) {
    const base = tag?.toLowerCase().split(/[-_]/)[0]
    if (base === 'ru' || base === 'en') return base
  }
  return DEFAULT_LOCALE
}

/** A choice resolved against the system's languages. */
export function resolveLocale(
  choice: LanguageChoice,
  languages: readonly (string | undefined)[],
): Locale {
  return choice === 'system' ? pickLocale(languages) : choice
}

export function isLanguageChoice(value: unknown): value is LanguageChoice {
  return value === 'ru' || value === 'en' || value === 'system'
}
