// Fake data of the Buff Code, Notifications and Settings stories (#629): one machine, its
// projects and sessions, a timeline with every part kind, the docks, git, automations, workflows.
import type { Install } from '../../src/native/index.ts'
import type {
  Automation,
  AutomationRun,
  BcAgent,
  BcModel,
  BcProject,
  BcSession,
  BcChangedFile,
  FileNode,
  GitState,
  PermissionRequest,
  BcQuestion,
  SessionDetails,
  SideMessage,
  SlashCommand,
  TimelineItem,
  TrustItem,
  Usage,
  Workflow,
  WorkflowRun,
} from '../../src/native/screens/buffcode/index.ts'
import type { NotificationEntry } from '../../src/native/screens/notifications/index.ts'

export const machine: Install = {
  id: 'mac',
  kind: 'machine',
  name: 'MacBook Pro',
  status: { kind: 'online' },
  attention: 2,
  homeInstall: 'Acme',
}
export const offline = { kind: 'offline', since: '14:20' } as const
export const serviceDown = { kind: 'serviceDown' } as const
export const blockedEe = { kind: 'blockedEe' } as const
export const repair = { kind: 'repair' } as const

export const projects: BcProject[] = [
  {
    id: 'billing',
    name: 'billing-service',
    path: '~/work/billing-service',
    branch: 'feature/142-pdf-export',
    sessions: 7,
    lastActive: '5 мин назад',
  },
  {
    id: 'site',
    name: 'site',
    path: '~/work/site',
    branch: 'main',
    sessions: 3,
    lastActive: 'вчера',
  },
  { id: 'infra', name: 'infra-scripts', path: '~/work/infra', sessions: 0 },
]

export const sessions: BcSession[] = [
  {
    id: 's1',
    projectId: 'billing',
    title: 'Экспорт отчётов в PDF',
    origin: 'window',
    when: '5 мин назад',
    group: 'today',
    running: true,
    attention: 1,
  },
  {
    id: 's2',
    projectId: 'billing',
    title: 'Починить миграцию 0042',
    origin: 'phone',
    when: '40 мин назад',
    group: 'today',
  },
  {
    id: 's3',
    projectId: 'billing',
    title: 'bun run migrate — почему падает на CI',
    origin: 'console',
    when: '2 ч назад',
    group: 'today',
  },
  {
    id: 's4',
    projectId: 'billing',
    title: 'Рефакторинг InvoiceBuilder',
    origin: 'window',
    when: 'вчера, 18:12',
    group: 'yesterday',
  },
  {
    id: 's5',
    projectId: 'billing',
    title: 'Тесты на округление',
    origin: 'console',
    when: 'вчера, 11:03',
    group: 'yesterday',
  },
  {
    id: 's6',
    projectId: 'billing',
    title: 'Настройка eslint',
    origin: 'window',
    when: '12 окт',
    group: 'older',
  },
  {
    id: 's7',
    projectId: 'billing',
    title: 'Первая сессия',
    origin: 'window',
    when: '3 окт',
    group: 'older',
  },
]

export const models: BcModel[] = [
  { id: 'claude-sonnet', name: 'Claude Sonnet 5.5', provider: 'Anthropic' },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI' },
  { id: 'qwen', name: 'Qwen3 Coder', provider: 'Ollama · локально' },
]
export const agents: BcAgent[] = [
  { id: 'build', name: 'build' },
  { id: 'plan', name: 'plan' },
  { id: 'reviewer', name: 'reviewer' },
]

export const timeline: TimelineItem[] = [
  {
    kind: 'user',
    id: 'u1',
    text: 'Добавь экспорт отчёта в PDF. Кнопка на странице отчёта, файл формируется на сервере.',
    when: '14:02',
  },
  {
    kind: 'tool',
    id: 't1',
    tool: 'read',
    title: 'src/reports/page.tsx',
    status: 'done',
    detail: '142 строки',
  },
  {
    kind: 'tool',
    id: 't2',
    tool: 'grep',
    title: 'generatePdf|@react-pdf',
    status: 'done',
    detail: '3 совпадения',
    output: 'src/lib/pdf.ts:12\nsrc/reports/export.ts:4\npackage.json:31',
  },
  {
    kind: 'assistant',
    id: 'a1',
    model: 'Claude Sonnet 5.5',
    markdown:
      'В проекте уже есть `src/lib/pdf.ts` с обёрткой над **@react-pdf/renderer**. План:\n\n1. Эндпоинт `POST /reports/:id/pdf`\n2. Кнопка «Скачать PDF» на странице отчёта\n3. Тест на формирование файла\n\n```ts\nexport async function exportReport(id: string) {\n  return renderToBuffer(<Report id={id} />)\n}\n```',
  },
  {
    kind: 'tool',
    id: 't3',
    tool: 'edit',
    title: 'src/reports/export.ts',
    status: 'done',
    detail: '+24 −2',
  },
  {
    kind: 'tool',
    id: 't4',
    tool: 'bash',
    title: 'bun test src/reports',
    status: 'error',
    detail: 'exit 1',
    output: '✗ exportReport renders a PDF\n  TypeError: fontkit is not a function',
  },
  {
    kind: 'error',
    id: 'e1',
    text: 'Тест упал: fontkit не найден в окружении. Нужна установка зависимости.',
  },
  { kind: 'compaction', id: 'c1', when: '14:20' },
  {
    kind: 'background',
    id: 'b1',
    tasks: [
      { title: 'bun install fontkit', status: 'running' },
      { title: 'subagent: тесты округления', status: 'done' },
    ],
  },
  {
    kind: 'user',
    id: 'u2',
    text: 'Ок, ставь. Вот макет кнопки.',
    when: '14:31',
    attachments: [{ id: 'f1', name: 'button.png', size: 184320, kind: 'image' }],
  },
  {
    kind: 'assistant',
    id: 'a2',
    model: 'Claude Sonnet 5.5',
    markdown: 'Ставлю `fontkit` и повторяю тест…',
    streaming: true,
  },
]

export const permission: PermissionRequest = {
  title: 'bun run migrate',
  hint: 'Запуск команды в терминале проекта',
  patterns: ['bun run migrate', 'cwd: ~/work/billing-service'],
  alwaysNote: '«Всегда» разрешит команды bun run * в этом проекте до конца сессии.',
}
export const permissionEdit: PermissionRequest = {
  title: 'Правка файла вне проекта',
  patterns: ['~/.zshrc'],
  diffFile: '~/.zshrc',
  subagent: true,
}
export const questions: BcQuestion[] = [
  {
    text: 'Какой провайдер платежей основной?',
    options: [
      { value: 'stripe', label: 'Stripe', hint: 'уже подключён в проекте' },
      { value: 'yookassa', label: 'ЮKassa' },
      { value: 'both', label: 'Оба, по региону' },
    ],
  },
  {
    text: 'Какие отчёты экспортировать?',
    multiple: true,
    options: [
      { value: 'inv', label: 'Счета' },
      { value: 'acts', label: 'Акты' },
      { value: 'sum', label: 'Сводка' },
    ],
  },
]

export const changes: BcChangedFile[] = [
  {
    path: 'src/reports/export.ts',
    status: 'modified',
    added: 24,
    removed: 2,
    diff: [
      '@@ -1,6 +1,28 @@',
      " import { renderToBuffer } from '@react-pdf/renderer'",
      "+import { Report } from './Report'",
      '+',
      '+export async function exportReport(id: string) {',
      '+  return renderToBuffer(<Report id={id} />)',
      '+}',
      '-export const todo = true',
      ' // end',
    ],
  },
  {
    path: 'src/reports/Report.tsx',
    status: 'added',
    added: 61,
    removed: 0,
    diff: [
      '+export function Report({ id }: { id: string }) {',
      '+  return <Document>…</Document>',
      '+}',
    ],
  },
  {
    path: 'src/lib/legacy-pdf.ts',
    status: 'deleted',
    added: 0,
    removed: 40,
    diff: ['-export function legacyPdf() {}'],
  },
]
export const files: FileNode[] = [
  { path: 'src', name: 'src', kind: 'dir', depth: 0 },
  { path: 'src/lib', name: 'lib', kind: 'dir', depth: 1 },
  { path: 'src/lib/pdf.ts', name: 'pdf.ts', kind: 'file', depth: 2 },
  { path: 'src/reports', name: 'reports', kind: 'dir', depth: 1 },
  { path: 'src/reports/export.ts', name: 'export.ts', kind: 'file', depth: 2 },
  { path: 'src/reports/page.tsx', name: 'page.tsx', kind: 'file', depth: 2 },
  { path: 'package.json', name: 'package.json', kind: 'file', depth: 0 },
  { path: 'README.md', name: 'README.md', kind: 'file', depth: 0 },
]
export const terminal = [
  '$ bun test src/reports',
  '✓ InvoiceBuilder rounds half-up (3 ms)',
  '! ✗ exportReport renders a PDF',
  '  TypeError: fontkit is not a function',
  '$ bun add fontkit',
  'Resolving dependencies',
  'Saved lockfile',
  '+ fontkit@2.0.4',
]
export const usage: Usage = {
  cost: '$0.42',
  percent: 63,
  tokens: { input: 88210, output: 6120, cache: 41000, reasoning: 2210 },
  turns: [
    { title: 'Добавь экспорт отчёта в PDF', tokens: 42100, cost: '$0.18' },
    { title: 'Ок, ставь. Вот макет кнопки.', tokens: 31400, cost: '$0.14' },
    { title: 'Сжатие контекста', tokens: 12000, cost: '$0.10' },
  ],
}
export const git: GitState = {
  branch: 'feature/142-pdf-export',
  ahead: 2,
  behind: 0,
  changes: [
    { path: 'src/reports/export.ts', status: 'modified' },
    { path: 'src/reports/Report.tsx', status: 'added' },
    { path: 'src/lib/legacy-pdf.ts', status: 'deleted' },
  ],
  branches: ['main', 'feature/142-pdf-export', 'feature/137-session-cache'],
  history: [
    { hash: 'a3f9c12', subject: 'feat(reports): PDF export endpoint #142', when: '2 ч назад' },
    { hash: '91be0d4', subject: 'test(reports): rounding cases', when: 'вчера' },
    { hash: '7c21e88', subject: 'chore: eslint config', when: '12 окт' },
  ],
}
export const gitClean: GitState = {
  branch: 'main',
  ahead: 0,
  behind: 0,
  changes: [],
  branches: ['main'],
  history: [],
}
export const trust: TrustItem[] = [
  { id: 'h1', kind: 'hook', title: 'pre-commit: lint', note: '.buff/hooks/pre-commit.json' },
  { id: 'c1', kind: 'command', title: '/release', note: 'вставка !`git describe`' },
]
export const side: SideMessage[] = [
  { id: 'm1', role: 'user', text: 'Почему fontkit не подхватился?' },
  {
    id: 'm2',
    role: 'assistant',
    text: 'Пакет стоит как **devDependency**, а тест запускается с `NODE_ENV=production` — зависимости dev не ставятся. Перенесите его в `dependencies`.',
    tools: ['read', 'grep'],
  },
]
export const details: SessionDetails = {
  directory: '~/work/billing-service',
  branch: 'feature/142-pdf-export',
  baseBranch: 'main',
  origin: 'window',
  created: 'сегодня, 14:02',
  mcp: [
    { name: 'buff-knowledge', ok: true },
    { name: 'playwright', ok: false },
  ],
  lsp: ['typescript', 'eslint'],
}
export const automations: Automation[] = [
  {
    id: 'au1',
    title: 'Утренний отчёт о коммитах',
    schedule: 'Ежедневно в 09:00',
    next: 'завтра 09:00',
    paused: false,
    runs: 14,
    last: 'сегодня 09:00 · готов',
    state: 'idle',
  },
  {
    id: 'au2',
    title: 'Проверка зависимостей',
    schedule: 'Пн, Чт в 07:30',
    next: 'чт 07:30',
    paused: false,
    runs: 6,
    last: 'идёт',
    state: 'running',
  },
  {
    id: 'au3',
    title: 'Чистка логов',
    schedule: '1-го числа в 03:00',
    paused: true,
    runs: 2,
    last: '1 окт · сбой',
    state: 'idle',
  },
  {
    id: 'au4',
    title: 'Сводка по issue',
    schedule: 'Ежедневно в 18:00',
    next: 'сегодня 18:00',
    paused: false,
    runs: 9,
    last: 'ждёт ответа',
    state: 'waiting',
  },
]
export const automationRuns: AutomationRun[] = [
  {
    id: 'r1',
    when: 'сегодня 09:00',
    source: 'schedule',
    status: 'done',
    summary: 'REPORT.md обновлён, 12 коммитов',
  },
  {
    id: 'r2',
    when: 'вчера 09:00',
    source: 'schedule',
    status: 'done',
    summary: 'REPORT.md обновлён, 4 коммита',
  },
  {
    id: 'r3',
    when: 'вчера 15:12',
    source: 'manual',
    status: 'failed',
    summary: 'git fetch: нет сети',
  },
]
export const workflows: Workflow[] = [
  {
    id: 'w1',
    name: 'release',
    description: 'Собирает changelog, поднимает версию, создаёт тег и пушит.',
    whenToUse: 'перед выпуском версии',
    args: [
      { name: 'version', type: 'string', required: true, description: 'semver, например 1.4.0' },
      { name: 'dryRun', type: 'boolean', required: false },
    ],
    lastRun: 'вчера · готов',
  },
  {
    id: 'w2',
    name: 'audit-deps',
    description: 'Проверяет уязвимости зависимостей и предлагает обновления.',
    args: [
      {
        name: 'maxAge',
        type: 'number',
        required: false,
        description: 'дней с последнего обновления',
      },
    ],
  },
  {
    id: 'w3',
    name: 'onboarding-doc',
    description: 'Пишет документ для нового разработчика по структуре репозитория.',
    whenToUse: 'после крупного рефакторинга',
    args: [],
  },
]
export const workflowRuns: WorkflowRun[] = [
  {
    id: 'wr1',
    label: 'release 1.4.0',
    workflow: 'release',
    state: 'running',
    elapsed: '4 мин 12 с',
    tokens: { total: 128400, input: 96000, output: 8400, cache: 24000 },
    files: { added: 1, modified: 3, deleted: 0, linesAdded: 86, linesDeleted: 12 },
    phases: [
      { title: 'Собрать changelog', status: 'done', actor: 'writer' },
      { title: 'Поднять версию', status: 'done' },
      { title: 'Прогнать тесты', status: 'running', actor: 'tester' },
      { title: 'Создать тег и запушить', status: 'running' },
    ],
    waiting: [{ actor: 'tester' }],
    questions: [
      { id: 'q1', actor: 'writer', text: 'Включать в changelog внутренние рефакторинги?' },
    ],
    artifacts: [{ name: 'CHANGELOG.md', version: 2 }],
    log: [
      '$ git log --oneline v1.3.0..HEAD',
      '14 коммитов',
      '$ bun test',
      '! 1 тест упал: округление',
      'жду разрешения tester',
    ],
  },
  {
    id: 'wr2',
    label: 'audit-deps',
    workflow: 'audit-deps',
    state: 'done',
    elapsed: '1 мин 40 с',
    tokens: { total: 31000, input: 24000, output: 3000, cache: 4000 },
    files: { added: 0, modified: 1, deleted: 0, linesAdded: 4, linesDeleted: 4 },
    phases: [
      { title: 'bun audit', status: 'done' },
      { title: 'Предложить обновления', status: 'done' },
    ],
    artifacts: [{ name: 'audit.md', version: 1 }],
    result: '## Итог\n\nУязвимостей: **2** (обе средние). Обновлены `fontkit` и `undici`.',
    log: ['$ bun audit', '2 vulnerabilities (2 moderate)'],
  },
  {
    id: 'wr3',
    label: 'Исправить миграцию',
    state: 'failed',
    elapsed: '12 с',
    tokens: { total: 4000, input: 3500, output: 500, cache: 0 },
    files: { added: 0, modified: 0, deleted: 0, linesAdded: 0, linesDeleted: 0 },
    phases: [{ title: 'Прочитать миграцию', status: 'error' }],
    log: ['! ENOENT: migrations/0042.sql'],
    amended: true,
  },
]
export const commands: SlashCommand[] = [
  { name: 'new', description: 'Новая сессия', source: 'builtin' },
  { name: 'compact', description: 'Сжать контекст сессии', source: 'builtin' },
  { name: 'undo', description: 'Отменить последний ход', source: 'builtin' },
  { name: 'release', description: 'Выпустить версию (команда проекта)', source: 'project' },
  { name: 'review-pr', description: 'Проверить открытый MR по чеклисту', source: 'project' },
  { name: 'tdd', description: 'Навык: сначала красный тест', source: 'skill' },
  { name: 'reviewer', description: 'Агент-ревьюер: только читает и комментирует', source: 'agent' },
]
export const notifications: NotificationEntry[] = [
  {
    id: 'n1',
    installId: 'mac',
    installName: 'MacBook Pro',
    type: 'bc_permission',
    title: 'bun run migrate — разрешить?',
    body: 'billing-service · Экспорт отчётов в PDF',
    when: '12 мин',
    read: false,
    source: 'stream',
    target: 'сессия',
  },
  {
    id: 'n2',
    installId: 'acme',
    installName: 'Acme',
    type: 'gate_ready',
    title: '#142 Экспорт отчётов в PDF',
    body: 'Формулировка готова к согласованию',
    when: '25 мин',
    read: false,
    source: 'stream',
  },
  {
    id: 'n3',
    installId: 'acme',
    installName: 'Acme',
    type: 'review_needed',
    title: '!37 Кэш сессий',
    when: '2 ч',
    read: true,
    source: 'stream',
  },
  {
    id: 'n4',
    installId: 'mac',
    installName: 'MacBook Pro',
    type: 'bc_turn_complete',
    title: 'Починить миграцию 0042 — агент закончил',
    when: '3 ч',
    read: true,
    source: 'local',
  },
  {
    id: 'n5',
    installId: 'ce-office',
    installName: 'Buff Community · офис',
    type: 'research_done',
    title: 'Сравнение очередей сообщений',
    when: 'вчера',
    read: true,
    source: 'local',
  },
  {
    id: 'n6',
    installId: 'acme',
    installName: 'Acme',
    type: 'custom_future_type',
    title: 'Тип, которого телефон ещё не знает',
    when: 'вчера',
    read: true,
    source: 'stream',
  },
]
