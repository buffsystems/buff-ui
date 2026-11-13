// @vitest-environment jsdom
// What a call was given, and the whole of what the timeline cut (#903).
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import type { TimelineItem } from '../src/native/screens/buffcode/model.ts'
import { TimelinePart } from '../src/native/screens/buffcode/timeline-parts.tsx'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

const wrap = (node: React.ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {node}
  </NativeProvider>
)

test('a running call opened shows what it was given, though nothing came back yet', () => {
  const item: TimelineItem = {
    kind: 'tool',
    id: 't',
    tool: 'execute',
    title: 'execute',
    status: 'running',
    input: 'code:\nreturn await tools.solidcraft.inspect({})',
  }
  const { container } = render(wrap(<TimelinePart item={item} />))
  fireEvent.click(screen.getByRole('button', { name: 'execute: execute' }))
  expect(screen.getByText('Параметры')).toBeTruthy()
  // The code is highlighted token by token: read it as one text.
  expect(container.textContent).toContain('tools.solidcraft.inspect')
})

test('a done call shows its parameters and its result, each named', () => {
  const item: TimelineItem = {
    kind: 'tool',
    id: 't',
    tool: 'execute',
    title: 'execute',
    status: 'done',
    input: 'code: 1 + 1',
    output: '2',
  }
  render(wrap(<TimelinePart item={item} />))
  fireEvent.click(screen.getByRole('button', { name: 'execute: execute' }))
  expect(screen.getByText('Параметры')).toBeTruthy()
  expect(screen.getByText('Результат')).toBeTruthy()
})

test('what the timeline cut offers «Show all», and asks for this item; the whole does not', () => {
  const onShowAll = vi.fn()
  const cut: TimelineItem = { kind: 'reasoning', id: 'r', markdown: 'начало…', clipped: true }
  render(wrap(<TimelinePart item={cut} onShowAll={onShowAll} />))
  fireEvent.click(screen.getByRole('button', { name: 'Показать полностью' }))
  expect(onShowAll).toHaveBeenCalledWith(cut)
  cleanup()
  render(wrap(<TimelinePart item={{ ...cut, clipped: false }} onShowAll={onShowAll} />))
  expect(screen.queryByRole('button', { name: 'Показать полностью' })).toBeNull()
})
