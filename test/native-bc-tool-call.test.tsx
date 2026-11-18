// @vitest-environment jsdom
// What a call was given, and the whole of what the timeline cut (#903).
import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
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

// #937: an item the timeline holds only the start of is not left cut. Text asks for its whole as
// soon as it shows — no button; a tool's output asks when its card is opened. «Show all» comes
// only when the whole has not arrived after a while, to ask again by hand.
test('a cut text asks for its whole at once and offers no button; the whole asks for nothing', () => {
  const onShowAll = vi.fn()
  const cut: TimelineItem = { kind: 'reasoning', id: 'r', markdown: 'начало…', clipped: true }
  render(wrap(<TimelinePart item={cut} onShowAll={onShowAll} />))
  expect(onShowAll).toHaveBeenCalledTimes(1)
  expect(onShowAll).toHaveBeenCalledWith(cut)
  expect(screen.queryByRole('button', { name: 'Показать полностью' })).toBeNull()
  cleanup()
  onShowAll.mockClear()
  render(wrap(<TimelinePart item={{ ...cut, clipped: false }} onShowAll={onShowAll} />))
  expect(onShowAll).not.toHaveBeenCalled()
})

test('a cut tool output asks for its whole when the card is opened, not before', () => {
  const onShowAll = vi.fn()
  const cut: TimelineItem = {
    kind: 'tool',
    id: 't',
    tool: 'shell',
    title: 'npm test',
    status: 'done',
    output: 'начало…',
    clipped: true,
  }
  render(wrap(<TimelinePart item={cut} onShowAll={onShowAll} />))
  expect(onShowAll).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'shell: npm test' }))
  expect(onShowAll).toHaveBeenCalledTimes(1)
  expect(onShowAll).toHaveBeenCalledWith(cut)
})

test('«Show all» is offered only when the whole has not come after a while', () => {
  vi.useFakeTimers()
  const onShowAll = vi.fn()
  const cut: TimelineItem = { kind: 'assistant', id: 'a', markdown: 'начало…', clipped: true }
  render(wrap(<TimelinePart item={cut} onShowAll={onShowAll} />))
  act(() => void vi.advanceTimersByTime(7000))
  expect(screen.queryByRole('button', { name: 'Показать полностью' })).toBeNull()
  act(() => void vi.advanceTimersByTime(2000))
  fireEvent.click(screen.getByRole('button', { name: 'Показать полностью' }))
  expect(onShowAll).toHaveBeenCalledTimes(2)
  vi.useRealTimers()
})
