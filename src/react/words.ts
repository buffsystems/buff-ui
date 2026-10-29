/*
  The package's own words (#713): the defaults of labels an app may leave out. Each component
  reads them in the locale of the nearest LocaleProvider (Russian without one).
*/
import type { Locale } from '../shared/locale.ts'
import { useLocale } from './locale.tsx'

const WORDS = {
  ru: {
    close: 'Закрыть',
    closeTab: 'Закрыть вкладку',
    copy: 'Копировать',
    copied: 'Скопировано',
    remove: 'Убрать',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    nothingFound: 'Ничего не найдено',
    loading: 'Загрузка…',
    showOptions: 'Показать варианты',
    scrollTable: 'Прокрутить таблицу вправо',
    theme: 'Переключить тему',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    themeSystem: 'Системная',
    language: 'Язык',
    languageSystem: 'Как в системе',
  },
  en: {
    close: 'Close',
    closeTab: 'Close tab',
    copy: 'Copy',
    copied: 'Copied',
    remove: 'Remove',
    confirm: 'Confirm',
    cancel: 'Cancel',
    nothingFound: 'Nothing found',
    loading: 'Loading…',
    showOptions: 'Show options',
    scrollTable: 'Scroll the table right',
    theme: 'Switch theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    language: 'Language',
    languageSystem: 'System language',
  },
} satisfies Record<Locale, Record<string, string>>

export type Words = (typeof WORDS)['ru']

export function wordsFor(locale: Locale): Words {
  return WORDS[locale]
}

export function useWords(): Words {
  return wordsFor(useLocale())
}
