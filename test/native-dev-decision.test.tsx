// @vitest-environment jsdom
// A task waiting on a decision leads with it; the statement folds under it (#692).
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  DetailsTab,
  ICON_NAMES,
  NativeProvider,
  TaskDetailScreen,
  type IconSet,
} from '../src/native/index.ts'
import { taskGate, taskRunning } from '../stories/mobile/fixtures-cabinet-dev.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet

test('at the gate the decision comes first and the statement is folded', () => {
  const { container } = render(
    <NativeProvider icons={icons} locale="ru">
      <DetailsTab task={taskGate} />
    </NativeProvider>,
  )
  const text = container.textContent ?? ''
  expect(text.indexOf('Утвердить')).toBeGreaterThan(-1)
  expect(text).not.toContain('Пользователь должен скачивать отчёт')
  expect(text).not.toContain('примите решение')
  fireEvent.click(screen.getByRole('button', { name: 'Исходная постановка. Вложений: 2' }))
  const opened = container.textContent ?? ''
  expect(opened.indexOf('Пользователь должен скачивать отчёт')).toBeGreaterThan(
    opened.indexOf('Утвердить'),
  )
})

test('with nothing to decide the statement stays open', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <DetailsTab task={taskRunning} />
    </NativeProvider>,
  )
  expect(screen.queryByRole('button', { name: /Исходная постановка/ })).toBeNull()
})

test('the gate decisions are pinned once under the task screen', () => {
  render(
    <NativeProvider icons={icons} locale="ru">
      <TaskDetailScreen status={{ kind: 'online' }} task={taskGate} />
    </NativeProvider>,
  )
  expect(screen.getAllByRole('button', { name: 'Утвердить' })).toHaveLength(1)
  cleanup()
  render(
    <NativeProvider icons={icons} locale="ru">
      <TaskDetailScreen status={{ kind: 'online' }} task={taskGate} canAct={false} />
    </NativeProvider>,
  )
  expect(screen.queryByRole('button', { name: 'Утвердить' })).toBeNull()
})
