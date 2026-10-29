import { defineStrings } from '../i18n.ts'

/** The app's own settings: installs, theme, language, about, the demo install. */
export const S = defineStrings({
  'settings.title': { ru: 'Настройки', en: 'Settings' },
  'settings.installs': { ru: 'Установки', en: 'Installs' },
  'settings.installsHint': {
    ru: 'Переименовать, сопрячь заново или удалить с телефона',
    en: 'Rename, pair again or remove from the phone',
  },
  'settings.noInstalls': { ru: 'Установок нет', en: 'No installs' },
  'settings.app': { ru: 'Приложение', en: 'App' },
  'settings.theme': { ru: 'Тема', en: 'Theme' },
  'settings.themeLight': { ru: 'Светлая', en: 'Light' },
  'settings.themeDark': { ru: 'Тёмная', en: 'Dark' },
  'settings.themeSystem': { ru: 'Как в системе', en: 'System' },
  'settings.language': { ru: 'Язык', en: 'Language' },
  'settings.langRu': { ru: 'Русский', en: 'Russian' },
  'settings.langEn': { ru: 'English', en: 'English' },
  'settings.about': { ru: 'О приложении', en: 'About' },
  'settings.version': { ru: 'Версия', en: 'Version' },
  'settings.licences': { ru: 'Лицензии сторонних компонентов', en: 'Third-party licences' },
  'settings.privacy': { ru: 'Политика конфиденциальности', en: 'Privacy policy' },
  'settings.diagnostics': { ru: 'Экспорт диагностики', en: 'Export diagnostics' },
  'settings.diagnosticsHint': {
    ru: 'Журнал без секретов — для поддержки',
    en: 'The log without secrets — for support',
  },
  'settings.demo': { ru: 'Демо-установка', en: 'Demo install' },
  'settings.demoTitle': { ru: 'Посмотреть на демо', en: 'Try the demo' },
  'settings.demoText': {
    ru: 'Подключите демонстрационную установку buff.systems: готовые проекты, задачи и сессии Buff Code — без регистрации.',
    en: 'Connect the buff.systems demo install: ready projects, tasks and Buff Code sessions — no sign-up.',
  },
  'settings.demoConnect': { ru: 'Подключить демо', en: 'Connect the demo' },
  'settings.demoConnecting': { ru: 'Подключаем…', en: 'Connecting…' },
  'settings.demoConnected': { ru: 'Демо подключено', en: 'Demo connected' },
  'settings.demoConnectedText': {
    ru: 'Демо-установка появилась на главном экране.',
    en: 'The demo install is on the Home screen.',
  },
  'settings.demoNote': {
    ru: 'Данные демо общие для всех и только для чтения: изменить в демо ничего нельзя.',
    en: 'Demo data is shared by everyone and read-only: nothing can be changed in the demo.',
  },
  'settings.demoFailed': {
    ru: 'Демо недоступно — проверьте интернет и повторите.',
    en: 'The demo is unavailable — check the internet and retry.',
  },
  'settings.installName': { ru: 'Имя установки', en: 'Install name' },
  'settings.renameHint': { ru: 'Только на этом телефоне', en: 'On this phone only' },
  'settings.fingerprint': { ru: 'Отпечаток ключа', en: 'Key fingerprint' },
  'settings.fingerprintHint': {
    ru: 'По нему администратор или поддержка узнают, к какой установке подключён телефон',
    en: 'It tells an administrator or support which install this phone is paired with',
  },
  'settings.pairedAs': { ru: 'Подключено как', en: 'Paired as' },
  'settings.pairedSince': { ru: 'Сопряжено', en: 'Paired' },
  'settings.phoneName': { ru: 'Имя телефона', en: 'Phone name' },
  'settings.remove': { ru: 'Удалить с телефона', en: 'Remove from the phone' },
  'settings.removeTitle': { ru: 'Удалить {name}?', en: 'Remove {name}?' },
  'settings.removeText': {
    ru: 'Телефон отключится от установки, а её данные будут стёрты с телефона. Подключить снова можно новым кодом.',
    en: 'The phone disconnects from the install and its data is wiped from the phone. A new code pairs it again.',
  },
  'settings.notifications': { ru: 'Уведомления', en: 'Notifications' },
})
