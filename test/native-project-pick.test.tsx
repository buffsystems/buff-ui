// @vitest-environment jsdom
// Where a section stands and how to change it (#695): a field naming the kind and the project,
// and a picker that searches and groups dozens of projects, repositories and knowledge spaces.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  ICON_NAMES,
  matchProjects,
  NativeProvider,
  ProjectLink,
  ProjectPickerSheet,
  type IconSet,
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

const many = [
  ...Array.from({ length: 12 }, (_, i) => ({ id: `d${i}`, name: `proj-${i}` })),
  { id: 'g', name: 'notes-api', kind: 'git' as const },
  { id: 's', name: 'Регламенты', kind: 'space' as const },
]

test('the field says what the list stands in and invites a change', () => {
  let opened = 0
  render(
    wrap(
      <ProjectLink
        project={{ id: 's', name: 'Регламенты', kind: 'space' }}
        onPress={() => opened++}
      />,
    ),
  )
  expect(screen.getByText('Пространство знаний')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Пространство знаний: Регламенты. Сменить' }))
  expect(opened).toBe(1)
})

test('a long list is searched by name and grouped by kind', () => {
  render(wrap(<ProjectPickerSheet projects={many} currentId="d3" />))
  expect(screen.getByText('Проекты разработки')).toBeTruthy()
  expect(screen.getByText('Репозитории')).toBeTruthy()
  expect(screen.getByText('Пространства знаний')).toBeTruthy()
  fireEvent.change(screen.getByPlaceholderText('Найти по названию'), { target: { value: 'РЕГЛ' } })
  expect(screen.getByText('Регламенты')).toBeTruthy()
  expect(screen.queryByText('proj-1')).toBeNull()
  fireEvent.change(screen.getByPlaceholderText('Найти по названию'), {
    target: { value: 'нет такого' },
  })
  expect(screen.getByText('Ничего не нашлось')).toBeTruthy()
})

test('a short list of one kind needs neither search nor group titles', () => {
  render(wrap(<ProjectPickerSheet projects={many.slice(0, 3)} />))
  expect(screen.queryByPlaceholderText('Найти по названию')).toBeNull()
  expect(screen.queryByText('Проекты разработки')).toBeNull()
})

test('matching ignores case and surrounding spaces', () => {
  expect(matchProjects(many, '  NOTES ').map((p) => p.id)).toEqual(['g'])
  expect(matchProjects(many, '')).toHaveLength(many.length)
})
