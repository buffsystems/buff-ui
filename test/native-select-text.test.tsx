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

const selectable = (text: string) => getComputedStyle(screen.getByText(text)).userSelect

test('prose, its headings and its code are selectable', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <Prose markdown={'## Итог\n\nСтены пудровые.\n\n- пункт\n\n```\nconst a = 1\n```'} />
    </NativeProvider>,
  )
  for (const text of ['Итог', 'Стены пудровые.', 'пункт']) expect(selectable(text)).toBe('text')
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
