import { defineStrings } from '../i18n.ts'

/** What another app shared with Buff (#943): where it goes, and the bar while it is in hand. */
export const S = defineStrings({
  'incoming.title': { ru: 'Куда отправить', en: 'Send to' },
  'incoming.what': { ru: 'Что отправляем', en: 'What is sent' },
  'incoming.where': { ru: 'Подключение', en: 'Connection' },
  'incoming.more': { ru: 'и ещё {n}', en: 'and {n} more' },
  'incoming.reading': { ru: 'Читаем файлы…', en: 'Reading the files…' },
  'incoming.failed': {
    ru: 'Не удалось прочитать то, чем поделились.',
    en: 'Could not read what was shared.',
  },
  'incoming.askHint': {
    ru: 'Диалог из списка или новый вопрос',
    en: 'A dialog from the list or a new question',
  },
  'incoming.researchHint': {
    ru: 'Исследование из списка или новое',
    en: 'A research from the list or a new one',
  },
  'incoming.taskHint': {
    ru: 'Файлы и текст попадут в постановку',
    en: 'The files and the text go into the statement',
  },
  'incoming.machineHint': {
    ru: 'Проект, затем сессия из списка или новая',
    en: 'A project, then a session from the list or a new one',
  },
  'incoming.files': { ru: 'Файлов: {n}', en: 'Files: {n}' },
  'incoming.text': { ru: 'Текст', en: 'Text' },
  'incoming.filesAndText': { ru: 'Файлов: {n} и текст', en: 'Files: {n} and text' },
  'incoming.barHint': {
    ru: 'Откройте диалог — вложение добавится',
    en: 'Open a dialog — it gets attached',
  },
  'incoming.choose': { ru: 'Выбрать, куда отправить', en: 'Choose where to send' },
  'incoming.cancel': { ru: 'Не отправлять', en: 'Do not send' },
})
