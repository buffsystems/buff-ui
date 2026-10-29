import { defineStrings } from '../i18n.ts'

/** Search across the install (#644). */
export const S = defineStrings({
  'search.title': { ru: 'Поиск', en: 'Search' },
  'search.open': { ru: 'Поиск', en: 'Search' },
  'search.placeholder': {
    ru: 'Задачи, ревью, исследования, вопросы…',
    en: 'Tasks, reviews, research, questions…',
  },
  'search.hint': { ru: 'Наберите хотя бы два символа', en: 'Type at least two characters' },
  'search.none': { ru: 'Ничего не нашлось', en: 'Nothing found' },
  'search.error': { ru: 'Поиск не удался', en: 'The search failed' },
  'search.kindTask': { ru: 'Задачи', en: 'Tasks' },
  'search.kindReview': { ru: 'Ревью', en: 'Reviews' },
  'search.kindAudit': { ru: 'Аудиты', en: 'Audits' },
  'search.kindResearch': { ru: 'Исследования', en: 'Research' },
  'search.kindAsk': { ru: 'Вопросы', en: 'Questions' },
  'search.kindRepo': { ru: 'Репозитории', en: 'Repositories' },
  'search.kindTest': { ru: 'Тесты', en: 'Tests' },
})
