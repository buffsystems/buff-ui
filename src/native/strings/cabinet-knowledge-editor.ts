import { defineStrings } from '../i18n.ts'

/** Knowledge base: the editor. */
export const S = defineStrings({
  'kbe.new': { ru: 'Новое знание', en: 'New knowledge' },
  'kbe.edit': { ru: 'Изменить знание', en: 'Edit the knowledge' },
  'kbe.intro': {
    ru: 'Расскажите модели то, чего она не узнает из кода: как у вас принято работать, как устроен проект, обо что здесь спотыкаются.',
    en: 'Tell the model what it cannot learn from the code: how you work, how the project is built, what trips people up.',
  },
  'kbe.conflict': {
    ru: 'Знание успели поправить, пока вы его редактировали. Ниже — текущая версия автора «{by}»; ваш текст остался в форме.',
    en: 'The knowledge was changed while you edited it. Below is the current version by “{by}”; your text stays in the form.',
  },
  'kbe.takeCurrent': {
    ru: 'Взять текущую версию как основу',
    en: 'Take the current version as the base',
  },
  'kbe.overwrite': { ru: 'Перезаписать поверх', en: 'Overwrite' },
  'kbe.title': { ru: 'Заголовок', en: 'Title' },
  'kbe.titlePlaceholder': { ru: 'Например: {example}', en: 'For example: {example}' },
  'kbe.bodyPlaceholder': { ru: '{example}…\n\n[[имя-записи]]', en: '{example}…\n\n[[entry-name]]' },
  'kbe.exampleRuleTitle': {
    ru: 'Миграции только через файлы',
    en: 'Migrations only through files',
  },
  'kbe.exampleRuleDescription': {
    ru: 'Любое изменение схемы — новый файл миграции',
    en: 'Every schema change is a new migration file',
  },
  'kbe.exampleFactTitle': {
    ru: 'Стенд живёт на stage.example.com',
    en: 'The stand lives at stage.example.com',
  },
  'kbe.exampleFactDescription': {
    ru: 'Адрес и доступ к стенду, где проверяем релизы',
    en: 'Address of and access to the stand where releases are checked',
  },
  'kbe.examplePitfallTitle': { ru: 'Сборка требует тулчейн', en: 'The build needs the toolchain' },
  'kbe.examplePitfallDescription': {
    ru: 'Без установленного тулчейна сборка молча падает',
    en: 'Without the toolchain installed the build fails silently',
  },
  'kbe.name': { ru: 'Адрес записи', en: 'Entry address' },
  'kbe.nameHint': {
    ru: 'Короткое имя, по которому запись видна модели: латиницей, строчными, слова через дефис. Складывается из заголовка, пока вы его не поправите.',
    en: 'A short name the model sees the entry by: latin, lowercase, words joined with dashes. Derived from the title until you edit it.',
  },
  'kbe.description': { ru: 'Описание одной строкой', en: 'One-line description' },
  'kbe.descriptionHint': {
    ru: 'Эту строку модель видит всегда и по ней решает, открыть ли запись целиком.',
    en: 'The model always sees this line and decides by it whether to open the whole entry.',
  },
  'kbe.type': { ru: 'Тип', en: 'Type' },
  'kbe.scope': { ru: 'Область', en: 'Scope' },
  'kbe.scopeOrg': { ru: 'Вся организация', en: 'The whole organisation' },
  'kbe.scopeTask': { ru: 'Задача #{n} в проекте {project}', en: 'Task #{n} in project {project}' },
  'kbe.scopeHint': {
    ru: 'Знание организации учитывается во всех проектах; знание проекта — только в нём.',
    en: 'Organisation knowledge applies in every project; project knowledge only in its own.',
  },
  'kbe.scopeTaskHint': {
    ru: 'Знание задачи видят только её прогоны, и оно уходит в архив, когда задача закрыта.',
    en: 'Task knowledge is seen only by its runs and is archived when the task closes.',
  },
  'kbe.body': { ru: 'Текст записи', en: 'Entry text' },
  'kbe.bodyHint': {
    ru: 'Что именно нужно знать, как это проверить и что делать. Можно форматировать разметкой Markdown.',
    en: 'What exactly to know, how to check it and what to do. Markdown allowed.',
  },
  'kbe.preview': { ru: 'Предпросмотр', en: 'Preview' },
  'kbe.editText': { ru: 'Редактировать', en: 'Edit' },
  'kbe.noText': { ru: 'Текста пока нет.', en: 'No text yet.' },
  'kbe.secret': {
    ru: 'В тексте что-то похоже на секрет — токен, пароль или ключ. В базу знаний секреты не пишем: она уходит в промпт модели.',
    en: 'Something in the text looks like a secret — a token, password or key. Secrets do not go into the knowledge base: it goes into the model prompt.',
  },
  'kbe.pin': {
    ru: 'Показывать модели сразу, не дожидаясь запроса',
    en: 'Show the model at once, without a request',
  },
  'kbe.pinHint': {
    ru: 'Модель получит эту запись целиком в каждой задаче. Каждая такая запись увеличивает расход.',
    en: 'The model gets this entry in full in every task. Each such entry raises the spend.',
  },
  'kbe.permanent': { ru: 'Перманентная', en: 'Permanent' },
  'kbe.permanentHint': {
    ru: 'ИИ не сможет изменить эту запись или убрать её в архив — только вы.',
    en: 'The AI cannot change or archive this entry — only you.',
  },
})
