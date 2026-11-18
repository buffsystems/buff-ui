// @vitest-environment jsdom
// #935: a dock that waits for the person — the agent's question, a permission — is taller than
// what is left above the keyboard. Its title and its buttons stay put and the body between them
// scrolls; while the keyboard is up the title row offers to hide it, and the «waiting above» note
// gives its room away.
import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Keyboard } from 'react-native'
import {
  ICON_NAMES,
  NativeProvider,
  QuestionDock,
  SessionScreen,
  type IconSet,
  type SessionScreenProps,
} from '../src/native/index.ts'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const questions = [
  {
    text: 'На каких цифрах строить итоги?',
    options: [
      { value: 'a', label: 'Хватит статейных' },
      { value: 'b', label: 'Пришлю финальные метрики' },
    ],
  },
]

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

/** The keyboard comes up or goes away, as the system says it. */
function keyboard() {
  const handlers = new Map<string, () => void>()
  vi.spyOn(Keyboard, 'addListener').mockImplementation(((event: string, fn: () => void) => {
    handlers.set(event, fn)
    return { remove: () => handlers.delete(event) }
  }) as unknown as typeof Keyboard.addListener)
  const say = (shown: boolean) =>
    act(() => {
      for (const [event, fn] of handlers) if (/Show$/.test(event) === shown) fn()
    })
  return { show: () => say(true), hide: () => say(false) }
}

test('the body of a dock scrolls between its title and its buttons', () => {
  render(wrap(<QuestionDock questions={questions} />))
  const body = within(screen.getByTestId('dock-body'))
  expect(body.getByText('На каких цифрах строить итоги?')).toBeTruthy()
  expect(body.getByText('Пришлю финальные метрики')).toBeTruthy()
  expect(body.getByLabelText('Свой ответ')).toBeTruthy()
  expect(body.queryByText('Вопрос агента')).toBeNull()
  expect(body.queryByRole('button', { name: 'Ответить' })).toBeNull()
  expect(screen.getByRole('button', { name: 'Ответить' })).toBeTruthy()
})

test('while the keyboard is up the dock offers to hide it', () => {
  const kb = keyboard()
  const dismiss = vi.spyOn(Keyboard, 'dismiss').mockImplementation(() => undefined)
  render(wrap(<QuestionDock questions={questions} />))
  expect(screen.queryByRole('button', { name: 'Скрыть клавиатуру' })).toBeNull()
  kb.show()
  fireEvent.click(screen.getByRole('button', { name: 'Скрыть клавиатуру' }))
  expect(dismiss).toHaveBeenCalledTimes(1)
  kb.hide()
  expect(screen.queryByRole('button', { name: 'Скрыть клавиатуру' })).toBeNull()
})

test('the «waiting above» note leaves its room to the dock while the keyboard is up', () => {
  const kb = keyboard()
  render(wrap(<SessionScreen {...base} dock={{ kind: 'question', questions, index: 0 }} />))
  expect(screen.getByText(/Агент ждёт вашего ответа выше/)).toBeTruthy()
  kb.show()
  expect(screen.queryByText(/Агент ждёт вашего ответа выше/)).toBeNull()
  kb.hide()
  expect(screen.getByText(/Агент ждёт вашего ответа выше/)).toBeTruthy()
})
