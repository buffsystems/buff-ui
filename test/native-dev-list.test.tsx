// @vitest-environment jsdom
// «Разработка» on the phone (#644): the project the list belongs to, and the sheet to pick another.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  DevListScreen,
  ICON_NAMES,
  NativeProvider,
  ProjectPickerSheet,
  type IconSet,
  type ShellProps,
} from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const shell: ShellProps = {
  install: { id: 'a', kind: 'saas', name: 'Acme', status: { kind: 'online' }, attention: 0 },
}

test('the task list names its project in its heading; it is picked in the drawer (#696)', () => {
  render(
    wrap(
      <DevListScreen
        shell={shell}
        status={{ kind: 'online' }}
        tasks={[]}
        project={{ id: 'shop', name: 'shop' }}
      />,
    ),
  )
  expect(screen.getByText(/^shop · /)).toBeTruthy()
  expect(screen.queryByRole('button', { name: /Проект разработки: shop/ })).toBeNull()
})

test('the project sheet lists the projects and marks the current one', () => {
  const chosen: string[] = []
  render(
    wrap(
      <ProjectPickerSheet
        projects={[
          { id: 'shop', name: 'shop' },
          { id: 'api', name: 'api' },
        ]}
        currentId="shop"
        onSelect={(id) => chosen.push(id)}
      />,
    ),
  )
  expect(screen.getByText('Выберите проект')).toBeTruthy()
  fireEvent.click(screen.getByText('api'))
  expect(chosen).toEqual(['api'])
})

test('a typed answer, rework note and reject reason reach the screen', async () => {
  const { QuestionForm, ReworkSheet, RejectSheet } = await import('../src/native/index.ts')
  const typed: string[] = []
  render(
    wrap(
      <>
        <QuestionForm
          title="Вопросы"
          sendLabel="Ответить"
          questions={[{ id: 'q0', text: 'Регистр?' }]}
          onFree={(id, text) => typed.push(`${id}:${text}`)}
        />
        <ReworkSheet onNote={(text) => typed.push(`note:${text}`)} />
        <RejectSheet onReason={(text) => typed.push(`reason:${text}`)} />
      </>,
    ),
  )
  const fields = screen.getAllByRole('textbox')
  fireEvent.change(fields[0]!, { target: { value: 'без регистра' } })
  fireEvent.change(fields[1]!, { target: { value: 'короче' } })
  fireEvent.change(fields[2]!, { target: { value: 'не нужно' } })
  expect(typed).toEqual(['q0:без регистра', 'note:короче', 'reason:не нужно'])
})

test('the statement of a new task reaches the screen', async () => {
  const { CreateTaskScreen } = await import('../src/native/index.ts')
  const typed: string[] = []
  render(wrap(<CreateTaskScreen status={{ kind: 'online' }} onStatement={(s) => typed.push(s)} />))
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Экспорт в CSV' } })
  expect(typed).toEqual(['Экспорт в CSV'])
})

test('a new project is named and offered from the project sheet', async () => {
  const { AddDevProjectSheet } = await import('../src/native/index.ts')
  const named: string[] = []
  let added = 0
  render(
    wrap(
      <>
        <AddDevProjectSheet repos={[]} picked={{}} onName={(n) => named.push(n)} />
        <ProjectPickerSheet projects={[]} onAdd={() => added++} />
      </>,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText('my-app'), { target: { value: 'notes' } })
  fireEvent.click(screen.getByRole('button', { name: 'Новый проект' }))
  expect([named, added]).toEqual([['notes'], 1])
})

test('repositories that could not be read are not «none»', async () => {
  const { AddDevProjectSheet } = await import('../src/native/index.ts')
  render(wrap(<AddDevProjectSheet repos={[]} picked={{}} reposError="Нет связи с установкой" />))
  expect(screen.getByText('Нет связи с установкой')).toBeTruthy()
  expect(screen.queryByText(/No repositories|Нет доступных репозиториев/)).toBeNull()
})

test('the baseline gate offers the three answers, and only to whom may decide', async () => {
  const { BaselinePanel } = await import('../src/native/index.ts')
  const chosen: string[] = []
  render(
    wrap(
      <BaselinePanel
        invite="Сломаны **2** теста"
        onIgnoreTask={() => chosen.push('task')}
        onPermanent={() => chosen.push('permanent')}
        onLater={() => chosen.push('later')}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Игнорировать на задачу' }))
  fireEvent.click(screen.getByRole('button', { name: 'В постоянный игнор' }))
  fireEvent.click(screen.getByRole('button', { name: 'Отложить задачу до починки' }))
  expect(chosen).toEqual(['task', 'permanent', 'later'])
  cleanup()
  render(wrap(<BaselinePanel invite="" canDecide={false} />))
  expect(screen.queryByRole('button', { name: 'Игнорировать на задачу' })).toBeNull()
})

test('subtasks read as the execution scheme: by wave, each saying what it waits for', async () => {
  const { TaskDetailScreen } = await import('../src/native/index.ts')
  const task = {
    number: 5,
    title: 'T',
    state: 'open' as const,
    stage: { index: 3, id: 'development' as const, stopped: false, rejected: false },
    subtasksTotal: 2,
    subtasksDone: 1,
    updated: '',
    phase: 'implementing' as const,
    stageNotes: {},
    postanovka: '',
    attachments: [],
    clarifications: [],
    exportable: false,
    subtasks: [
      { number: 6, title: 'индекс', state: 'done' as const, wave: 1 },
      { number: 7, title: 'поиск', state: 'active' as const, wave: 2, after: [6] },
    ],
  }
  render(wrap(<TaskDetailScreen status={{ kind: 'online' }} task={task} tab="subtasks" />))
  expect(screen.getByText('Волна 1')).toBeTruthy()
  expect(screen.getByText('Волна 2')).toBeTruthy()
  expect(screen.getByText(/после #6/)).toBeTruthy()
})

test('search: the query and the kinds reach the screen, a hit opens', async () => {
  const { SearchScreen } = await import('../src/native/index.ts')
  const seen: string[] = []
  render(
    wrap(
      <SearchScreen
        status={{ kind: 'online' }}
        query="кэш"
        hits={[
          {
            id: 'task:3',
            kind: 'task',
            title: 'Кэширование ответов API',
            subtitle: 'buff-demo / dev_project · #3',
          },
        ]}
        onQuery={(q) => seen.push(`q:${q}`)}
        onToggleKind={(k) => seen.push(`k:${k}`)}
        onOpen={(id) => seen.push(`open:${id}`)}
      />,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText(/Задачи, ревью/), { target: { value: 'кэши' } })
  fireEvent.click(screen.getByRole('button', { name: 'Ревью' }))
  fireEvent.click(screen.getByRole('button', { name: 'Кэширование ответов API' }))
  expect(seen).toEqual(['q:кэши', 'k:review', 'open:task:3'])
})

test('a project’s tests say when they were taken and refresh on demand', async () => {
  const { ProjectTestsScreen } = await import('../src/native/index.ts')
  let refreshed = 0
  render(
    wrap(
      <ProjectTestsScreen
        status={{ kind: 'online' }}
        project="dev_project"
        tests={[{ file: 'search.test.ts', case: 'trims', status: 'active' }]}
        capturedAt="23 окт., 14:10"
        failure="make: *** No rule to make target"
        onRefresh={() => refreshed++}
      />,
    ),
  )
  expect(screen.getByText('Список снят 23 окт., 14:10')).toBeTruthy()
  expect(screen.getByText(/Последний снимок не удался/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Обновить список тестов' }))
  expect(refreshed).toBe(1)
})

test('a run card carries the spending ceiling warning when one is given', async () => {
  const { TaskDetailScreen } = await import('../src/native/index.ts')
  const task = {
    number: 5,
    title: 'T',
    state: 'open' as const,
    stage: { index: 3, id: 'development' as const, stopped: false, rejected: false },
    subtasksTotal: 0,
    subtasksDone: 0,
    updated: '',
    phase: 'implementing' as const,
    stageNotes: {},
    postanovka: '',
    attachments: [],
    clarifications: [],
    exportable: false,
    subtasks: [],
  }
  render(
    wrap(
      <TaskDetailScreen status={{ kind: 'online' }} task={task} notice="Достигнут лимит расхода" />,
    ),
  )
  expect(screen.getByText('Достигнут лимит расхода')).toBeTruthy()
})

test('ask: the follow-up, a new question, a rename and «only mine» reach the screen', async () => {
  const { AskListScreen, AskThreadScreen, NewQuestionScreen, RenameSheet } =
    await import('../src/native/index.ts')
  const seen: string[] = []
  const thread = {
    id: 't',
    author: 'ivan',
    status: 'idle' as const,
    updated: '',
    project: 'shop',
    messages: [],
  }
  render(
    wrap(
      <>
        <AskListScreen
          shell={shell}
          status={{ kind: 'online' }}
          threads={[]}
          mine={false}
          onMine={(m) => seen.push(`mine:${m}`)}
        />
        <AskThreadScreen
          status={{ kind: 'online' }}
          thread={thread}
          cost="12 ₽"
          onDraft={(d) => seen.push(`draft:${d}`)}
        />
        <NewQuestionScreen
          status={{ kind: 'online' }}
          kind="project"
          place="shop"
          onText={(q) => seen.push(`q:${q}`)}
        />
        <RenameSheet onValue={(v) => seen.push(`title:${v}`)} />
      </>,
    ),
  )
  fireEvent.click(screen.getByRole('tab', { name: 'Мои' }))
  const boxes = screen.getAllByRole('textbox')
  fireEvent.change(boxes[0]!, { target: { value: 'ещё' } })
  fireEvent.change(boxes[1]!, { target: { value: 'как?' } })
  fireEvent.change(boxes[2]!, { target: { value: 'кэш' } })
  expect(seen).toEqual(['mine:true', 'draft:ещё', 'q:как?', 'title:кэш'])
  expect(screen.getByText('shop · 12 ₽')).toBeTruthy()
})

test('a task card leaves no dash for what is unknown, nor repeats its chip (#691)', () => {
  const { container } = render(
    wrap(
      <DevListScreen
        shell={shell}
        status={{ kind: 'online' }}
        tasks={[
          {
            number: 2,
            title: 'Инкрементальная индексация',
            state: 'open',
            stage: { index: 1, id: 'formulation', stopped: true },
            subtasksTotal: 0,
            subtasksDone: 0,
            updated: '12 дн назад',
          },
        ]}
      />,
    ),
  )
  expect(screen.getByText('12 дн назад')).toBeTruthy()
  expect(screen.getAllByText('Прогон отменён').length).toBeGreaterThan(0)
  expect(container.textContent).not.toContain('—')
  expect(container.textContent).not.toContain('прогон отменён')
})
