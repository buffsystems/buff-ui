// Fake data of the Audits and Repositories stories (#629).
import type {
  AddRepoForm,
  AuditReport,
  AuditRun,
  AuditSection,
  Repo,
  RepoHold,
} from '../../src/native/screens/cabinet/index.ts'

const about: Record<string, [string, string]> = {
  'A-architecture': [
    'A. Кодовая база и архитектура',
    'Как система устроена: слои, домены, компоненты и зависимости.',
  ],
  'B-testability': ['B. Тестируемость', 'Насколько и чем система проверяется; тестовая оснастка.'],
  'C-build-deploy': [
    'C. Сборка, деплой и воспроизводимость',
    'Сборка, деплой и воспроизводимость окружения.',
  ],
  'D-dependencies': ['D. Зависимости и окружение', 'Зависимости и окружение выполнения.'],
  'E-security': ['E. Данные, безопасность и соответствие', 'Данные, безопасность и соответствие.'],
  'F-process': ['F. Процесс разработки и эксплуатация', 'Процесс разработки и эксплуатация.'],
  'G-behavior': [
    'G. Поведение системы',
    'Что система делает и что нельзя ломать: сценарии, необратимые действия.',
  ],
  'H-interface': [
    'H. Интерфейс, дизайн и взаимодействие',
    'Интерфейс, дизайн и взаимодействие с человеком.',
  ],
  'I-constraints': ['I. Ограничения среды', 'Ограничения среды выполнения.'],
  'J-contracts': ['J. Контракты и интеграции', 'Контракты и интеграции с внешним миром.'],
}

function section(
  id: string,
  status: AuditSection['status'],
  extra: Partial<AuditSection> = {},
): AuditSection {
  return { id, title: about[id][0], about: about[id][1], status, ...extra }
}

export const sectionsFresh: AuditSection[] = Object.keys(about).map((id) => section(id, 'missing'))

export const sections: AuditSection[] = [
  section('A-architecture', 'ready', {
    date: '14 окт. 2026',
    behind: [{ module: 'billing-service', commits: 12 }],
  }),
  section('B-testability', 'ready', {
    date: '14 окт. 2026',
    behind: [{ module: 'billing-service', commits: 0 }],
  }),
  section('C-build-deploy', 'ready', { date: '12 окт. 2026' }),
  section('D-dependencies', 'in_progress'),
  section('E-security', 'scheduled'),
  section('F-process', 'ready', {
    date: '12 окт. 2026',
    behind: [{ module: 'web-cabinet', commits: 3 }],
  }),
  section('G-behavior', 'missing'),
  section('H-interface', 'missing'),
  section('I-constraints', 'ready', { date: '10 окт. 2026' }),
  section('J-contracts', 'scheduled'),
]

export const runs: AuditRun[] = [
  {
    id: 'run1',
    sectionIds: ['D-dependencies', 'E-security', 'J-contracts'],
    started: 'запущено сегодня',
  },
]

export const runsPaused: AuditRun[] = [
  {
    id: 'run2',
    sectionIds: ['G-behavior', 'H-interface'],
    started: 'вчера',
    paused: { by: 'anna', when: '1 ч назад' },
  },
]

const content =
  '# A. Кодовая база и архитектура\n\n## Слои\n\nТри слоя: транспорт (`src/api`), домен (`src/payments`, `src/session`), хранилище (`src/db`).\n\n## Риск-зоны\n\n- `src/payments/legacy.ts` — двойная логика провайдеров\n- `src/session/memory.ts` — нет TTL\n\n> Находка A-3: сессии не протухают (`src/session/memory.ts:41`).\n\n## Зависимости между слоями\n\nТранспорт импортирует домен напрямую, домен не знает о хранилище — граница соблюдена. Исключение: `src/api/reports.ts` ходит в `src/db` мимо домена.\n\n## Точки входа\n\n1. `src/index.ts` — HTTP-сервер\n2. `src/worker.ts` — фоновые задачи\n3. `src/cli.ts` — миграции и утилиты\n\n## Рекомендации\n\n- Вынести доступ к БД из `src/api/reports.ts` в домен.\n- Добавить TTL сессиям и тест на протухание.\n- Описать слои в `docs/architecture.md`, чтобы новые модули не нарушали границу.\n\n> Находка A-7: отчёты читают БД напрямую (`src/api/reports.ts:12`).'

export const reportReady: AuditReport = {
  section: sections[0],
  content,
  findings: { open: 3, inProgress: 1, closed: 5 },
  tokens: '1,2 млн токенов · 640 ₽',
}

export const reportInProgress: AuditReport = {
  section: sections[3],
  content: '',
  wip: true,
  findings: { open: 1, inProgress: 2, closed: 0 },
  leadTime: '18 мин',
}

export const reportScheduled: AuditReport = { section: sections[4], content: '' }
export const reportMissing: AuditReport = { section: sections[6], content: '' }

export const repos: Repo[] = [
  {
    name: 'billing-service',
    provider: 'gitlab',
    upstream: 'acme/billing-service',
    defaultBranch: 'main',
    hasToken: true,
    branches: [
      { name: 'main', status: 'behind', ahead: 0, behind: 12 },
      { name: 'develop', status: 'insync', ahead: 0, behind: 0 },
      { name: 'feature/quotes', status: 'missing', ahead: 0, behind: 0 },
      { name: 'hotfix/ttl', status: 'diverged', ahead: 2, behind: 5 },
    ],
    pointer: { branch: 'main', behind: 12, status: 'behind' },
  },
  {
    name: 'web-cabinet',
    provider: 'github',
    upstream: 'acme/web-cabinet',
    defaultBranch: 'main',
    hasToken: true,
    branches: [{ name: 'main', status: 'insync', ahead: 0, behind: 0 }],
    pointer: { branch: 'main', behind: 0, status: 'insync' },
    syncing: true,
  },
  {
    name: 'legacy-tools',
    provider: 'gitea',
    upstream: 'tools/legacy',
    defaultBranch: 'master',
    hasToken: false,
    branches: [],
  },
  {
    name: 'internal-docs',
    defaultBranch: 'main',
    hasToken: false,
    branches: [],
    pointer: { branch: 'main', behind: 0, status: 'unknown' },
  },
  {
    name: 'quotes-feed',
    provider: 'bitbucket',
    upstream: 'acme/quotes-feed',
    defaultBranch: 'main',
    hasToken: true,
    error: 'upstream недоступен: 403',
    branches: [],
  },
]

export const holds: RepoHold[] = [
  {
    task: 141,
    status: 'awaiting',
    merged: 1,
    total: 2,
    repos: [
      { repo: 'billing-service', upstream: 'acme/billing-service', pr: '37', merged: true },
      { repo: 'web-cabinet', upstream: 'acme/web-cabinet', pr: '12', merged: false },
    ],
  },
  {
    task: 133,
    status: 'merged',
    merged: 1,
    total: 1,
    repos: [{ repo: 'web-cabinet', upstream: 'acme/web-cabinet', pr: '9', merged: true }],
  },
]

export const addForm: AddRepoForm = {
  url: 'https://gitlab.com/acme/quotes-feed',
  name: '',
  token: '',
  createDev: true,
  devName: '',
}

export const emptyAddForm: AddRepoForm = {
  url: '',
  name: '',
  token: '',
  createDev: false,
  devName: '',
}
