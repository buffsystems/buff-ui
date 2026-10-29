// @vitest-environment jsdom
// Notification types of an install (#655): when the install does not return them, the screen says
// so and offers to ask again — never an endless skeleton.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  ICON_NAMES,
  NativeProvider,
  NotificationSettingsScreen,
  NotificationsScreen,
  type IconSet,
  type Install,
} from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const install = {
  id: 'i',
  name: 'Buff',
  kind: 'ce',
  status: { kind: 'online' },
} as unknown as Install

test('a failed read shows the reason and a retry instead of the switches', () => {
  const retry = vi.fn()
  render(
    <NativeProvider icons={icons} locale="ru">
      <NotificationSettingsScreen
        install={install}
        status={{ kind: 'online' }}
        groups={[]}
        enabled={new Set()}
        error="Установка не отдала настройки"
        onRetry={retry}
      />
    </NativeProvider>,
  )
  expect(screen.getByText('Установка не отдала настройки')).toBeTruthy()
  fireEvent.click(screen.getByText('Повторить'))
  expect(retry).toHaveBeenCalledOnce()
})

// Seen on the device (#655): the row ended with «local» — how the phone came to know of it, which
// tells the person nothing. The row names the install and what happened.
test('a notice row names the install and the type, not where the phone stored it', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <NotificationsScreen
        entries={[
          {
            id: 'n',
            installId: 'i',
            installName: 'laptop',
            type: 'bc_turn_complete',
            title: 'Ход завершён',
            when: 'сейчас',
            read: false,
            source: 'local',
          },
        ]}
      />
    </NativeProvider>,
  )
  expect(screen.queryByText(/локально/)).toBeNull()
  expect(screen.getByText(/^laptop · /)).toBeTruthy()
})
