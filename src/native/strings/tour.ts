import { defineStrings } from '../i18n.ts'

/** The first-launch tour (#931): four story cards — Buff Code, the knowledge base, development,
 *  how to connect — and the words of the little scenes drawn on them. Russian compounds carry
 *  a word joiner (U+2060) after the hyphen: a title must not wrap as «QR-» / «коду», and the
 *  brand face has no non-breaking hyphen of its own. */
export const S = defineStrings({
  'tour.tagline': {
    ru: 'ИИ-агенты пишут код — решаете вы',
    en: 'AI agents write the code — you decide',
  },
  'tour.skip': { ru: 'Пропустить', en: 'Skip' },
  'tour.next': { ru: 'Дальше', en: 'Next' },
  'tour.back': { ru: 'Назад', en: 'Back' },
  'tour.pause': { ru: 'Пауза', en: 'Pause' },
  'tour.play': { ru: 'Продолжить', en: 'Play' },
  'tour.card': { ru: 'Карточка {n} из {total}', en: 'Card {n} of {total}' },
  'tour.connect': { ru: 'Подключить', en: 'Connect' },
  'tour.replay': { ru: 'Знакомство с Buff', en: 'A tour of Buff' },
  'tour.replayHint': { ru: 'Четыре карточки о приложении', en: 'Four cards about the app' },

  'tour.codeTitle': { ru: 'Buff Code — с телефона', en: 'Buff Code from your phone' },
  'tour.codeText': {
    ru: 'Агент работает на вашем компьютере. Отвечайте ему и разрешайте команды откуда угодно.',
    en: 'The agent runs on your computer. Answer it and allow its commands from anywhere.',
  },
  'tour.knowledgeTitle': { ru: 'База знаний команды', en: 'Your team’s knowledge base' },
  'tour.knowledgeText': {
    ru: 'Правила, факты и ловушки ваших проектов. Их читают и агенты, и вы.',
    en: 'The rules, facts and pitfalls of your projects. Agents read them, and so do you.',
  },
  'tour.devTitle': { ru: 'Решения принимаете вы', en: 'You make the decisions' },
  'tour.devText': {
    ru: 'Агенты пишут и проверяют код. Вы утверждаете задачу и одобряете результат.',
    en: 'Agents write and check the code. You approve the task and the result.',
  },
  'tour.pairTitle': { ru: 'Подключение — по QR-⁠коду', en: 'Connect with a QR code' },
  'tour.pairText': {
    ru: 'Отсканируйте код из Buff Code или из веб-⁠кабинета Buff.',
    en: 'Scan the code in Buff Code or in the Buff web app.',
  },
  'tour.pairDemo': {
    ru: 'Или посмотрите демо — без регистрации.',
    en: 'Or try the demo — no sign-up.',
  },

  'tour.sceneAsks': { ru: 'Агент просит разрешение', en: 'The agent asks permission' },
  'tour.sceneAllow': { ru: 'Разрешить', en: 'Allow' },
  'tour.sceneDeny': { ru: 'Отклонить', en: 'Deny' },
  'tour.sceneReply': { ru: 'Тесты прошли: 42 из 42', en: 'Tests passed: 42 of 42' },
  'tour.sceneRule': { ru: 'Правило', en: 'Rule' },
  'tour.sceneRuleText': { ru: 'Миграции — только файлами', en: 'Migrations go in files only' },
  'tour.sceneFact': { ru: 'Факт', en: 'Fact' },
  'tour.sceneFactText': { ru: 'Поиск живёт в notes-api', en: 'Search lives in notes-api' },
  'tour.scenePitfall': { ru: 'Ловушка', en: 'Pitfall' },
  'tour.scenePitfallText': { ru: 'Тесты ждут запущенную базу', en: 'Tests need the database up' },
  'tour.sceneTask': { ru: 'Поиск: без учёта регистра', en: 'Search: ignore letter case' },
  'tour.sceneInReview': { ru: 'На ревью', en: 'In review' },
  'tour.sceneBuild': { ru: 'Сборка прошла', en: 'Build passed' },
  'tour.sceneTests': { ru: 'Тесты прошли', en: 'Tests passed' },
  'tour.sceneApprove': { ru: 'Одобрить', en: 'Approve' },
})
