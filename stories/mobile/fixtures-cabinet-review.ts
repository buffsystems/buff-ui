// Fake data of the Review stories (#629): the queue and one review with everything in it.
import type {
  ApproveRepo,
  Finding,
  Review,
  ReviewQueueRow,
} from '../../src/native/screens/cabinet/index.ts'

export const queue: ReviewQueueRow[] = [
  { number: 141, title: 'Кэш сессий в Redis', openFindings: 2, since: 'сегодня, 11:40' },
  { number: 136, title: 'Фильтр задач по статусу', openFindings: 0, since: 'вчера' },
  { number: 134, title: 'Экспорт аудита в Markdown', openFindings: 1, since: '14 окт' },
]

export const findings: Finding[] = [
  {
    id: 'f1',
    title: 'TTL сессии не сбрасывается при продлении',
    detail:
      'В `session.ts` при `touch()` TTL не обновляется — сессия протухнет через час активности.',
    source: 'model',
    status: 'approved',
  },
  {
    id: 'f2',
    title: 'Нет теста на реконнект к Redis',
    source: 'user',
    status: 'pending',
  },
  {
    id: 'f3',
    title: 'Переименовать `SessStore` в `SessionStore`',
    source: 'model',
    status: 'rejected',
  },
  {
    id: 'f4',
    title: 'Утечка соединений в пуле',
    detail: 'Исправлено в #1412.',
    source: 'model',
    status: 'resolved',
  },
]

export const review: Review = {
  task: 141,
  title: 'Кэш сессий в Redis',
  phase: 'review',
  since: 'сегодня, 11:40',
  prs: [
    {
      repo: 'billing-service',
      number: 37,
      title: 'Задача #141: кэш сессий',
      add: 412,
      del: 88,
      files: [
        { path: 'src/session/store.ts', status: 'added', add: 180, del: 0 },
        { path: 'src/session/middleware.ts', status: 'modified', add: 64, del: 22 },
        { path: 'src/session/memory.ts', status: 'deleted', add: 0, del: 60 },
        {
          path: 'src/session/types.ts',
          oldPath: 'src/session/model.ts',
          status: 'renamed',
          add: 4,
          del: 2,
        },
        { path: 'docs/session.png', status: 'binary', add: 0, del: 0 },
      ],
    },
    {
      repo: 'web-cabinet',
      number: 12,
      title: 'Задача #141: индикатор сессии',
      add: 40,
      del: 6,
      files: [{ path: 'src/screens/Session.tsx', status: 'modified', add: 40, del: 6 }],
    },
  ],
  superproject: {
    summary: 'Обновлены версии модулей `billing-service` и `web-cabinet`.',
    files: 2,
    add: 2,
    del: 2,
  },
  findings,
  checks: {
    build: { status: 'passed', duration: '1 мин 12 с' },
    tests: { status: 'passed', hasLog: true, duration: '3 мин 4 с', runs: 2 },
    inventory: { before: 212, after: 219, added: 7, reenabled: 0 },
    findings: { open: 2, resolved: 1, total: 4 },
  },
  publishTargets: ['GitLab · acme/billing-service'],
}

export const reviewFailed: Review = {
  ...review,
  landError: 'ветка task/141 отстаёт от main на 12 коммитов',
  checks: {
    build: { status: 'passed', duration: '58 с' },
    tests: { status: 'failed', hasLog: true, duration: '2 мин 10 с' },
    inventory: { before: 212, after: 210, added: 0, reenabled: 0 },
    findings: { open: 2, resolved: 1, total: 4 },
  },
}

export const reviewClosed: Review = {
  ...review,
  phase: 'none',
  closed: true,
  prs: [],
  superproject: undefined,
  findings: findings.map((f) => ({
    ...f,
    status: f.status === 'rejected' ? 'rejected' : 'resolved',
  })),
  checks: undefined,
  publishTargets: [],
}

export const approveRepos: ApproveRepo[] = [
  {
    repo: 'billing-service',
    provider: 'gitlab',
    upstream: 'acme/billing-service',
    defaultBranch: 'main',
    access: 'ok',
  },
  {
    repo: 'web-cabinet',
    provider: 'github',
    upstream: 'acme/web-cabinet',
    defaultBranch: 'main',
    branch: 'develop',
    access: 'noToken',
  },
  { repo: 'internal-tools', defaultBranch: 'main', access: 'ok' },
]
