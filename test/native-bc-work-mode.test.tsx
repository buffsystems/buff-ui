// @vitest-environment jsdom
// #894: the work mode on the phone is one visible switch — Work, Plan, Setup — in the session's
// settings and on the new-session page; the context line over the composer names a mode that is
// not plain work. Setup used to be a lone toggle at the bottom of the session's settings.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  NativeProvider,
  NewSessionScreen,
  SessionContextLine,
  SessionDetailsSheet,
  WorkModeControl,
  type IconSet,
  type Install,
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
const machine: Install = {
  id: 'm',
  kind: 'machine',
  name: 'MacBook',
  status: { kind: 'online' },
  attention: 0,
}
const online = { kind: 'online' } as const
const details = {
  directory: '~/billing',
  origin: 'window' as const,
  created: 'сегодня',
  mcp: [],
  lsp: [],
}

test('the switch offers Work, Plan and Setup, marks the mode in force and picks another', () => {
  const picked: string[] = []
  render(wrap(<WorkModeControl work="setup" onWork={(next) => picked.push(next)} />))
  expect(screen.getByRole('tab', { name: 'Настройка' }).getAttribute('aria-selected')).toBe('true')
  fireEvent.click(screen.getByRole('tab', { name: 'Работа' }))
  fireEvent.click(screen.getByRole('tab', { name: 'План' }))
  expect(picked).toEqual(['work', 'plan'])
})

test('a machine without the plan or the setup agent does not offer that mode', () => {
  render(wrap(<WorkModeControl work="work" setup={false} onWork={() => {}} />))
  expect(screen.queryByRole('tab', { name: 'Настройка' })).toBeNull()
  expect(screen.getByRole('tab', { name: 'План' })).toBeTruthy()
})

test("the session's settings carry the work mode on top; Setup is no lone toggle any more", () => {
  const picked: string[] = []
  render(
    wrap(
      <SessionDetailsSheet
        details={details}
        model="Buff Large"
        onModel={() => {}}
        work="setup"
        onWork={(next) => picked.push(next)}
      />,
    ),
  )
  expect(screen.getByText('Режим работы')).toBeTruthy()
  expect(screen.queryByText('Режим настройки включён')).toBeNull()
  fireEvent.click(screen.getByRole('tab', { name: 'Работа' }))
  expect(picked).toEqual(['work'])
})

test('the context line over the composer names Setup and Plan; plain work is not named', () => {
  const line = (work: 'work' | 'plan' | 'setup') => {
    cleanup()
    render(wrap(<SessionContextLine model="Buff Large" mode="ask" work={work} />))
    return screen.getByRole('button').textContent ?? ''
  }
  expect(line('setup')).toMatch(/^Настройка · Buff Large/)
  expect(line('plan')).toMatch(/^План · Buff Large/)
  expect(line('work')).toMatch(/^Buff Large/)
})

test('a new session picks its work mode with the same switch; Setup turns the page into a new setup', () => {
  const picked: string[] = []
  render(
    wrap(
      <NewSessionScreen
        install={machine}
        status={online}
        project={{ id: 'p', name: 'billing', path: '~/billing', sessions: 0 }}
        model={{ id: 'x', name: 'Buff Large', provider: 'buff' }}
        work="work"
        onWork={(next) => picked.push(next)}
      />,
    ),
  )
  expect(screen.getByText('Режим работы')).toBeTruthy()
  expect(screen.getByText(/^Проект/)).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: 'Настройка' }))
  fireEvent.click(screen.getByRole('tab', { name: 'План' }))
  expect(picked).toEqual(['setup', 'plan'])
})
