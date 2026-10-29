import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AutomationEditorScreen,
  AutomationHistorySheet,
  AutomationsScreen,
  DeleteAutomationSheet,
  type AutomationDraft,
} from '../../src/native/screens/buffcode/index.ts'
import { automationRuns, automations, machine, offline } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Автоматизации машины: список, история запусков, редактор. */
const meta = {
  title: 'Mobile/BuffCode/Automations',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const
const draft: AutomationDraft = {
  title: 'Утренний отчёт о коммитах',
  schedule: 'weekly',
  days: [0, 3],
  dayOfMonth: 1,
  time: '09:00',
  task: 'Собери вчерашние коммиты по всем веткам и запиши итог в REPORT.md',
  projectName: 'billing-service',
  mode: 'edit',
  preview: 'Пн, Чт в 09:00 · следующий запуск — чт 09:00',
}

export const List: Story = {
  render: () => <AutomationsScreen install={machine} status={status} automations={automations} />,
}
export const Empty: Story = {
  render: () => <AutomationsScreen install={machine} status={status} automations={[]} />,
}
export const Loading: Story = {
  render: () => <AutomationsScreen install={machine} status={status} automations={[]} loading />,
}
export const Offline: Story = {
  render: () => <AutomationsScreen install={machine} status={offline} automations={automations} />,
}
export const History: Story = {
  render: () => (
    <>
      <AutomationsScreen install={machine} status={status} automations={automations} />
      <AutomationHistorySheet automation={automations[0]} runs={automationRuns} />
    </>
  ),
}
export const HistoryEmpty: Story = {
  render: () => (
    <>
      <AutomationsScreen install={machine} status={status} automations={automations} />
      <AutomationHistorySheet automation={automations[2]} runs={[]} />
    </>
  ),
}
export const ConfirmDelete: Story = {
  render: () => (
    <>
      <AutomationsScreen install={machine} status={status} automations={automations} />
      <DeleteAutomationSheet automation={automations[2]} />
    </>
  ),
}
export const Editor: Story = {
  render: () => <AutomationEditorScreen install={machine} status={status} draft={draft} editing />,
}
export const EditorNew: Story = {
  render: () => (
    <AutomationEditorScreen
      install={machine}
      status={status}
      draft={{
        ...draft,
        title: '',
        task: '',
        projectName: undefined,
        schedule: 'daily',
        preview: undefined,
      }}
    />
  ),
}
export const EditorMonthly: Story = {
  render: () => (
    <AutomationEditorScreen
      install={machine}
      status={status}
      draft={{ ...draft, schedule: 'monthly', dayOfMonth: 15 }}
      editing
    />
  ),
}
export const EditorOffline: Story = {
  render: () => <AutomationEditorScreen install={machine} status={offline} draft={draft} editing />,
}
