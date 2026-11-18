// @vitest-environment jsdom
// #938: the machine's main screen has two views — the recent sessions of all the projects (the
// ones that wait for the person, then the running ones first; a search) and the projects in the
// order the person picked.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  NativeProvider,
  ProjectsScreen,
  type BcProject,
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
const status = { kind: 'online' } as const
const projects: BcProject[] = [
  { id: 'api', name: 'shop-api', path: '~/shop-api', sessions: 2, lastActive: '5 мин назад' },
  { id: 'web', name: 'shop-web', path: '~/shop-web', sessions: 1, lastActive: 'вчера' },
]
const session = (id: string, projectId: string, more: Partial<BcSession> = {}): BcSession => ({
  id,
  projectId,
  title: `Сессия ${id}`,
  origin: 'window',
  when: '12:40',
  group: 'today',
  project: projectId === 'api' ? 'shop-api' : 'shop-web',
  ...more,
})
const recents = [
  session('old', 'web', { group: 'older' }),
  session('run', 'api', { running: true }),
  session('ask', 'web', { attention: 1 }),
  session('today', 'api'),
]

const order = (texts: string[]) => {
  const body = document.body.textContent ?? ''
  return texts.map((text) => body.indexOf(text))
}

test('the recent view leads with the sessions that wait, then the running ones, then by day', () => {
  render(
    wrap(
      <ProjectsScreen
        install={machine}
        status={status}
        projects={projects}
        view="recent"
        onView={() => {}}
        recents={recents}
      />,
    ),
  )
  const at = order(['Ждут вас', 'Сессия ask', 'В работе', 'Сессия run', 'сегодня', 'Раньше'])
  expect(at.every((i) => i >= 0)).toBe(true)
  expect([...at].sort((a, b) => a - b)).toEqual(at)
  // Each row names its project: the list spans projects.
  expect(screen.getAllByText(/shop-web · .*12:40/)).toHaveLength(2)
  // The projects are not listed in this view.
  expect(screen.queryByText('~/shop-api')).toBeNull()
  expect(screen.queryByText(/сессий: 2/)).toBeNull()
})

test('a tap on a recent session opens it in its project', () => {
  const onOpenSession = vi.fn()
  render(
    wrap(
      <ProjectsScreen
        install={machine}
        status={status}
        projects={projects}
        view="recent"
        onView={() => {}}
        recents={recents}
        onOpenSession={onOpenSession}
      />,
    ),
  )
  fireEvent.click(screen.getByText('Сессия ask'))
  expect(onOpenSession).toHaveBeenCalledWith('web', 'ask')
})

test('the view switches by the tabs', () => {
  const onView = vi.fn()
  render(
    wrap(
      <ProjectsScreen
        install={machine}
        status={status}
        projects={projects}
        view="recent"
        onView={onView}
        recents={recents}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('tab', { name: 'Проекты' }))
  expect(onView).toHaveBeenCalledWith('projects')
})

test('a search with no match says so and keeps the field', () => {
  render(
    wrap(
      <ProjectsScreen
        install={machine}
        status={status}
        projects={projects}
        view="recent"
        onView={() => {}}
        recents={[]}
        query="нет такой"
      />,
    ),
  )
  expect(screen.getByText('Ничего не найдено')).toBeTruthy()
  expect(screen.getByPlaceholderText('Поиск по сессиям и проектам')).toBeTruthy()
})

test('the projects view names its order and lets the person pick another', () => {
  const onSort = vi.fn()
  render(
    wrap(
      <ProjectsScreen
        install={machine}
        status={status}
        projects={projects}
        view="projects"
        onView={() => {}}
        sort="recent"
        onSort={onSort}
      />,
    ),
  )
  expect(screen.getByText(/сессий: 2/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Сортировка: По последней сессии' }))
  fireEvent.click(screen.getByRole('radio', { name: 'По названию' }))
  expect(onSort).toHaveBeenCalledWith('name')
  expect(screen.queryByRole('radio', { name: 'По названию' })).toBeNull()
})

test('without the views the screen lists the projects alone', () => {
  render(wrap(<ProjectsScreen install={machine} status={status} projects={projects} />))
  expect(screen.queryByRole('tab')).toBeNull()
  expect(screen.getByText(/сессий: 2/)).toBeTruthy()
})

test('more recent sessions than shown are asked for by «Show more»', () => {
  const onMoreRecents = vi.fn()
  render(
    wrap(
      <ProjectsScreen
        install={machine}
        status={status}
        projects={projects}
        view="recent"
        onView={() => {}}
        recents={recents}
        onMoreRecents={onMoreRecents}
      />,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))
  expect(onMoreRecents).toHaveBeenCalledTimes(1)
})
