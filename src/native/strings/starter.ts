import { defineStrings } from '../i18n.ts'

/** Nothing paired yet (#745): where to get Buff Code and Buff Community, and the demo in one tap. */
export const S = defineStrings({
  'starter.title': { ru: 'С чего начать', en: 'Where to start' },
  'starter.buffCode': { ru: 'Buff Code', en: 'Buff Code' },
  'starter.buffCodeText': {
    ru: 'Агент на вашем компьютере: окно и консоль. Подключите телефон из его окна или командой /phone.',
    en: 'The agent on your computer: a window and a console. Connect the phone from its window or with /phone.',
  },
  'starter.community': { ru: 'Buff Community', en: 'Buff Community' },
  'starter.communityText': {
    ru: 'Установка для вашей команды на своём сервере. Телефон подключается из её кабинета.',
    en: 'An install for your team on your own server. The phone connects from its cabinet.',
  },
  'starter.site': { ru: 'Сайт', en: 'Website' },
  'starter.github': { ru: 'GitHub', en: 'GitHub' },
  'starter.demo': { ru: 'Посмотреть на демо', en: 'Try the demo' },
  'starter.demoText': {
    ru: 'Готовые проекты, задачи и сессии Buff Code на buff.systems — без регистрации, только чтение.',
    en: 'Ready projects, tasks and Buff Code sessions on buff.systems — no sign-up, read-only.',
  },
})
