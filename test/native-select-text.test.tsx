// @vitest-environment jsdom
// #696: an answer, a question and the code in them can be selected and copied.
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import {
  MessageList,
  ICON_NAMES,
  NativeProvider,
  Prose,
  type IconSet,
} from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

/** Whether the text can be selected: by itself or as a part of a selectable text (#947). */
const selectable = (text: string): string => {
  for (let el: HTMLElement | null = screen.getByText(text); el; el = el.parentElement) {
    const value = getComputedStyle(el).userSelect
    if (value && value !== 'auto') return value
  }
  return ''
}

test('prose, its headings and its code are selectable', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <Prose markdown={'## Итог\n\nСтены пудровые.\n\n- пункт\n\n```\nconst a = 1\n```'} />
    </NativeProvider>,
  )
  // Heading, paragraph and list are one selectable text (#947).
  const flow = screen.getByTestId('prose-flow')
  expect(getComputedStyle(flow).userSelect).toBe('text')
  for (const text of ['Итог', 'Стены пудровые.', 'пункт']) expect(flow.textContent).toContain(text)
  // A code line is one text of coloured tokens.
  const line = screen.getByText('const').parentElement
  expect(line && getComputedStyle(line).userSelect).toBe('text')
})

test("the person's own question is selectable too", () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <MessageList messages={[{ id: '1', role: 'user', content: 'Какой цвет стен?' }]} />
    </NativeProvider>,
  )
  expect(selectable('Какой цвет стен?')).toBe('text')
})
