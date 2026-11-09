// @vitest-environment jsdom
// The session's context window on the phone (#839): the limit in words beside the thinking
// mode — picked when a session starts and changed in the session's settings; the words are
// the cabinet's (shared/ai-modes).
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import {
  contextLabel,
  contextOptions,
  NewSessionScreen,
  SessionDetailsSheet,
} from '../src/native/screens/buffcode/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

test('the limit reads as the preset and its size; the maximum names the model window', () => {
  expect(contextLabel('ru', 0, 400_000)).toBe('Максимум модели · 400k')
  expect(contextLabel('en', 0, undefined)).toBe('Model maximum')
  expect(contextLabel('ru', 200_000, 400_000)).toBe('Средний · 200k')
  expect(contextLabel('en', 64_000, 400_000)).toBe('Compact · 64k')
  expect(contextLabel('en', 150_000, 400_000)).toBe('Custom · 150k')
})

test('the choices: the maximum, the presets that fit the model, the current size, then a custom one', () => {
  const ids = contextOptions('en', 400_000, 0).map((o) => o.id)
  expect(ids).toEqual(['0', '64000', '200000', 'custom'])
  expect(contextOptions('en', undefined, 0).map((o) => o.id)).toEqual([
    '0',
    '64000',
    '200000',
    '500000',
    'custom',
  ])
  expect(contextOptions('ru', 400_000, 150_000).map((o) => o.id)).toEqual([
    '0',
    '64000',
    '150000',
    '200000',
    'custom',
  ])
  const first = contextOptions('ru', 400_000, 0)[0]
  expect(first).toMatchObject({ id: '0', title: 'Максимум модели' })
  expect(first?.subtitle).toContain('400k')
  expect(contextOptions('ru', 400_000, 0).at(-1)?.title).toBe('Свой')
})

test('the session settings show the context window and open its choice', () => {
  const onContext = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <SessionDetailsSheet
        details={{ directory: '/w', origin: 'phone', created: '', mcp: [], lsp: [] }}
        model="DeepSeek"
        onModel={() => {}}
        context={200_000}
        modelWindow={400_000}
        onContext={onContext}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('Окно контекста')).toBeTruthy()
  fireEvent.click(screen.getByText('Средний · 200k'))
  expect(onContext).toHaveBeenCalledOnce()
})

test('a new session offers the context window beside the thinking mode, only when it can be picked', () => {
  const install = { id: 'm', name: 'Mac', kind: 'machine', status: { kind: 'online' } } as never
  const { rerender } = render(
    <NativeProvider icons={icons} locale="en">
      <NewSessionScreen
        install={install}
        status={{ kind: 'online' } as never}
        context={0}
        modelWindow={400_000}
        onPickContext={() => {}}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('Context window')).toBeTruthy()
  expect(screen.getByText('Model maximum · 400k')).toBeTruthy()
  rerender(
    <NativeProvider icons={icons} locale="en">
      <NewSessionScreen install={install} status={{ kind: 'online' } as never} />
    </NativeProvider>,
  )
  expect(screen.queryByText('Context window')).toBeNull()
})
