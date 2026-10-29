import type { Meta, StoryObj } from '@storybook/react-vite'
import { NewSessionScreen, PickerSheet } from '../../src/native/screens/buffcode/index.ts'
import { agents, machine, models, offline, projects } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Новая сессия: проект и модель обязательны — из списков службы; кнопка выключена, пока не выбраны оба. */
const meta = {
  title: 'Mobile/BuffCode/NewSession',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const
const projectItems = projects.map((p) => ({ id: p.id, title: p.name, subtitle: p.path }))
const modelItems = models.map((m) => ({ id: m.id, title: m.name, subtitle: m.provider }))

export const Blank: Story = {
  render: () => <NewSessionScreen install={machine} status={status} />,
}
export const Ready: Story = {
  render: () => (
    <NewSessionScreen
      install={machine}
      status={status}
      project={projects[0]}
      model={models[0]}
      agent={agents[0]}
      mode="edit"
      prompt="Добавь экспорт отчёта в PDF"
    />
  ),
}
export const PlanMode: Story = {
  render: () => (
    <NewSessionScreen
      install={machine}
      status={status}
      project={projects[0]}
      model={models[0]}
      mode="ask"
      plan
    />
  ),
}
export const PickProject: Story = {
  render: () => (
    <>
      <NewSessionScreen install={machine} status={status} model={models[0]} />
      <PickerSheet
        title="Проект"
        icon="folderGit"
        items={projectItems}
        selectedId="billing"
        emptyTitle="Служба не знает проектов"
        emptyText="Откройте проект в Buff Code на компьютере."
      />
    </>
  ),
}
export const PickProjectEmpty: Story = {
  render: () => (
    <>
      <NewSessionScreen install={machine} status={status} />
      <PickerSheet
        title="Проект"
        icon="folderGit"
        items={[]}
        emptyTitle="Служба не знает проектов"
        emptyText="Откройте проект в Buff Code на компьютере — он появится здесь."
      />
    </>
  ),
}
export const PickModel: Story = {
  render: () => (
    <>
      <NewSessionScreen install={machine} status={status} project={projects[0]} />
      <PickerSheet title="Модель" icon="cpu" items={modelItems} emptyTitle="" emptyText="" />
    </>
  ),
}
export const PickModelEmpty: Story = {
  render: () => (
    <>
      <NewSessionScreen install={machine} status={status} project={projects[0]} />
      <PickerSheet
        title="Модель"
        icon="cpu"
        items={[]}
        emptyTitle="В Buff Code нет моделей"
        emptyText="Подключите провайдера в Buff Code на компьютере."
      />
    </>
  ),
}
export const Offline: Story = {
  render: () => (
    <NewSessionScreen install={machine} status={offline} project={projects[0]} model={models[0]} />
  ),
}
