// @vitest-environment jsdom
// A context compaction on the phone (#761): its summary for the model opens on a tap, as in the
// window; while the compaction runs the summary shows as it is written.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import { TimelinePart } from '../src/native/screens/buffcode/timeline-parts.tsx'
import type { TimelineItem } from '../src/native/screens/buffcode/model.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

const show = (item: TimelineItem, onOpenCompaction?: (id: string) => void) =>
  render(
    <NativeProvider icons={icons} locale="ru">
      <TimelinePart item={item} onOpenCompaction={onOpenCompaction} />
    </NativeProvider>,
  )

test('a finished compaction folds its summary; a tap opens it and asks for the whole text', () => {
  const onOpen = vi.fn()
  show(
    {
      kind: 'compaction',
      id: 'c1',
      when: '14:20',
      status: 'completed',
      summary: 'Цель: экспорт PDF',
    },
    onOpen,
  )
  expect(screen.getByText(/Контекст сжат · 14:20/)).toBeTruthy()
  expect(screen.queryByText('Цель: экспорт PDF')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Сводка для модели' }))
  expect(screen.getByText('Цель: экспорт PDF')).toBeTruthy()
  expect(onOpen).toHaveBeenCalledWith('c1')
})

test('a running compaction shows the summary as it is written', () => {
  show({ kind: 'compaction', id: 'c1', when: '14:20', status: 'running', summary: 'Пишу итог' })
  expect(screen.getByText(/Сжимаю контекст/)).toBeTruthy()
  expect(screen.getByText('Пишу итог')).toBeTruthy()
})

test('without a summary (an old service, a failure) — the line alone', () => {
  show({ kind: 'compaction', id: 'c1', when: '14:20' })
  expect(screen.getByText(/Контекст сжат · 14:20/)).toBeTruthy()
  expect(screen.queryByRole('button')).toBeNull()
  cleanup()
  show({ kind: 'compaction', id: 'c2', when: '14:21', status: 'failed' })
  expect(screen.getByText(/Сжать контекст не удалось · 14:21/)).toBeTruthy()
})
