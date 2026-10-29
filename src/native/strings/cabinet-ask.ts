import { defineStrings } from '../i18n.ts'

/** Ask: the threads, a thread, the new question, the model picker. */
export const S = defineStrings({
  'ask.threads': { ru: 'Вопросы и ответы', en: 'Questions and answers' },
  'ask.new': { ru: 'Новый вопрос', en: 'New question' },
  'ask.fallbackTitle': { ru: 'Вопрос', en: 'Question' },
  'ask.waitingYou': { ru: 'Ждёт вашего ответа', en: 'Awaits your answer' },
  'ask.busy': { ru: 'В работе', en: 'In progress' },
  'ask.empty': { ru: 'Вопросов пока нет', en: 'No questions yet' },
  'ask.emptyText': {
    ru: 'Buff читает исходники и отвечает — только чтение, без изменений.',
    en: 'Buff reads the sources and answers — read only, no changes.',
  },
  'ask.listError': { ru: 'Не удалось загрузить список', en: 'Could not load the list' },
  'ask.threadError': { ru: 'Не удалось загрузить диалог', en: 'Could not load the thread' },
  'ask.notFound': { ru: 'Диалог не найден', en: 'Thread not found' },
  'ask.notFoundText': {
    ru: 'Возможно, он был удалён или ссылка неверна.',
    en: 'It may have been deleted, or the link is wrong.',
  },
  'ask.thinking': { ru: 'Buff думает…', en: 'Buff is thinking…' },
  'ask.reasoning': { ru: 'размышления', en: 'reasoning' },
  'ask.reasoningTrail': { ru: 'Ход рассуждений', en: 'Reasoning' },
  'ask.collapse': { ru: 'свернуть', en: 'collapse' },
  'ask.answerPending': { ru: 'Ответьте на вопрос выше', en: 'Answer the question above' },
  'ask.followUp': { ru: 'Задать уточняющий вопрос', en: 'Ask a follow-up' },
  'ask.followUpReview': { ru: 'Продолжить разбор изменений…', en: 'Continue the change review…' },
  'ask.noWrite': {
    ru: 'Продолжить этот диалог может его автор или участник с правом менять чужие диалоги.',
    en: 'Only the author or a member allowed to change others’ threads can continue it.',
  },
  'ask.mergedNote': {
    ru: 'Задача влита: новые обсуждения не открываются, прошедшие доступны на чтение.',
    en: 'The task is merged: no new discussions; past ones are read-only.',
  },
  'ask.you': { ru: 'Вы', en: 'You' },
  'ask.assistant': { ru: 'Buff', en: 'Buff' },
  'ask.titleProject': { ru: 'Спросить про проект', en: 'Ask about the project' },
  'ask.titleSpace': { ru: 'Спросить в пространстве', en: 'Ask in the space' },
  'ask.titleReview': {
    ru: 'Разбор изменений с ассистентом',
    en: 'Review the changes with the assistant',
  },
  'ask.introProject': {
    ru: 'Вопрос по коду, аудиту, git или задачам проекта. Buff читает исходники и отвечает — только чтение, без изменений.',
    en: 'A question about the code, the audit, git or the tasks. Buff reads the sources and answers — read only, no changes.',
  },
  'ask.introSpace': {
    ru: 'Вопрос по документам, регламентам и знаниям команды. Buff читает подключённые источники и базу знаний и отвечает — только чтение, без изменений.',
    en: 'A question about the documents, rules and team knowledge. Buff reads the connected sources and the knowledge base — read only, no changes.',
  },
  'ask.introReview': {
    ru: 'Обсудите изменения с ассистентом: нестыковки с постановкой, расхождения между модулями, упущенные случаи и риски регрессии. Заметив проблему, он предложит замечание к ревью.',
    en: 'Discuss the changes with the assistant: mismatches with the statement, gaps between modules, missed cases and regression risks. On a problem it proposes a review finding.',
  },
  'ask.placeholderProject': { ru: 'Ваш вопрос о проекте', en: 'Your question about the project' },
  'ask.placeholderSpace': {
    ru: 'Ваш вопрос по документам и знаниям команды',
    en: 'Your question about the documents and team knowledge',
  },
  'ask.placeholderReview': {
    ru: 'Соответствуют ли изменения постановке? Что упущено или может сломаться?',
    en: 'Do the changes match the statement? What is missed or may break?',
  },
  'ask.noCreateRight': {
    ru: 'Задавать вопросы может участник с правом «Задавать вопросы»; чужие диалоги открываются отсюда.',
    en: 'Asking needs the “Ask questions” right; others’ threads open from here.',
  },
  'ask.noCreateDemo': {
    ru: 'В демо задавать вопросы нельзя — готовые вопросы и ответы открываются отсюда.',
    en: 'The demo does not allow questions — the ready ones open from here.',
  },
  'ask.attachHint': { ru: 'До 3 файлов по 10 МБ', en: 'Up to 3 files of 10 MB' },
  'ask.now': { ru: 'Сейчас: {model}', en: 'Now: {model}' },
  'ask.context': { ru: 'контекст {k}K', en: 'context {k}K' },
  'ask.renamePlaceholder': { ru: 'Новое название', en: 'New title' },
  'ask.deleteTitle': { ru: 'Удалить диалог?', en: 'Delete the thread?' },
  'ask.deleteText': {
    ru: 'Диалог будет удалён без возможности восстановления.',
    en: 'The thread is deleted and cannot be restored.',
  },
})
