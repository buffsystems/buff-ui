// @vitest-environment jsdom
// #696: a section's project is picked in the drawer, not on the page.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ICON_NAMES, NativeProvider, SidebarDrawer, type IconSet } from '../src/native/index.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)

const footer = { onHome() {}, onNotifications() {}, onSettings() {}, onAddInstall() {} }

test("the drawer shows the open section's project and picks another", () => {
  let picked = 0
  render(
    wrap(
      <SidebarDrawer
        installs={[
          { id: 'a', kind: 'saas', name: 'Acme', status: { kind: 'online' }, attention: 0 },
        ]}
        currentId="a"
        content={{
          kind: 'cabinet',
          sections: [{ id: 'ask', label: 'Спросить', icon: 'circleHelp' }],
          selected: 'ask',
          project: { id: 'o/acme-api', name: 'acme-api', kind: 'dev' },
        }}
        onPickProject={() => picked++}
        {...footer}
      />,
    ),
  )
  fireEvent.click(screen.getByText('acme-api'))
  expect(picked).toBe(1)
})

test('every footer row of the drawer answers a tap (#696)', () => {
  const pressed: string[] = []
  render(
    wrap(
      <SidebarDrawer
        installs={[]}
        onHome={() => pressed.push('home')}
        onNotifications={() => pressed.push('notifications')}
        onSettings={() => pressed.push('settings')}
        onAddInstall={() => pressed.push('add')}
      />,
    ),
  )
  for (const label of ['Домой', 'Уведомления', 'Настройки', 'Добавить установку'])
    fireEvent.click(screen.getByText(label))
  expect(pressed).toEqual(['home', 'notifications', 'settings', 'add'])
})
