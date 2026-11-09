// @vitest-environment jsdom
// Message queue on the phone (#812): while the agent works the composer keeps «send» next to
// «stop» — the message waits for the end of the turn; what waits is listed above the composer,
// each can be dropped or sent at once.
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

test('while the agent works the composer queues the message next to «stop»', () => {
  const onSend = vi.fn()
  const onStop = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen {...base} running prompt="и ещё тесты" onSend={onSend} onStop={onStop} />
    </NativeProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'В очередь' }))
  expect(onSend).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: 'Остановить' }))
  expect(onStop).toHaveBeenCalledTimes(1)
})

test('an empty prompt while the agent works has nothing to queue', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen {...base} running prompt="" />
    </NativeProvider>,
  )
  expect(screen.getByRole('button', { name: 'В очередь' }).getAttribute('aria-disabled')).toBe(
    'true',
  )
})

test('the queued messages are listed; one is dropped, another sent at once', () => {
  const onCancel = vi.fn()
  const onSendNow = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen
        {...base}
        running
        queued={[
          { id: 'q1', text: 'и ещё тесты', files: 0 },
          { id: 'q2', text: '', files: 2 },
        ]}
        onQueuedCancel={onCancel}
        onQueuedSend={onSendNow}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('В очереди: 2')).toBeTruthy()
  expect(screen.getByText('и ещё тесты')).toBeTruthy()
  expect(screen.getByText('Файлов: 2')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Убрать из очереди: и ещё тесты' }))
  expect(onCancel).toHaveBeenCalledWith('q1')
  fireEvent.click(screen.getByRole('button', { name: 'Отправить сейчас: Файлов: 2' }))
  expect(onSendNow).toHaveBeenCalledWith('q2')
})

test('nothing waits — no queue block', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionScreen {...base} running queued={[]} />
    </NativeProvider>,
  )
  expect(screen.queryByText(/В очереди/)).toBeNull()
})
