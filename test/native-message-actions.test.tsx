// @vitest-environment jsdom
// #947: a message on the phone is read and taken the way Claude and ChatGPT allow. Its text —
// headings, paragraphs, lists — is ONE selectable text, so a selection with handles runs from any
// character to any other across paragraphs; only code blocks and tables stand apart (they scroll
// sideways). Under an answer: «Copy» (the whole Markdown) and «Share» (a public link to this
// message); the person's own message carries the same two beside its time.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AssistantTurn,
  ICON_NAMES,
  MessageList,
  NativeProvider,
  Prose,
  UserTurn,
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

const MD = [
  '## Скорость реакции',
  '',
  'Три контура, и их **нельзя** смешивать:',
  '',
  '- Серво — на `ESP32`',
  '- Зрение — 30 Гц',
  '',
  '```js',
  'const hz = 30',
  '```',
  '',
  'Отдельно: камеры с rolling shutter.',
].join('\n')

test('headings, paragraphs and lists are one selectable text; a code block stands apart', () => {
  render(wrap(<Prose markdown={MD} />))
  const flows = screen.getAllByTestId('prose-flow')
  expect(flows).toHaveLength(2)
  const first = flows[0]!.textContent ?? ''
  for (const part of [
    'Скорость реакции',
    'Три контура, и их нельзя смешивать:',
    'Серво — на ESP32',
    'Зрение — 30 Гц',
  ])
    expect(first).toContain(part)
  expect(first.indexOf('Скорость')).toBeLessThan(first.indexOf('Зрение'))
  expect(first).not.toContain('const hz')
  expect(flows[1]!.textContent).toContain('Отдельно: камеры с rolling shutter.')
})

test('a numbered list keeps its numbers inside the text', () => {
  render(wrap(<Prose markdown={'1. первый\n2. второй'} />))
  const text = screen.getByTestId('prose-flow').textContent ?? ''
  expect(text).toMatch(/1\.\s*первый/)
  expect(text).toMatch(/2\.\s*второй/)
})

test('under a finished answer: Copy gives the Markdown, Share asks for a link', () => {
  const onCopy = vi.fn()
  const onShare = vi.fn()
  render(wrap(<AssistantTurn markdown={MD} model="deepseek" onCopy={onCopy} onShare={onShare} />))
  fireEvent.click(screen.getByRole('button', { name: 'Скопировать сообщение' }))
  expect(onCopy).toHaveBeenCalledWith(MD)
  expect(screen.getByRole('button', { name: 'Скопировано' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Поделиться сообщением' }))
  expect(onShare).toHaveBeenCalledTimes(1)
})

test('an answer still being written has no actions yet', () => {
  render(wrap(<AssistantTurn markdown="пишу" streaming onCopy={() => {}} onShare={() => {}} />))
  expect(screen.queryByRole('button', { name: 'Скопировать сообщение' })).toBeNull()
})

test('the person’s own message: the same actions beside its time', () => {
  const onCopy = vi.fn()
  const onShare = vi.fn()
  render(
    wrap(<UserTurn text="Проверь тесты" when="2 мин назад" onCopy={onCopy} onShare={onShare} />),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Скопировать сообщение' }))
  expect(onCopy).toHaveBeenCalledWith('Проверь тесты')
  fireEvent.click(screen.getByRole('button', { name: 'Поделиться сообщением' }))
  expect(onShare).toHaveBeenCalledTimes(1)
})

test('without hosts for them there are no buttons', () => {
  render(wrap(<AssistantTurn markdown="ответ" />))
  expect(screen.queryByRole('button', { name: 'Скопировать сообщение' })).toBeNull()
  expect(screen.queryByRole('button', { name: 'Поделиться сообщением' })).toBeNull()
})

test('an Ask thread gives each turn the actions, by the turn’s id', () => {
  const onCopyMessage = vi.fn()
  const onShareMessage = vi.fn()
  render(
    wrap(
      <MessageList
        messages={[
          { id: 'u1', role: 'user', content: 'Кто решает?', when: '' },
          { id: 'a1', role: 'assistant', content: 'Решает **дежурный**.', when: '' },
        ]}
        onCopyMessage={onCopyMessage}
        onShareMessage={onShareMessage}
      />,
    ),
  )
  const copies = screen.getAllByRole('button', { name: 'Скопировать сообщение' })
  expect(copies).toHaveLength(2)
  fireEvent.click(copies[1]!)
  expect(onCopyMessage).toHaveBeenCalledWith('Решает **дежурный**.')
  fireEvent.click(screen.getAllByRole('button', { name: 'Поделиться сообщением' })[0]!)
  expect(onShareMessage).toHaveBeenCalledWith('u1')
})

test('a thematic break is a line between two flows, not the text «---» (#948)', () => {
  render(wrap(<Prose markdown={'Первый\n\n---\n\nВторой'} />))
  expect(screen.getByTestId('prose-rule')).toBeTruthy()
  expect(screen.getAllByTestId('prose-flow')).toHaveLength(2)
  expect(screen.queryByText('---')).toBeNull()
})
