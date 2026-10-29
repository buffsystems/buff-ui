import { defineStrings, makeTranslate, type Locale } from '../i18n.ts'

/** The ten canonical audit sections (#689): their titles and what each is about, by section
 *  id. The server names a section in Russian; the clients name it in the interface language
 *  and keep the server's title only for an id not listed here. */
const S = defineStrings({
  'auditsec.architecture': {
    ru: 'A. Кодовая база и архитектура',
    en: 'A. Codebase and architecture',
  },
  'auditsec.architectureAbout': {
    ru: 'Как система устроена: слои, домены, компоненты и зависимости.',
    en: 'How the system is built: layers, domains, components and dependencies.',
  },
  'auditsec.testability': { ru: 'B. Тестируемость', en: 'B. Testability' },
  'auditsec.testabilityAbout': {
    ru: 'Насколько и чем система проверяется; тестовая оснастка.',
    en: 'How far and by what the system is checked; the test tooling.',
  },
  'auditsec.buildDeploy': {
    ru: 'C. Сборка, деплой и воспроизводимость',
    en: 'C. Build, deploy and reproducibility',
  },
  'auditsec.buildDeployAbout': {
    ru: 'Сборка, деплой и воспроизводимость окружения.',
    en: 'Build, deploy and a reproducible environment.',
  },
  'auditsec.dependencies': {
    ru: 'D. Зависимости и окружение',
    en: 'D. Dependencies and environment',
  },
  'auditsec.dependenciesAbout': {
    ru: 'Зависимости и окружение выполнения.',
    en: 'Dependencies and the runtime environment.',
  },
  'auditsec.security': {
    ru: 'E. Данные, безопасность и соответствие',
    en: 'E. Data, security and compliance',
  },
  'auditsec.securityAbout': {
    ru: 'Данные, безопасность и соответствие.',
    en: 'Data, security and compliance.',
  },
  'auditsec.process': {
    ru: 'F. Процесс разработки и эксплуатация',
    en: 'F. Development process and operations',
  },
  'auditsec.processAbout': {
    ru: 'Процесс разработки и эксплуатация.',
    en: 'The development process and operations.',
  },
  'auditsec.behavior': { ru: 'G. Поведение системы', en: 'G. System behaviour' },
  'auditsec.behaviorAbout': {
    ru: 'Что система делает и что нельзя ломать: сценарии, необратимые действия.',
    en: 'What the system does and what must not break: scenarios, irreversible actions.',
  },
  'auditsec.interface': {
    ru: 'H. Интерфейс, дизайн и взаимодействие',
    en: 'H. Interface, design and interaction',
  },
  'auditsec.interfaceAbout': {
    ru: 'Интерфейс, дизайн и взаимодействие с человеком.',
    en: 'The interface, design and how people interact with it.',
  },
  'auditsec.constraints': { ru: 'I. Ограничения среды', en: 'I. Environment constraints' },
  'auditsec.constraintsAbout': {
    ru: 'Ограничения среды выполнения.',
    en: 'Constraints of the runtime environment.',
  },
  'auditsec.contracts': {
    ru: 'J. Контракты и интеграции',
    en: 'J. Contracts and integrations',
  },
  'auditsec.contractsAbout': {
    ru: 'Контракты и интеграции с внешним миром.',
    en: 'Contracts and integrations with the outside world.',
  },
})

/** A section id → its title key; the about key is the title key + `About`. */
const KEYS = new Map<string, string>([
  ['A-architecture', S['auditsec.architecture']],
  ['B-testability', S['auditsec.testability']],
  ['C-build-deploy', S['auditsec.buildDeploy']],
  ['D-dependencies', S['auditsec.dependencies']],
  ['E-security', S['auditsec.security']],
  ['F-process', S['auditsec.process']],
  ['G-behavior', S['auditsec.behavior']],
  ['H-interface', S['auditsec.interface']],
  ['I-constraints', S['auditsec.constraints']],
  ['J-contracts', S['auditsec.contracts']],
])

/** A section's title in the interface language; `fallback` (the server's) for an unknown id. */
export function auditSectionTitle(id: string, locale: Locale, fallback: string): string {
  const key = KEYS.get(id)
  return key ? makeTranslate(locale)(key) : fallback
}

/** What a section is about, in the interface language; empty for an unknown id. */
export function auditSectionAbout(id: string, locale: Locale): string {
  const key = KEYS.get(id)
  return key ? makeTranslate(locale)(`${key}About`) : ''
}
