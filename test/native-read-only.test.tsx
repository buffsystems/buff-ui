// @vitest-environment jsdom
// A reader on the phone (#666): a demo guest or a member without the right sees no action the
// install would refuse — the screens hide what they are not given.
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  AskListScreen,
  DevListScreen,
  ICON_NAMES,
  NativeProvider,
  NotificationSettingsScreen,
  ProjectTestsScreen,
  ResearchListScreen,
  ReviewScreen,
  TaskDetailScreen,
  type IconSet,
  type Install,
  type Review,
  type ShellProps,
} from '../src/native/index.ts'
import { taskClarify, taskGate } from '../stories/mobile/fixtures-cabinet-dev.ts'

afterEach(cleanup)

const icons = Object.fromEntries(
  ICON_NAMES.map((name) => [name, () => <span data-icon={name} />]),
) as unknown as IconSet
const wrap = (children: ReactNode) => (
  <NativeProvider icons={icons} locale="ru">
    {children}
  </NativeProvider>
)
const online = { kind: 'online' } as const
const shell: ShellProps = {
  install: { id: 'a', kind: 'saas', name: 'Acme', status: online, attention: 0 },
}

test('dev list for a reader: no «Новая задача», and the empty state does not invite one', () => {
  render(wrap(<DevListScreen shell={shell} status={online} tasks={[]} canCreate={false} />))
  expect(screen.queryByRole('button', { name: 'Новая задача' })).toBeNull()
  expect(screen.queryByText(/Поставьте первую/)).toBeNull()
  expect(screen.getByText('Здесь появятся задачи проекта.')).toBeTruthy()
})

test('preparing the tools is its own right', () => {
  const view = (canPrepareTools: boolean) =>
    wrap(
      <DevListScreen
        shell={shell}
        status={online}
        tasks={[]}
        toolsReady={false}
        canPrepareTools={canPrepareTools}
      />,
    )
  const { rerender } = render(view(false))
  expect(screen.queryByRole('button', { name: 'Подготовить инструменты' })).toBeNull()
  rerender(view(true))
  expect(screen.getByRole('button', { name: 'Подготовить инструменты' })).toBeTruthy()
})

test('task: the clarify and the gate each follow their own right', () => {
  const { rerender } = render(
    wrap(<TaskDetailScreen status={online} task={taskClarify} canClarify={false} />),
  )
  expect(screen.getByText(/Ответить может автор задачи/)).toBeTruthy()
  rerender(wrap(<TaskDetailScreen status={online} task={taskGate} canGate={false} />))
  expect(screen.getByText(/Решение принимает автор задачи/)).toBeTruthy()
  rerender(wrap(<TaskDetailScreen status={online} task={taskGate} canClarify={false} />))
  expect(screen.queryByText(/Решение принимает автор задачи/)).toBeNull()
})

test('task: no run controls offered when there is nothing to open', () => {
  const { rerender } = render(wrap(<TaskDetailScreen status={online} task={taskGate} />))
  expect(screen.queryByRole('button', { name: 'Действия' })).toBeNull()
  rerender(wrap(<TaskDetailScreen status={online} task={taskGate} onActions={vi.fn()} />))
  expect(screen.getByRole('button', { name: 'Действия' })).toBeTruthy()
})

test('project tests: no refresh without a way to ask for one', () => {
  render(wrap(<ProjectTestsScreen status={online} project="p" tests={[]} />))
  expect(screen.queryByRole('button', { name: 'Обновить список тестов' })).toBeNull()
})

test('notification types: a reader sees them, the switches do not move', () => {
  const toggled = vi.fn()
  const install = { id: 'i', name: 'Buff', kind: 'ce', status: online } as unknown as Install
  render(
    wrap(
      <NotificationSettingsScreen
        install={install}
        status={online}
        groups={[{ key: 'dev', types: ['dev_gate'] }]}
        enabled={new Set(['dev_gate'])}
        canEdit={false}
        onToggleType={toggled}
      />,
    ),
  )
  for (const sw of screen.getAllByRole('switch')) fireEvent.click(sw)
  expect(toggled).not.toHaveBeenCalled()
})

test('review discussion: no composer without a way to send', () => {
  const review: Review = {
    task: 7,
    title: 'Поиск',
    phase: 'review',
    prs: [],
    findings: [],
    publishTargets: [],
  }
  render(wrap(<ReviewScreen status={online} review={review} tab="discuss" threads={[]} />))
  expect(screen.queryByPlaceholderText('Продолжить разбор изменений…')).toBeNull()
})

test('ask and research lists: no «new» for a reader, actions only on threads one may manage', () => {
  const threads = [
    { id: 'm', title: 'Мой', author: 'ivan', status: 'idle' as const, updated: 'сейчас' },
    { id: 'o', title: 'Чужой', author: 'olga', status: 'idle' as const, updated: 'сейчас' },
  ]
  const mine = (th: { author: string }) => th.author === 'ivan'
  const { rerender } = render(
    wrap(
      <AskListScreen
        shell={shell}
        status={online}
        threads={threads}
        canCreate={false}
        canManage={mine}
        onActions={vi.fn()}
      />,
    ),
  )
  expect(screen.queryByRole('button', { name: 'Новый вопрос' })).toBeNull()
  expect(screen.getAllByRole('button', { name: 'Действия' })).toHaveLength(1)
  rerender(
    wrap(
      <ResearchListScreen
        shell={shell}
        status={online}
        items={threads}
        canCreate={false}
        canManage={mine}
        onActions={vi.fn()}
      />,
    ),
  )
  expect(screen.queryByRole('button', { name: 'Новое исследование' })).toBeNull()
  expect(screen.getAllByRole('button', { name: 'Действия' })).toHaveLength(1)
})
