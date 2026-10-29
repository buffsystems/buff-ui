// Fake data of the Development stories (#629): tasks at every stage, one task in full.
import type {
  ChangedFile,
  HistoryEvent,
  RepoBranchPick,
  TaskDetail,
  TaskRow,
  TestEntry,
} from '../../src/native/screens/cabinet/index.ts'

export const tasks: TaskRow[] = [
  {
    number: 142,
    title: 'Экспорт отчётов в PDF',
    state: 'open',
    stage: { index: 1, id: 'formulation', stopped: false },
    subtasksTotal: 0,
    subtasksDone: 0,
    updated: 'сегодня, 14:02',
  },
  {
    number: 141,
    title: 'Кэш сессий в Redis',
    state: 'open',
    stage: { index: 4, id: 'review', stopped: false },
    subtasksTotal: 5,
    subtasksDone: 5,
    openFindings: 2,
    costRub: 1240,
    filesTotal: 14,
    linesAdded: 412,
    linesDeleted: 88,
    updated: 'сегодня, 11:40',
  },
  {
    number: 139,
    title: 'Миграция платежей на новый провайдер',
    state: 'open',
    stage: { index: 3, id: 'development', stopped: false },
    subtasksTotal: 8,
    subtasksDone: 3,
    step: 'sync',
    costRub: 3870,
    filesTotal: 31,
    linesAdded: 1204,
    linesDeleted: 310,
    updated: 'вчера, 19:12',
  },
  {
    number: 137,
    title: 'Подготовка инструментов разработки',
    state: 'open',
    stage: { index: 3, id: 'development', stopped: true },
    devprep: true,
    subtasksTotal: 2,
    subtasksDone: 1,
    updated: 'вчера, 09:30',
  },
  {
    number: 133,
    title: 'Тёмная тема в кабинете',
    state: 'closed',
    stage: { index: 6, id: 'merged', stopped: false },
    subtasksTotal: 4,
    subtasksDone: 4,
    costRub: 980,
    filesTotal: 22,
    linesAdded: 640,
    linesDeleted: 120,
    updated: '14 окт',
  },
  {
    number: 130,
    title: 'Черновик: уведомления в Telegram',
    state: 'open',
    stage: { index: 0, id: 'request', stopped: false },
    draft: true,
    subtasksTotal: 0,
    subtasksDone: 0,
    updated: '12 окт',
  },
  {
    number: 128,
    title: 'Переезд на Postgres 17',
    state: 'closed',
    stage: { index: 1, id: 'formulation', stopped: false, rejected: true },
    subtasksTotal: 0,
    subtasksDone: 0,
    updated: '9 окт',
  },
]

export const taskClarify: TaskDetail = {
  ...tasks[0],
  phase: 'clarify',
  stageNotes: { request: 'сегодня, 13:50', formulation: 'ждёт вашего ответа' },
  postanovka:
    '# Экспорт отчётов в PDF\n\nПользователь должен скачивать отчёт по проекту в PDF (A4) из кабинета.\n\n- кнопка «PDF» рядом с «MD»\n- сохранять шрифты и тему',
  attachments: [
    { id: 'f1', name: 'макет-экспорта.png', size: 212_000, kind: 'image' },
    { id: 'f2', name: 'требования.docx', size: 48_000, kind: 'file' },
  ],
  questions: [
    {
      id: 'q1',
      header: 'Какой движок рендера',
      text: 'Рендерить PDF **на сервере** или в браузере?',
      options: [
        { label: 'На сервере', description: 'puppeteer в воркере', recommended: true },
        { label: 'В браузере', description: 'print-to-pdf' },
      ],
    },
    {
      id: 'q2',
      header: 'Что включать',
      text: 'Какие разделы попадают в PDF?',
      multiSelect: true,
      options: [{ label: 'Постановка' }, { label: 'Формулировка' }, { label: 'Декомпозиция' }],
    },
  ],
  clarifications: [],
  subtasks: [],
  exportable: true,
  stepElapsed: '4 мин',
}

export const taskGate: TaskDetail = {
  ...taskClarify,
  phase: 'gate',
  questions: undefined,
  stageNotes: { request: 'сегодня, 13:50', formulation: 'ждёт вашего ответа' },
  formulation:
    '## Формулировка\n\nДобавить серверный экспорт отчёта в PDF (A4) через воркер; кнопка «PDF» рядом с «MD».\n\n1. эндпоинт `POST /export/pdf`\n2. очередь рендера\n3. кнопка в кабинете',
  clarifications: [
    { topic: 'рендер', question: 'На сервере или в браузере?', answer: 'На сервере' },
    { topic: 'состав', question: 'Какие разделы?', answer: 'Постановка; Формулировка' },
  ],
}

export const taskRunning: TaskDetail = {
  ...tasks[2],
  phase: 'implementing',
  stageNotes: {
    request: '12 окт',
    formulation: 'утверждена 13 окт',
    decomposition: 'подзадач: 8 · 13 окт',
    development: '3 из 8 выполнено',
  },
  postanovka: 'Перевести платежи на нового провайдера без простоя.',
  attachments: [],
  formulation: 'Миграция платежей: адаптер провайдера, двойная запись, переключение флагом.',
  clarifications: [{ topic: 'провайдер', question: 'Какой основной?', answer: 'CloudPayments' }],
  decompositionReport: '- адаптер\n- двойная запись\n- флаг\n- миграция данных',
  inProgress: [
    { number: 1393, title: 'Адаптер провайдера', stage: 'Разработка' },
    { number: 1394, title: 'Двойная запись', stage: 'Тестирование и CI' },
  ],
  subtasks: [
    { number: 1391, title: 'Схема БД', state: 'done' },
    { number: 1392, title: 'Контракт API', state: 'done' },
    { number: 1393, title: 'Адаптер провайдера', state: 'active', stage: 'Разработка' },
    { number: 1394, title: 'Двойная запись', state: 'active', stage: 'Тестирование и CI' },
    { number: 1395, title: 'Переключение флагом', state: 'waiting' },
  ],
  metrics: {
    filesTotal: 31,
    filesAdded: 9,
    filesModified: 20,
    filesDeleted: 2,
    linesAdded: 1204,
    linesDeleted: 310,
    costRub: 3870,
    tokensIn: 2_140_000,
    tokensOut: 310_000,
    time: { value: '2 д 4 ч', note: 'с момента заявки', live: true },
  },
  exportable: true,
  stepElapsed: '12 мин',
}

export const taskPaused: TaskDetail = {
  ...taskRunning,
  paused: { by: 'anna', reason: 'user', when: '2 ч назад' },
}

export const changedFiles: ChangedFile[] = [
  { path: 'src/payments/adapter.ts', kind: 'added', add: 212, del: 0 },
  { path: 'src/payments/service.ts', kind: 'modified', add: 84, del: 31 },
  { path: 'src/payments/legacy.ts', kind: 'deleted', add: 0, del: 140 },
  { path: 'test/payments.test.ts', kind: 'modified', add: 96, del: 12 },
  { path: '.buff/tools/ci.yml', kind: 'modified', add: 4, del: 1, outside: true },
]

export const diffLines = [
  '@@ -12,7 +12,9 @@ export class PaymentService {',
  '   constructor(private readonly repo: PaymentRepo) {}',
  '',
  '-  async charge(order: Order) {',
  '-    return legacyCharge(order)',
  '+  async charge(order: Order): Promise<Receipt> {',
  '+    const adapter = this.adapterFor(order.provider)',
  '+    return adapter.charge(order)',
  '   }',
]

export const tests: TestEntry[] = [
  { file: 'test/payments.test.ts', case: 'charges an order', status: 'active' },
  { file: 'test/payments.test.ts', case: 'refunds', status: 'active' },
  {
    file: 'test/legacy.test.ts',
    case: '*',
    status: 'disabled',
    scope: 'permanent',
    reason: 'модуль удалён',
  },
  {
    file: 'test/flags.test.ts',
    case: 'switches provider',
    status: 'disabled',
    scope: 'task',
    reason: 'ждёт подзадачу #1395',
  },
]

export const history: HistoryEvent[] = [
  { id: 'h1', tone: 'action', title: 'Ревью ждёт решения', when: '2 ч назад', unread: true },
  { id: 'h2', tone: 'success', title: 'Подзадача #1392 закрыта', when: 'вчера', count: 2 },
  { id: 'h3', tone: 'info', title: 'Задача декомпозирована на 8 подзадач', when: '13 окт' },
  { id: 'h4', tone: 'error', title: 'Конфликт слияния в #1391', when: '13 окт' },
  { id: 'h5', tone: 'neutral', title: 'Формулировка утверждена', when: '13 окт' },
]

export const repoPicks: RepoBranchPick[] = [
  { name: 'billing-service', branches: ['main', 'develop'], defaultBranch: 'main' },
  { name: 'web-cabinet', branches: ['main'], defaultBranch: 'main' },
  { name: 'legacy-tools', branches: [], defaultBranch: 'master', empty: true },
]
