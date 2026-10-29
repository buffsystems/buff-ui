// @vitest-environment jsdom
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  Card,
  ICON_NAMES,
  Input,
  makeTheme,
  NativeProvider,
  Text,
  type IconSet,
} from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

describe('surfaces layer by tone, not by outline (#692)', () => {
  test('the screen sits under its cards in both schemes', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const { colors } = makeTheme(scheme)
      expect(colors.background).not.toBe(colors.card)
    }
  })

  test('a card has no outline, a muted card inside it keeps one', () => {
    render(
      <NativeProvider icons={icons}>
        <Card>
          <Text>Наружная</Text>
        </Card>
        <Card tone="muted">
          <Text>Внутренняя</Text>
        </Card>
      </NativeProvider>,
    )
    const outer = screen.getByText('Наружная').parentElement as HTMLElement
    const inner = screen.getByText('Внутренняя').parentElement as HTMLElement
    expect(outer.style.borderTopWidth).toBe('')
    expect(outer.style.boxShadow).not.toBe('')
    expect(inner.style.borderTopWidth).toBe('1px')
  })

  test('a field shows the focus ring while typing', () => {
    render(
      <NativeProvider icons={icons}>
        <Input placeholder="Имя" />
      </NativeProvider>,
    )
    const input = screen.getByPlaceholderText('Имя')
    const frame = input.parentElement as HTMLElement
    const idle = frame.style.borderTopColor
    fireEvent.focus(input)
    expect(frame.style.borderTopColor).not.toBe(idle)
    expect(frame.style.boxShadow).toContain('3px')
    fireEvent.blur(input)
    expect(frame.style.borderTopColor).toBe(idle)
  })
})
