// @vitest-environment jsdom
// «Ревью» on the phone (#647): the finding sheet takes typing, the run log opens a step and
// pages it, a diff pages, and the review lists the task's discussions.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  CheckLogScreen,
  FileDiffScreen,
  FindingSheet,
  ICON_NAMES,
  NativeProvider,
  ReviewScreen,
  type IconSet,
  type Review,
} from '../src/native/index.ts'
import { ChecksBlock } from '../src/native/screens/cabinet/review/checks.tsx'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const online = { kind: 'online' } as const

test('the finding sheet hands on its title and detail', () => {
  const typed: string[] = []
  render(
    wrap(
      <FindingSheet
        mode="add"
        draft={{ title: '', detail: '', attachments: [] }}
        onTitle={(v) => typed.push(`t:${v}`)}
        onDetail={(v) => typed.push(`d:${v}`)}
      />,
    ),
  )
  fireEvent.change(screen.getByPlaceholderText('Что не так…'), {
    target: { value: 'Нет теста' },
  })
  fireEvent.change(screen.getByPlaceholderText(/Подробности/), { target: { value: 'для пустого' } })
  expect(typed).toEqual(['t:Нет теста', 'd:для пустого'])
})

test('the run log opens a step and asks for more of it', () => {
  const asked: string[] = []
  render(
    wrap(
      <CheckLogScreen
        status={online}
        task={7}
        steps={[
          {
            id: 's1',
            label: 'tests · прогон 1 из 1',
            status: 'failed',
            duration: '12 с',
            open: true,
            lines: ['FAIL search.test.ts'],
            total: 40,
          },
        ]}
        onToggle={(id) => asked.push(`toggle:${id}`)}
        onMore={(id) => asked.push(`more:${id}`)}
      />,
    ),
  )
  expect(screen.getByText('Загружено 1 из 40 строк')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))
  fireEvent.click(screen.getByRole('button', { name: 'tests · прогон 1 из 1' }))
  expect(asked).toEqual(['more:s1', 'toggle:s1'])
})

test('a diff in pages offers the rest', () => {
  let more = 0
  render(
    wrap(
      <FileDiffScreen
        status={online}
        path="src/search.ts"
        lines={['@@ -1 +1 @@', '+a']}
        total={9}
        onMore={() => more++}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))
  expect(more).toBe(1)
})

test('the discussion tab lists the task’s threads', () => {
  const opened: string[] = []
  const review: Review = {
    task: 7,
    title: 'Поиск',
    phase: 'review',
    prs: [],
    findings: [],
    publishTargets: [],
  }
  render(
    wrap(
      <ReviewScreen
        status={online}
        review={review}
        tab="discuss"
        threads={[
          { id: 'a', title: 'Почему trim?', author: 'ivan', status: 'idle', updated: 'сейчас' },
        ]}
        onOpenThread={(id) => opened.push(id)}
      />,
    ),
  )
  fireEvent.click(screen.getByText('Почему trim?'))
  expect(opened).toEqual(['a'])
})

test('a check tile that leads somewhere is one button, pressed whole (#691)', () => {
  let logs = 0
  render(
    wrap(
      <ChecksBlock
        checks={{
          build: { status: 'passed', duration: '58 с' },
          tests: { status: 'passed', hasLog: true, duration: '3 мин' },
          findings: { open: 0, resolved: 0, total: 0 },
        }}
        onLog={() => logs++}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: /^Что проверено/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Тесты прошли. Журнал прогона' }))
  expect(logs).toBe(1)
})

test('the checks are one folded line, unfolded at once when something failed (#692)', () => {
  const checks = {
    build: { status: 'passed', duration: '58 с' },
    tests: { status: 'passed', hasLog: true, duration: '3 мин' },
    inventory: { before: 10, after: 17, added: 7, reenabled: 0 },
    findings: { open: 2, resolved: 0, total: 2 },
  } as const
  render(wrap(<ChecksBlock checks={checks} />))
  expect(
    screen.getByRole('button', {
      name: 'Что проверено: Сборка прошла, Тесты прошли, Тестов стало больше, Открыто замечаний: 2',
    }),
  ).toBeTruthy()
  expect(screen.getByText('+7 тестов')).toBeTruthy()
  expect(screen.queryByText('Журнал прогона')).toBeNull()
  cleanup()
  render(wrap(<ChecksBlock checks={{ ...checks, tests: { status: 'failed', hasLog: true } }} />))
  expect(screen.getByText('Журнал прогона')).toBeTruthy()
})
