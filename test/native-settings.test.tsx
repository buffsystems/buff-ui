// @vitest-environment jsdom
// Settings on the phone (#656): the demo install shows only where the app offers it (a long press
// on the version reveals it in the app); an install without notices wired shows no row for them.
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AppSettingsScreen,
  ICON_NAMES,
  InstallSettingsScreen,
  NativeProvider,
  type IconSet,
  type Install,
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

test('the demo install hides until the app offers it', () => {
  const { rerender } = render(wrap(<AppSettingsScreen version="1.0.0" installs={1} />))
  expect(screen.queryByText('Посмотреть на демо')).toBeNull()
  rerender(wrap(<AppSettingsScreen version="1.0.0" installs={1} onDemo={() => undefined} />))
  expect(screen.getByText('Посмотреть на демо')).toBeTruthy()
})

test('the installs row says how many, aloud too (#691)', () => {
  render(wrap(<AppSettingsScreen version="1.0.0" installs={2} onInstalls={() => undefined} />))
  expect(screen.getByRole('button', { name: 'Установки: 2' })).toBeTruthy()
})

test('an install shows its notices row only when they are wired', () => {
  const install = {
    id: 'i',
    name: 'Buff',
    kind: 'ce',
    status: { kind: 'online' },
  } as unknown as Install
  const props = {
    install,
    name: 'Buff',
    user: 'ivan',
    phoneName: 'Pixel',
    since: '1 окт',
    fingerprint: 'AB12',
  }
  const { rerender } = render(wrap(<InstallSettingsScreen {...props} />))
  expect(screen.queryByText('Уведомления')).toBeNull()
  rerender(wrap(<InstallSettingsScreen {...props} onNotifications={() => undefined} />))
  expect(screen.getByText('Уведомления')).toBeTruthy()
})
