// Fake data of the Knowledge base stories (#629): entries of every type and state, a pass.
import type {
  KnowledgeEntry,
  KnowledgeForm,
  KnowledgePass,
} from '../../src/native/screens/cabinet/index.ts'

export const entries: KnowledgeEntry[] = [
  {
    id: 'k1',
    name: 'migracii-tolko-fajlami',
    title: 'Миграции только через файлы',
    description:
      'Любое изменение схемы — новый нумерованный файл миграции, никогда не правка применённого',
    type: 'rule',
    body: '## Правило\n\nСхема меняется **только** миграцией: `sql/NNN_*.sql`, идемпотентной и аддитивной.\n\n- `CREATE TABLE IF NOT EXISTS`\n- `ADD COLUMN IF NOT EXISTS`\n\nСвязи: [[stend-address]]',
    pinned: true,
    permanent: true,
    needsReview: false,
    author: 'anna',
    authorAi: false,
    updated: '14.10.2026',
  },
  {
    id: 'k2',
    name: 'stend-address',
    title: 'Стенд живёт на stage.example.com',
    description: 'Адрес стенда, где проверяем релизы, и кто туда ходит',
    type: 'fact',
    body: 'Стенд: `stage.example.com`, админка на `:8150`. Доступ по VPN.',
    project: 'billing-service',
    pinned: false,
    permanent: false,
    needsReview: true,
    reviewNote: 'ИИ не уверен, что порт админки не менялся после релиза 0.19',
    author: 'buff',
    authorAi: true,
    updatedBy: 'ivan',
    updated: '15.10.2026',
  },
  {
    id: 'k3',
    name: 'sborka-trebuet-tulcheyn',
    title: 'Сборка требует тулчейн',
    description: 'Без установленного тулчейна сборка молча падает — как понять и что ставить',
    type: 'pitfall',
    body: 'Симптом: `make build` выходит с кодом 0 и пустым `dist/`. Лечение: `make toolchain`.',
    project: 'billing-service',
    task: 139,
    pinned: false,
    permanent: false,
    needsReview: false,
    author: 'buff',
    authorAi: true,
    updated: '16.10.2026',
  },
  {
    id: 'k4',
    name: 'staryj-api-do-v2',
    title: 'Старый API держим до v2',
    description: 'Клиенты v1 живут до релиза v2; ломать контракт нельзя',
    type: 'rule',
    body: 'Контракт v1 заморожен.',
    pinned: false,
    permanent: false,
    needsReview: false,
    author: 'petr',
    authorAi: false,
    updated: '01.10.2026',
    archived: { by: 'anna', when: '12.10.2026', reason: 'v2 вышла' },
  },
]

export const passDone: KnowledgePass = {
  status: 'done',
  boundary: 'task',
  ref: '141',
  started: '16.10.26, 11:00',
  finished: '16.10.26, 11:14',
  added: 2,
  updated: 1,
  merged: 0,
  archived: 0,
  flagged: 1,
  tokens: 184_000,
  time: '14 мин',
}

export const passRunning: KnowledgePass = {
  status: 'running',
  boundary: 'audit',
  ref: '',
  started: '16.10.26, 14:02',
  added: 0,
  updated: 0,
  merged: 0,
  archived: 0,
  flagged: 0,
}

export const passPaused: KnowledgePass = {
  ...passRunning,
  paused: { by: 'anna', when: '5 мин назад' },
}

export const passFailed: KnowledgePass = {
  ...passDone,
  status: 'failed',
  boundary: 'manual',
  ref: 'anna',
  error: 'лимит токенов',
  added: 0,
  updated: 0,
  flagged: 0,
}

export const form: KnowledgeForm = {
  title: 'Сборка требует тулчейн',
  name: 'sborka-trebuet-tulcheyn',
  description: 'Без установленного тулчейна сборка молча падает — как понять и что ставить',
  type: 'pitfall',
  scope: 'billing-service',
  body: 'Симптом: `make build` выходит с кодом 0 и пустым `dist/`.\n\nЛечение: `make toolchain`.',
  pinned: false,
  permanent: false,
}

export const emptyForm: KnowledgeForm = {
  title: '',
  name: '',
  description: '',
  type: 'rule',
  scope: '',
  body: '',
  pinned: false,
  permanent: false,
}
