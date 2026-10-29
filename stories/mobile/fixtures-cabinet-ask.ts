// Fake data of the Ask and Research stories (#629).
import type {
  AskThread,
  AskThreadRow,
  Research,
  ResearchRow,
} from '../../src/native/screens/cabinet/index.ts'

export const threads: AskThreadRow[] = [
  {
    id: 't1',
    title: 'Какой провайдер платежей основной?',
    author: 'anna',
    status: 'waiting',
    updated: 'сегодня, 14:02',
  },
  {
    id: 't2',
    title: 'Где хранятся сессии?',
    author: 'ivan',
    status: 'answering',
    updated: 'сегодня, 13:40',
  },
  {
    id: 't3',
    title: 'Как устроен деплой на стенд',
    author: 'anna',
    status: 'idle',
    updated: 'вчера, 18:10',
  },
  { id: 't4', author: 'petr', status: 'error', updated: '14 окт' },
  {
    id: 't5',
    title: 'Что делает воркер уведомлений',
    author: 'anna',
    status: 'idle',
    updated: '12 окт',
  },
]

export const thread: AskThread = {
  ...threads[2],
  project: 'Acme · billing-service',
  messages: [
    {
      id: 'm1',
      role: 'user',
      content: 'Как устроен деплой на стенд? Какие шаги и где лежат конфиги?',
      attachments: [{ id: 'a1', name: 'deploy.log', size: 18_400, kind: 'file' }],
    },
    {
      id: 'm2',
      role: 'assistant',
      reasoning: 'Ищу Makefile и compose-файлы, смотрю CI.',
      content:
        '## Деплой на стенд\n\nДеплой идёт через `make deploy CONFIG=stand`:\n\n1. сборка образа\n2. `docker compose up -d`\n3. миграции\n\nКонфиги лежат в `deploy/stand/`.',
      attachments: [{ id: 'a2', name: 'schema.png', size: 96_000, kind: 'image' }],
    },
    { id: 'm3', role: 'user', content: 'А откат?' },
    {
      id: 'm4',
      role: 'assistant',
      content:
        'Откат — `make rollback`: поднимает предыдущий тег образа, миграции вниз не катятся.',
    },
  ],
}

export const threadThinking: AskThread = {
  ...threads[1],
  project: 'Acme · billing-service',
  messages: [{ id: 'm1', role: 'user', content: 'Где хранятся сессии?' }],
  elapsed: '0:42',
  liveReasoning: 'Смотрю middleware/session.ts и redis-клиент…',
}

export const threadWaiting: AskThread = {
  ...threads[0],
  project: 'Acme · billing-service',
  messages: [
    { id: 'm1', role: 'user', content: 'Какой провайдер платежей основной?' },
    {
      id: 'm2',
      role: 'assistant',
      content: 'В коде два провайдера. Уточните, про какой режим речь.',
      questions: [
        {
          id: 'q1',
          header: 'Режим',
          text: 'Прод или песочница?',
          options: [{ label: 'Прод', recommended: true }, { label: 'Песочница' }],
        },
      ],
    },
  ],
}

export const researches: ResearchRow[] = [
  {
    id: 'r1',
    title: 'Сравнение очередей сообщений',
    author: 'anna',
    status: 'researching',
    updated: 'сегодня, 14:05',
  },
  {
    id: 'r2',
    title: 'Как получаются котировки',
    author: 'ivan',
    status: 'waiting',
    updated: 'сегодня, 12:10',
  },
  { id: 'r3', title: 'Архитектура биллинга', author: 'anna', status: 'idle', updated: '15 окт' },
  { id: 'r4', author: 'petr', status: 'error', updated: '11 окт' },
]

const document =
  '# Как получаются котировки\n\n## Источники\n\nКотировки приходят от двух поставщиков по WebSocket и складываются в `quotes` через `QuoteIngester`.\n\n## Потребители\n\n- биллинг — раз в минуту\n- витрина — по подписке\n\n> Ревьюер: проверить, что при обрыве соединения нет дыр в ряду.\n\n```ts\nconst feed = new QuoteFeed(providers)\n```'

export const researchRunning: Research = {
  ...researches[0],
  project: 'Acme · billing-service',
  document: '',
  dialog: [
    {
      id: 'd1',
      role: 'user',
      body: 'Сравнить очереди сообщений для событий биллинга.',
      when: '14:00',
    },
  ],
  baseCommit: 'a1b2c3d',
  timer: '4 м 12 с',
  progressNote: 'Аналитик читает исходники…',
}

export const researchWaiting: Research = {
  ...researches[1],
  project: 'Acme · billing-service',
  document,
  dialog: [
    {
      id: 'd1',
      role: 'user',
      body: 'Как в проекте организовано получение котировок?',
      when: '11:50',
    },
    { id: 'd2', role: 'analyst', body: 'Набросал первую версию документа.', when: '12:02' },
    {
      id: 'd3',
      role: 'clarify',
      body: '',
      when: '12:10',
      questions: [
        {
          id: 'q1',
          header: 'Глубина',
          text: 'Разбирать и **ретраи** при обрыве соединения?',
          options: [{ label: 'Да', recommended: true }, { label: 'Нет, только happy path' }],
        },
      ],
    },
  ],
  baseCommit: 'a1b2c3d',
  timer: '18 м 40 с',
}

export const researchDone: Research = {
  ...researches[2],
  project: 'Acme · billing-service',
  document,
  dialog: [
    { id: 'd1', role: 'user', body: 'Опиши архитектуру биллинга.', when: '15 окт, 10:00' },
    {
      id: 'd2',
      role: 'review',
      body: 'Не хватает раздела про идемпотентность.',
      when: '15 окт, 10:40',
    },
    { id: 'd3', role: 'analyst', body: 'Добавил раздел.', when: '15 окт, 10:52' },
    { id: 'd4', role: 'note', body: 'Документ согласован с командой.', when: '15 окт, 12:00' },
  ],
  baseCommit: 'f0e1d2c',
  timer: '52 м 3 с',
}

export const researchPaused: Research = {
  ...researchRunning,
  paused: { by: 'anna', reason: 'balance', when: '10 мин назад' },
}
