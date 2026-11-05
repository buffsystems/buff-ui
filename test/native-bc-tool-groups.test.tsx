// @vitest-environment jsdom
// Tool calls in a row on the phone (#758): folded into one line «Использовано N: …», as the
// window does; a tap opens them. The to-do list, errors and a running subagent stay apart.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import type { TimelineItem } from '../src/native/screens/buffcode/model.ts'
import { foldTools, ToolGroup } from '../src/native/screens/buffcode/tool-group.tsx'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

const tool = (id: string, name: string, status: 'running' | 'done' | 'error' = 'done') =>
  ({ kind: 'tool', id, tool: name, title: `${name} · ${id}`, status }) as const

test('tool calls in a row fold; one call alone, the to-do list and a running subagent stay apart', () => {
  const items: TimelineItem[] = [
    { kind: 'user', id: 'u', text: 'go', when: '' },
    tool('a', 'read'),
    tool('b', 'grep'),
    { kind: 'assistant', id: 'm', markdown: 'ok' },
    tool('c', 'shell'),
    { kind: 'todo', id: 't', items: [] },
    { kind: 'subagent', id: 's1', title: 'review', status: 'done' },
    tool('d', 'shell'),
    { kind: 'subagent', id: 's2', title: 'tests', status: 'running' },
  ]
  const folded = foldTools(items)
  expect(
    folded.map((x) => (x.kind === 'tools' ? `tools:${x.items.map((i) => i.id)}` : x.id)),
  ).toEqual(['u', 'tools:a,b', 'm', 'c', 't', 'tools:s1,d', 's2'])
})

test('the folded line names the count and the kinds; a tap opens the calls', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <ToolGroup items={[tool('a', 'read'), tool('b', 'grep'), tool('c', 'read')]} />
    </NativeProvider>,
  )
  const head = screen.getByRole('button', { name: 'Использовано 3: Read, Grep' })
  expect(screen.queryByText('read · a')).toBeNull()
  fireEvent.click(head)
  expect(screen.getByText('read · a')).toBeTruthy()
  expect(screen.getByText('grep · b')).toBeTruthy()
})

test('a group at work spins; a failed call is counted', () => {
  render(
    <NativeProvider icons={icons} locale="en">
      <ToolGroup items={[tool('a', 'shell', 'error'), tool('b', 'read', 'running')]} />
    </NativeProvider>,
  )
  expect(screen.getByRole('button', { name: 'Used 2: Shell, Read' })).toBeTruthy()
  expect(screen.getByText('1 failed')).toBeTruthy()
  expect(screen.getByRole('progressbar')).toBeTruthy()
})
