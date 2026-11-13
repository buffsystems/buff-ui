import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  contextOptions,
  NewSessionScreen,
  PickerSheet,
  variantHint,
  variantLabel,
} from '../../src/native/screens/buffcode/index.ts'
import { useLocale, useT } from '../../src/native/index.ts'
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
/** Новая настройка (#891): модель, её размышления, окно контекста и разрешения — без проекта, агента и «Плана». */
export const Setup: Story = {
  render: () => (
    <NewSessionScreen
      install={machine}
      status={status}
      setup
      project={projects[0]}
      model={models[0]}
      variant="high"
      onPickVariant={() => {}}
      context={0}
      modelWindow={200_000}
      onPickContext={() => {}}
      mode="ask"
      prompt="Подключи рабочую почту"
    />
  ),
}
export const SetupNoProject: Story = {
  render: () => <NewSessionScreen install={machine} status={status} setup model={models[0]} />,
}
/** The work mode on the new-session page (#894): one switch in place of the «Plan» chip. */
export const WorkMode: Story = {
  render: () => (
    <NewSessionScreen
      install={machine}
      status={status}
      project={projects[0]}
      model={models[0]}
      agent={agents[0]}
      mode="edit"
      work="plan"
      onWork={() => {}}
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
      context={200_000}
      modelWindow={400_000}
      onPickContext={() => undefined}
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

// Окно контекста (#839): выбор потолка рядом с режимом размышлений — пресеты по окну модели и свой размер.
function ContextPicker() {
  const t = useT()
  const locale = useLocale()
  return (
    <PickerSheet
      title={t('buffcode.contextWindow')}
      icon="layers"
      items={contextOptions(locale, 400_000, 200_000)}
      selectedId="200000"
      emptyTitle=""
      emptyText=""
    />
  )
}
export const PickContextWindow: Story = {
  render: () => (
    <>
      <NewSessionScreen
        install={machine}
        status={status}
        project={projects[0]}
        model={models[0]}
        variant="high"
        onPickVariant={() => undefined}
        context={200_000}
        modelWindow={400_000}
        onPickContext={() => undefined}
      />
      <ContextPicker />
    </>
  ),
}
