// @vitest-environment jsdom
// #891: Setup mode on the phone is one place of the machine in the drawer; a project's session
// list has no Setup group; a new setup starts on a page with the model and its thinking mode.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  NativeProvider,
  NewSessionScreen,
  SessionsScreen,
  SidebarDrawer,
  type BcSession,
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

const machine: Install = {
  id: 'm',
  kind: 'machine',
  name: 'MacBook',
  status: { kind: 'online' },
  attention: 0,
}
const online = { kind: 'online' } as const
const project = { id: 'p', name: 'billing-service', path: '~/work/billing-service', sessions: 2 }
const session = (id: string, title: string, extra: Partial<BcSession> = {}): BcSession => ({
  id,
  projectId: 'p',
  title,
  origin: 'phone',
  when: '5 мин назад',
  group: 'today',
  ...extra,
})
const footer = { onHome() {}, onNotifications() {}, onSettings() {}, onAddInstall() {} }

test('the drawer has Setup among the machine places and opens it', () => {
  const picked: string[] = []
  render(
    wrap(
      <SidebarDrawer
        installs={[machine]}
        currentId="m"
        content={{ kind: 'machine', projects: [], totalSessions: 0, place: 'projects' }}
        onSelectSection={(id) => picked.push(id)}
        {...footer}
      />,
    ),
  )
  fireEvent.click(screen.getByText('Настройка'))
  expect(picked).toEqual(['setup'])
  expect(screen.getByText('Настройки')).toBeTruthy()
})

test("a project's session list has no Setup group and no way into the mode", () => {
  render(
    wrap(
      <SessionsScreen
        install={machine}
        status={online}
        project={project}
        sessions={[session('1', 'Экспорт в PDF')]}
      />,
    ),
  )
  expect(screen.queryByText('Настройка')).toBeNull()
  expect(screen.queryByLabelText('Новая настройка')).toBeNull()
  expect(screen.getByText('billing-service')).toBeTruthy()
})

test('the Setup place lists the machine’s setup sessions with their projects; «+» starts a new setup', () => {
  let started = 0
  render(
    wrap(
      <SessionsScreen
        install={machine}
        status={online}
        setup
        sessions={[session('1', 'Рабочая почта', { project: 'billing-service' })]}
        onNew={() => started++}
        onMenu={() => (started += 10)}
      />,
    ),
  )
  fireEvent.click(screen.getByLabelText('Открыть меню'))
  expect(started).toBe(10)
  started = 0
  expect(screen.getByText('Настройка')).toBeTruthy()
  expect(screen.getByText(/billing-service/)).toBeTruthy()
  fireEvent.click(screen.getByLabelText('Новая настройка'))
  expect(started).toBe(1)
})

test('the empty Setup place says how to begin', () => {
  render(
    wrap(<SessionsScreen install={machine} status={online} setup sessions={[]} onNew={() => {}} />),
  )
  expect(screen.getByText(/попросите что-нибудь подключить/)).toBeTruthy()
})

test('a new setup: the model, its thinking mode, the context window and the permission mode — no project, agent or plan', () => {
  let begun = 0
  render(
    wrap(
      <NewSessionScreen
        install={machine}
        status={online}
        setup
        project={project}
        model={{ id: 'x', name: 'Buff Large', provider: 'buff' }}
        variant="high"
        onPickVariant={() => {}}
        context={0}
        onPickContext={() => {}}
        onStart={() => begun++}
      />,
    ),
  )
  expect(screen.getByText('Новая настройка')).toBeTruthy()
  for (const label of ['Модель', 'Режим размышлений', 'Окно контекста', 'Режим разрешений'])
    expect(screen.getByText(new RegExp(`^${label}`))).toBeTruthy()
  for (const hidden of ['Проект', 'Агент', 'План']) expect(screen.queryByText(hidden)).toBeNull()
  expect(screen.queryByText('billing-service')).toBeNull()
  fireEvent.click(screen.getByText('Начать сессию'))
  expect(begun).toBe(1)
})

test('a new setup on a machine without a project cannot start and says why', () => {
  render(
    wrap(
      <NewSessionScreen
        install={machine}
        status={online}
        setup
        model={{ id: 'x', name: 'Buff Large', provider: 'buff' }}
      />,
    ),
  )
  expect(screen.getByText(/откройте в Buff Code хотя бы один проект/)).toBeTruthy()
})
