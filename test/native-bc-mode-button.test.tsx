// @vitest-environment jsdom
// The permission mode in the composer (#760): a small icon of its own per mode next to the
// paperclip; a tap opens the session's settings, as the line above the chat does.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ICON_NAMES, NativeProvider, type IconSet } from '../src/native/index.ts'
import { Composer } from '../src/native/screens/buffcode/composer.tsx'
import { modeIcon } from '../src/native/screens/buffcode/composer-parts.tsx'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

test('every mode has an icon of its own; the plan wins over the mode', () => {
  const all = [
    modeIcon('ask', false),
    modeIcon('edit', false),
    modeIcon('full', false),
    modeIcon('custom', false),
    modeIcon('ask', true),
  ]
  expect(new Set(all).size).toBe(all.length)
  expect(modeIcon('full', true)).toBe(modeIcon('ask', true))
})

test('the composer shows the mode by its icon and opens the settings on a tap', () => {
  const onMode = vi.fn()
  const { container } = render(
    <NativeProvider icons={icons} locale="ru">
      <Composer mode="full" onMode={onMode} />
    </NativeProvider>,
  )
  const button = screen.getByRole('button', { name: 'Режим разрешений: Полный доступ' })
  expect(button.querySelector(`[data-icon="${modeIcon('full', false)}"]`)).toBeTruthy()
  fireEvent.click(button)
  expect(onMode).toHaveBeenCalledOnce()
  // No mode known (an old service): no button.
  cleanup()
  render(
    <NativeProvider icons={icons} locale="ru">
      <Composer />
    </NativeProvider>,
  )
  expect(screen.queryByRole('button', { name: /Режим разрешений/ })).toBeNull()
  expect(container).toBeTruthy()
})

test('in the plan the label says so', () => {
  render(
    <NativeProvider icons={icons} locale="en">
      <Composer mode="ask" plan onMode={() => {}} />
    </NativeProvider>,
  )
  expect(screen.getByRole('button', { name: 'Permission mode: Plan · Ask' })).toBeTruthy()
})
