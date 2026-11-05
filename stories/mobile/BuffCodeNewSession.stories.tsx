import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NewSessionScreen,
  PickerSheet,
  variantHint,
  variantLabel,
} from '../../src/native/screens/buffcode/index.ts'
import { useT } from '../../src/native/index.ts'
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
/** The model's thinking mode (#759): picked when the session starts, each choice says what it changes. */
export const ThinkingMode: Story = {
  render: () => (
    <NewSessionScreen
      install={machine}
      status={status}
      project={projects[0]}
      model={models[0]}
      variant="high"
      onPickVariant={() => undefined}
      mode="edit"
    />
  ),
}
function VariantPicker() {
  const t = useT()
  return (
    <PickerSheet
      title={t('buffcode.thinkingMode')}
      icon="brain"
      items={['default', 'low', 'high', 'max'].map((id) => ({
        id,
        title: variantLabel(t, id),
        subtitle: variantHint(t, id),
      }))}
      selectedId="high"
      emptyTitle=""
      emptyText=""
    />
  )
}
export const PickThinkingMode: Story = {
  render: () => (
    <>
      <NewSessionScreen
        install={machine}
        status={status}
        project={projects[0]}
        model={models[0]}
        variant="high"
        onPickVariant={() => undefined}
      />
      <VariantPicker />
    </>
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
