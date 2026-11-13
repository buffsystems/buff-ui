// @vitest-environment jsdom
// Tool calls in a row on the phone (#758): folded into one line «Использовано N: …», as the
// window does; a tap opens them. The to-do list, errors and a running subagent stay apart.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import type { TimelineItem } from '../src/native/screens/buffcode/model.ts'
import { foldTools, ToolGroup } from '../src/native/screens/buffcode/tool-group.tsx'
import { TimelinePart } from '../src/native/screens/buffcode/timeline-parts.tsx'

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

// The model's thoughts between tool calls (#888): in the folded group with the calls, as the
// window and the shared page show them; one alone is a folded «Мысли» row.
test('thoughts fold with the tool calls around them and are named in the line', () => {
  const thought = { kind: 'reasoning', id: 'r', markdown: '**Plan:** read the file' } as const
  const folded = foldTools([tool('a', 'read'), thought, tool('b', 'shell')])
  expect(
    folded.map((x) => (x.kind === 'tools' ? `tools:${x.items.map((i) => i.id)}` : x.id)),
  ).toEqual(['tools:a,r,b'])
  render(
    <NativeProvider icons={icons} locale="ru">
      <ToolGroup items={[tool('a', 'read'), thought, tool('b', 'shell')]} />
    </NativeProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Использовано 3: Read, Мысли, Shell' }))
  // Inside the open group a thought is its own folded row, as on the shared page.
  expect(screen.queryByText(/read the file/)).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Мысли' }))
  expect(screen.getByText(/read the file/)).toBeTruthy()
})

test('a thought alone is a folded row that opens its markdown', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <TimelinePart item={{ kind: 'reasoning', id: 'r', markdown: 'Let me check the **repo**' }} />
    </NativeProvider>,
  )
  expect(screen.queryByText(/Let me check/)).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Мысли' }))
  expect(screen.getByText(/Let me check/)).toBeTruthy()
})
