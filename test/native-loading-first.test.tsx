// @vitest-environment jsdom
// #696: while a list is on its way the phone says so — never «nothing here» first; and a new
// question or research is asked from a button in plain sight, not a «+» in the corner.
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AskListScreen,
  HomeScreen,
  ICON_NAMES,
  NativeProvider,
  PickerSheet,
  ProjectPickerSheet,
  ResearchListScreen,
  type IconSet,
  type ShellProps,
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
const shell: ShellProps = {
  install: { id: 'a', kind: 'saas', name: 'Acme', status: { kind: 'online' }, attention: 0 },
}
const online = { kind: 'online' } as const

test('a new question and a new research are a button over the list', () => {
  const asked: string[] = []
  render(
    wrap(
      <>
        <AskListScreen shell={shell} status={online} threads={[]} onNew={() => asked.push('ask')} />
        <ResearchListScreen
          shell={shell}
          status={online}
          items={[]}
          onNew={() => asked.push('research')}
        />
      </>,
    ),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Новый вопрос' }))
  fireEvent.click(screen.getByRole('button', { name: 'Новое исследование' }))
  expect(asked).toEqual(['ask', 'research'])
})

test('the attention feed on its way is not «nothing needs attention»', () => {
  const install = { ...shell.install }
  render(wrap(<HomeScreen installs={[install]} attention={[]} attentionLoading />))
  expect(screen.queryByText(/ничего не требует/i)).toBeNull()
  expect(screen.getByLabelText('Загрузка…')).toBeTruthy()
})

test('a picker on its way is not «no projects» or «no models»', () => {
  render(
    wrap(
      <>
        <PickerSheet
          title="Модель"
          icon="sparkles"
          items={[]}
          loading
          emptyTitle="Моделей нет"
          emptyText="—"
        />
        <ProjectPickerSheet projects={[]} loading />
      </>,
    ),
  )
  expect(screen.queryByText('Моделей нет')).toBeNull()
  expect(screen.getAllByLabelText('Загрузка…')).toHaveLength(2)
})
