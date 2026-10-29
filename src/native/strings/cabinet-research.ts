import { defineStrings } from '../i18n.ts'

/** Deep research: the list, a thread with its document and dialog, the new research. */
export const S = defineStrings({
  'research.list': { ru: 'Исследования', en: 'Research' },
  'research.new': { ru: 'Новое исследование', en: 'New research' },
  'research.fallbackTitle': { ru: 'Исследование', en: 'Research' },
  'research.empty': { ru: 'Исследований пока нет', en: 'No research yet' },
  'research.emptyText': {
    ru: 'Два ИИ-агента — аналитик и ревьюер — проработают вопрос и подготовят выверенный документ.',
    en: 'Two AI agents — an analyst and a reviewer — work the question through and prepare a verified document.',
  },
  'research.listError': { ru: 'Не удалось загрузить список', en: 'Could not load the list' },
  'research.loadError': {
    ru: 'Не удалось загрузить исследование',
    en: 'Could not load the research',
  },
  'research.stResearching': { ru: 'Идёт исследование…', en: 'Researching…' },
  'research.stWaiting': { ru: 'Ждёт вашего ответа', en: 'Awaits your answer' },
  'research.stWaitingAuthor': { ru: 'Ждёт ответа автора', en: 'Awaits the author' },
  'research.stIdle': { ru: 'Готово', en: 'Done' },
  'research.stError': { ru: 'Ошибка', en: 'Error' },
  'research.commit': { ru: 'коммит {sha}', en: 'commit {sha}' },
  'research.duration': { ru: 'длительность {d}', en: 'duration {d}' },
  'research.pause': { ru: 'Пауза', en: 'Pause' },
  'research.resume': { ru: 'Продолжить', en: 'Continue' },
  'research.stop': { ru: 'Остановить', en: 'Stop' },
  'research.pauseTitle': { ru: 'Приостановить работу?', en: 'Pause the work?' },
  'research.pauseText': {
    ru: 'Работа остановится сразу. «Продолжить» поднимет её с того же места; незакоммиченные правки текущего шага могут потеряться.',
    en: 'Work stops at once. “Continue” picks it up from the same place; uncommitted edits of the current step may be lost.',
  },
  'research.resumeTitle': { ru: 'Продолжить работу?', en: 'Continue the work?' },
  'research.resumeText': {
    ru: 'Исследование продолжится с того места, где было приостановлено.',
    en: 'The research continues from where it was paused.',
  },
  'research.stopTitle': { ru: 'Остановить исследование?', en: 'Stop the research?' },
  'research.stopText': {
    ru: 'Текущий проход будет отменён. Уже собранное останется в документе; следующее сообщение запустит новый проход.',
    en: 'The current pass is cancelled. What is gathered stays in the document; the next message starts a new pass.',
  },
  'research.document': { ru: 'Документ', en: 'Document' },
  'research.preparing': { ru: 'Подготовка документа', en: 'Preparing the document' },
  'research.dialog': { ru: 'Диалог', en: 'Dialog' },
  'research.roleUser': { ru: 'Вы', en: 'You' },
  'research.roleClarify': { ru: 'Аналитик спрашивает', en: 'The analyst asks' },
  'research.roleAnalyst': { ru: 'Аналитик', en: 'Analyst' },
  'research.roleReview': { ru: 'Ревьюер', en: 'Reviewer' },
  'research.roleNote': { ru: 'Заметка', en: 'Note' },
  'research.answerPlaceholder': {
    ru: 'Ответьте на вопрос аналитика…',
    en: 'Answer the analyst’s question…',
  },
  'research.refinePlaceholder': {
    ru: 'Уточнить, дополнить или поправить документ…',
    en: 'Refine, extend or correct the document…',
  },
  'research.waitPass': {
    ru: 'Дождитесь завершения текущего прохода',
    en: 'Wait for the current pass to finish',
  },
  'research.noWrite': {
    ru: 'Уточнять это исследование может его автор или участник с правом менять чужие исследования.',
    en: 'Only the author or a member allowed to change others’ research can refine it.',
  },
  'research.exportTitle': { ru: 'Выгрузить исследование', en: 'Export the research' },
  'research.titleNew': { ru: 'Глубокое исследование', en: 'Deep research' },
  'research.introProject': {
    ru: 'Два ИИ-агента — аналитик и ревьюер — проработают вопрос по коду и подготовят выверенный документ. Вы будете видеть документ по мере правок и сможете его уточнять.',
    en: 'Two AI agents — an analyst and a reviewer — work the question through over the code and prepare a verified document. You see it as it is edited and may refine it.',
  },
  'research.introSpace': {
    ru: 'Два ИИ-агента проработают вопрос по документам и знаниям команды и подготовят выверенный документ. Вы будете видеть документ по мере правок и сможете его уточнять.',
    en: 'Two AI agents work the question through over the documents and team knowledge and prepare a verified document. You see it as it is edited and may refine it.',
  },
  'research.placeholderProject': {
    ru: 'Например: как в проекте организовано получение котировок — какой сервис, протокол, хранение и потребители?',
    en: 'For example: how does the project fetch quotes — which service, protocol, storage and consumers?',
  },
  'research.placeholderSpace': {
    ru: 'Например: какие требования к экспорту отчётов зафиксированы в регламентах и где они расходятся?',
    en: 'For example: which report-export requirements do the rules fix, and where do they diverge?',
  },
  'research.start': { ru: 'Начать исследование', en: 'Start the research' },
  'research.noCreateRight': {
    ru: 'Начать исследование может участник с правом «Создавать исследования»; чужие открываются отсюда.',
    en: 'Starting needs the “Create research” right; others’ research opens from here.',
  },
  'research.noCreateDemo': {
    ru: 'В демо начать исследование нельзя — готовые исследования открываются отсюда.',
    en: 'The demo does not allow new research — the ready ones open from here.',
  },
  'research.deleteTitle': { ru: 'Удалить исследование?', en: 'Delete the research?' },
  'research.deleteText': {
    ru: 'Исследование будет удалено без возможности восстановления.',
    en: 'The research is deleted and cannot be restored.',
  },
})
