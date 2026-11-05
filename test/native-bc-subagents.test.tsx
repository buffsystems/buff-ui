// @vitest-environment jsdom
// The session's working subagents (#762): an icon with their count in the composer's bottom row;
// a tap opens the list and a subagent's session. With a dock in the composer's place — a line.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import { SessionScreen, type SessionScreenProps } from '../src/native/screens/buffcode/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

const base: SessionScreenProps = {
  install: {
    id: 'm',
    name: 'Mac',
    kind: 'machine',
    status: { kind: 'online' },
  } as SessionScreenProps['install'],
  status: { kind: 'online' } as SessionScreenProps['status'],
  session: { id: 's', projectId: 'p', title: 'Сессия', origin: 'phone', when: '', group: 'today' },
  project: { id: 'p', name: 'proj', path: '/p', sessions: 1 },
  items: [],
}

const subagents = [
  { id: 'k1', title: 'Ревью вёрстки', status: 'running', sessionID: 'k1' },
  { id: 'k2', title: 'Ревью фактов', status: 'running', sessionID: 'k2' },
  { id: 'k3', title: 'Старое', status: 'done', sessionID: 'k3' },
] as const

test('the composer shows the count of working subagents; the list opens a subagent session', () => {
  const onOpen = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen {...base} subagents={[...subagents]} onOpenSubagent={onOpen} />
    </NativeProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Субагенты: 2 в работе' }))
  expect(screen.getByText('Ревью вёрстки')).toBeTruthy()
  expect(screen.queryByText('Старое')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Открыть сессию субагента: Ревью фактов' }))
  expect(onOpen).toHaveBeenCalledWith('k2')
})

test('no working subagents — no icon', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen {...base} subagents={[subagents[2]]} />
    </NativeProvider>,
  )
  expect(screen.queryByRole('button', { name: /Субагенты/ })).toBeNull()
})

test('with a dock in the composer place the working subagents stay in sight', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen
        {...base}
        subagents={[...subagents]}
        dock={
          {
            kind: 'permission',
            request: { title: 'ls', patterns: ['ls'] },
          } as SessionScreenProps['dock']
        }
      />
    </NativeProvider>,
  )
  expect(screen.getByRole('button', { name: 'Субагенты: 2 в работе' })).toBeTruthy()
})
