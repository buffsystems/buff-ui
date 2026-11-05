// @vitest-environment jsdom
// The model's thinking mode on the phone (#759): a label and what it changes for each variant;
// picked when a session starts and changed in the session's settings.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import {
  NewSessionScreen,
  SessionDetailsSheet,
  variantHint,
  variantLabel,
} from '../src/native/screens/buffcode/index.ts'
import { makeTranslate } from '../src/native/i18n.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

test('every known variant has words in both languages; an unknown one shows as it is', () => {
  for (const locale of ['ru', 'en'] as const) {
    const t = makeTranslate(locale)
    for (const id of ['default', 'none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']) {
      expect(variantLabel(t, id)).not.toBe(id)
      expect(variantHint(t, id)).not.toBe('')
    }
    expect(variantLabel(t, 'turbo')).toBe('turbo')
    expect(variantHint(t, 'turbo')).toBe('')
  }
  expect(variantLabel(makeTranslate('ru'), 'high')).toBe('Высокие')
})

test('the session settings show the thinking mode and open its choice', () => {
  const onVariant = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionDetailsSheet
        details={{ directory: '/w', origin: 'phone', created: '', mcp: [], lsp: [] }}
        model="DeepSeek"
        onModel={() => {}}
        variant="high"
        onVariant={onVariant}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('Режим размышлений')).toBeTruthy()
  fireEvent.click(screen.getByText('Высокие'))
  expect(onVariant).toHaveBeenCalledOnce()
})

test('a new session offers the thinking mode only for a model that has it', () => {
  const install = { id: 'm', name: 'Mac', kind: 'machine', status: { kind: 'online' } } as never
  const { rerender } = render(
    <NativeProvider icons={icons} locale="en">
      <NewSessionScreen
        install={install}
        status={{ kind: 'online' } as never}
        variant="max"
        onPickVariant={() => {}}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('Thinking mode')).toBeTruthy()
  expect(screen.getByText('Maximum')).toBeTruthy()
  rerender(
    <NativeProvider icons={icons} locale="en">
      <NewSessionScreen install={install} status={{ kind: 'online' } as never} />
    </NativeProvider>,
  )
  expect(screen.queryByText('Thinking mode')).toBeNull()
})
