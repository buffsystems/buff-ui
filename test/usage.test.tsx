// @vitest-environment jsdom
// A pair's daily use (#909, #916): on the phone — the installs list, the header, the banner when it
// ran out; on the paired side — a column of the paired devices (admin, Buff Code desktop).
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  InstallBanner,
  InstallRow,
  InstallSwitchButton,
  NativeProvider,
  type IconSet,
  type Install,
} from '../src/native/index.ts'
import { PairedDevices } from '../src/react/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const GB = 1024 ** 3
const install = (usage?: Install['usage']): Install => ({
  id: 'm',
  kind: 'machine',
  name: 'Mac mini',
  status: { kind: 'online' },
  attention: 0,
  ...(usage ? { usage } : {}),
})

test('an install in the list says its traffic today of the limit and when it starts over', () => {
  render(
    wrap(
      <InstallRow
        install={install({
          bytes: 340 * 1024 ** 2,
          limit: 2 * GB,
          resets: '03:00',
          exhausted: false,
        })}
      />,
    ),
  )
  expect(screen.getByText(/Трафик за сутки: 340 МБ из 2 ГБ, сброс в 03:00/)).toBeTruthy()
})

test('the header shows the share of the limit used', () => {
  render(
    wrap(
      <InstallSwitchButton
        install={install({ bytes: GB / 2, limit: 2 * GB, resets: '03:00', exhausted: false })}
      />,
    ),
  )
  expect(screen.getByText('25%')).toBeTruthy()
})

test('a pair that ran out says so over «not answering», with when it comes back', () => {
  render(wrap(<InstallBanner status={{ kind: 'offline', since: '03:00', reason: 'quota' }} />))
  expect(screen.getByText('Суточный лимит трафика исчерпан до 03:00')).toBeTruthy()
  expect(screen.getByText(/Связь вернётся в 03:00/)).toBeTruthy()
})

test('the paired devices show each phone traffic today, and a phone that ran out', () => {
  render(
    <PairedDevices
      devices={[
        {
          id: 'a',
          name: 'iPhone',
          model: 'iPhone',
          pairedAt: '1 окт',
          lastSeen: 'сейчас',
          status: 'online',
          usage: { bytes: 340 * 1024 ** 2, limit: 2 * GB, resets: '03:00', exhausted: false },
        },
        {
          id: 'b',
          name: 'Pixel',
          model: 'Pixel',
          pairedAt: '1 окт',
          lastSeen: 'сейчас',
          status: 'online',
          usage: { bytes: 2 * GB, limit: 2 * GB, resets: '03:00', exhausted: true },
        },
      ]}
    />,
  )
  expect(screen.getByText('Трафик за сутки')).toBeTruthy()
  expect(screen.getByText('340 МБ из 2 ГБ')).toBeTruthy()
  expect(screen.getByText('исчерпан до 03:00')).toBeTruthy()
})
