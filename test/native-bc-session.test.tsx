// @vitest-environment jsdom
// Buff Code on the phone (#652): the agent's questions one at a time — a pick does not carry over.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { ICON_NAMES, NativeProvider, SessionScreen, type IconSet } from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const install = {
  id: 'm',
  kind: 'machine' as const,
  name: 'laptop',
  status: { kind: 'online' as const },
  attention: 0,
}

function Two({ got }: { got: string[][] }) {
  const [index, setIndex] = useState(0)
  return (
    <SessionScreen
      install={install}
      status={install.status}
      session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
      project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
      items={[]}
      dock={{
        kind: 'question',
        index,
        questions: [
          { text: 'Какая база?', options: [{ value: 'pg', label: 'Postgres' }] },
          { text: 'Какой кэш?', options: [{ value: 'redis', label: 'Redis' }] },
        ],
      }}
      onReply={(answers) => (got.push(answers), setIndex((i) => i + 1))}
    />
  )
}

test('the second question starts without the first one’s pick', () => {
  const got: string[][] = []
  render(wrap(<Two got={got} />))
  fireEvent.click(screen.getByText('Postgres'))
  fireEvent.click(screen.getByRole('button', { name: /Далее|Next/ }))
  fireEvent.click(screen.getByText('Redis'))
  fireEvent.click(screen.getByRole('button', { name: /Ответить|Reply|Отправить/ }))
  expect(got).toEqual([['pg'], ['redis']])
})

test('an MCP form hands on what was filled in', () => {
  const sent: unknown[] = []
  render(
    wrap(
      <SessionScreen
        install={install}
        status={install.status}
        session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
        project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
        items={[]}
        dock={{
          kind: 'mcp',
          request: {
            server: 'jira',
            message: 'Войдите',
            fields: [
              { key: 'user', kind: 'text', label: 'Логин' },
              { key: 'remember', kind: 'switch', label: 'Запомнить' },
              { key: 'site', kind: 'select', label: 'Сайт', options: ['a', 'b'] },
            ],
          },
        }}
        onMcpSend={(v) => sent.push(v)}
      />,
    ),
  )
  fireEvent.change(screen.getAllByRole('textbox').at(0)!, { target: { value: 'ivan' } })
  fireEvent.click(screen.getByText('Запомнить'))
  fireEvent.click(screen.getByText('b'))
  fireEvent.click(screen.getByRole('button', { name: /Отправить|Send/ }))
  expect(sent).toEqual([{ user: 'ivan', remember: true, site: 'b' }])
})

// #708: a file the agent handed over — a card in the timeline; a tap asks the app to open it.
test('a file from the agent is a card that opens', () => {
  const opened: string[] = []
  render(
    wrap(
      <SessionScreen
        install={install}
        status={install.status}
        session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
        project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
        items={[
          {
            kind: 'file',
            id: 'f',
            path: 'docs/Программа.docx',
            name: 'Программа.docx',
            mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            bytes: 12 * 1024,
            note: 'Черновик программы',
          },
        ]}
        onOpenSent={(file) => opened.push(file.path)}
      />,
    ),
  )
  expect(screen.getByText('Черновик программы')).toBeTruthy()
  expect(screen.getByText(/12 KB/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Файл для вас: Программа\.docx/ }))
  expect(opened).toEqual(['docs/Программа.docx'])
})

// #710: an open file the app cannot draw itself — the host's preview, a document card, or loading.
const files = (openFile: Parameters<typeof SessionScreen>[0]['openFile'], onShare?: () => void) => (
  <SessionScreen
    install={install}
    status={install.status}
    session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
    project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
    items={[]}
    view="files"
    openFile={openFile}
    onShareFile={onShare}
  />
)

test('a document shows the host preview, else a card that opens it elsewhere', () => {
  const shared: number[] = []
  render(wrap(files({ path: 'a.docx', content: '', preview: <span>превью документа</span> })))
  expect(screen.getByText('превью документа')).toBeTruthy()
  cleanup()
  render(
    wrap(
      files(
        { path: 'a.docx', content: '', binary: { mime: 'application/pdf', bytes: 3 * 1024 } },
        () => shared.push(1),
      ),
    ),
  )
  expect(screen.queryByText(/application\/pdf/)).toBeNull()
  expect(screen.getByText(/3 KB/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Открыть в/ }))
  expect(shared).toEqual([1])
  cleanup()
  const previewed: number[] = []
  render(
    wrap(
      <SessionScreen
        install={install}
        status={install.status}
        session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
        project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
        items={[]}
        view="files"
        openFile={{ path: 'a.docx', content: '', binary: { mime: 'application/pdf', bytes: 3 } }}
        onPreviewFile={() => previewed.push(1)}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: /^Просмотр$/ }))
  expect(previewed).toEqual([1])
  cleanup()
  render(wrap(files({ path: 'a.docx', content: '', loading: true })))
  expect(screen.getAllByLabelText(/Загрузка|Loading/).length).toBeGreaterThan(0)
})

// #711: a goal/workflow notice shows its label and what happened; the goal bar drives the goal.
test('a service notice shows its label and summary', () => {
  render(
    wrap(
      <SessionScreen
        install={install}
        status={install.status}
        session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
        project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
        items={[{ kind: 'notice', id: 'n', label: 'Цель', summary: 'Все тесты зелёные' }]}
      />,
    ),
  )
  expect(screen.getByText('Цель')).toBeTruthy()
  expect(screen.getByText('Все тесты зелёные')).toBeTruthy()
})

test('the goal bar shows the goal and drives pause and reset', () => {
  const acts: string[] = []
  render(
    wrap(
      <SessionScreen
        install={install}
        status={install.status}
        session={{ id: 's', projectId: 'p', title: 'S', origin: 'phone', when: '', group: 'today' }}
        project={{ id: 'p', name: 'shop', path: '/w', sessions: 1 }}
        items={[]}
        goal={{
          line: 'Цель · итерация 2 · идёт: Тесты',
          reason: '2 теста красные',
          status: 'active',
        }}
        onGoalPause={() => acts.push('pause')}
        onGoalResume={() => acts.push('resume')}
        onGoalClear={() => acts.push('clear')}
      />,
    ),
  )
  expect(screen.getByText('Цель · итерация 2 · идёт: Тесты')).toBeTruthy()
  expect(screen.getByText('2 теста красные')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Пауза|Pause/ }))
  fireEvent.click(screen.getByRole('button', { name: /Сбросить|Reset/ }))
  expect(acts).toEqual(['pause', 'clear'])
})
