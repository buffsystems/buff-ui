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

// #922: Recents — сессии машины одним списком, как их упорядочило приложение; под названием — дата
// последнего сообщения, без проекта; тап открывает сессию её проекта.
test("the machine's recents: in the given order, each dated, a tap opens it in its project", () => {
  const opened: string[] = []
  render(
    wrap(
      <SidebarDrawer
        installs={[
          { id: 'm', kind: 'machine', name: 'Mac', status: { kind: 'online' }, attention: 0 },
        ]}
        currentId="m"
        content={{
          kind: 'machine',
          projects: [{ id: 'p1', name: 'shop', sessions: [] }],
          totalSessions: 2,
          recents: [
            { id: 's2', projectId: 'p2', title: 'Корзина', when: '17:32', running: true },
            { id: 's1', projectId: 'p1', title: 'Каталог', when: '3 нояб.' },
          ],
        }}
        onSelectSession={(project, session) => opened.push(`${project}/${session}`)}
        {...footer}
      />,
    ),
  )
  expect(screen.getByText('Недавние')).toBeTruthy()
  const rows = screen
    .getAllByRole('button')
    .filter((b) => ['Корзина', 'Каталог'].includes(b.getAttribute('aria-label') ?? ''))
  expect(rows.map((b) => b.getAttribute('aria-label'))).toEqual(['Корзина', 'Каталог'])
  expect(screen.getByText('17:32')).toBeTruthy()
  expect(screen.getByText('3 нояб.')).toBeTruthy()
  fireEvent.click(screen.getByText('Каталог'))
  expect(opened).toEqual(['p1/s1'])
})
