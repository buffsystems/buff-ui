// @vitest-environment jsdom
// A list row's own buttons sit beside its press, never inside it (#690), and the waiting mark is
// the brand's brain, named for a screen reader.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  Choice,
  ICON_NAMES,
  IconButton,
  NativeProvider,
  Prose,
  Row,
  SessionRow,
  Spinner,
  ThreadComposer,
  type IconSet,
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

test('a pressable row with actions: no button inside a button, each press its own', () => {
  const open = vi.fn()
  const more = vi.fn()
  render(
    wrap(
      <Row
        title="Ветка"
        chevron
        onPress={open}
        actions={<IconButton icon="ellipsis" label="Действия" size="sm" onPress={more} />}
      />,
    ),
  )
  const row = screen.getByRole('button', { name: 'Ветка' })
  const action = screen.getByRole('button', { name: 'Действия' })
  expect(row.contains(action)).toBe(false)
  fireEvent.click(action)
  expect(more).toHaveBeenCalledOnce()
  expect(open).not.toHaveBeenCalled()
  fireEvent.click(row)
  expect(open).toHaveBeenCalledOnce()
  // One way on (#692): the row's own buttons replace the chevron.
  expect(row.querySelector('[data-icon="chevronRight"]')).toBeNull()
})

test('a Buff Code session row keeps its «more» button beside the row, not inside (#692)', () => {
  render(
    wrap(
      <SessionRow
        session={{
          id: 's',
          projectId: 'p',
          title: 'Сессия',
          origin: 'phone',
          when: '10:00',
          group: 'today',
        }}
        onPress={() => {}}
        onMore={() => {}}
      />,
    ),
  )
  const row = screen.getByRole('button', { name: 'Сессия' })
  expect(row.contains(screen.getByRole('button', { name: 'Ещё' }))).toBe(false)
})

test('the waiting mark: the brain, announced as loading', () => {
  const { container } = render(wrap(<Spinner />))
  expect(screen.getByRole('progressbar', { name: 'Загрузка…' })).toBeTruthy()
  expect(container.querySelector('[data-icon="brain"]')).toBeTruthy()
})

test('a choice is a radio when one is picked, a check when several (#692)', () => {
  render(
    wrap(
      <>
        <Choice label="На сервере" picked onPress={() => {}} />
        <Choice label="Постановка" picked={false} multiple onPress={() => {}} />
      </>,
    ),
  )
  expect(screen.getByRole('radio', { name: 'На сервере' })).toBeTruthy()
  expect(screen.getByRole('checkbox', { name: 'Постановка' })).toBeTruthy()
})

test('while Buff answers the send button rests, no brain inside it (#692)', () => {
  render(wrap(<ThreadComposer placeholder="Вопрос" value="ещё" busy onSend={() => {}} />))
  const send = screen.getByRole('button', { name: 'Отправить' })
  expect(send.querySelector('[role="progressbar"]')).toBeNull()
  expect(send.getAttribute('aria-disabled')).toBe('true')
})

test('a statement does not repeat the screen title as its first heading (#692)', () => {
  const { container } = render(
    wrap(
      <Prose
        markdown={'# Экспорт отчётов в PDF\n\nТекст.\n\n## Детали'}
        title="Экспорт  отчётов в pdf"
      />,
    ),
  )
  expect(container.textContent).toBe('Текст.Детали')
})
