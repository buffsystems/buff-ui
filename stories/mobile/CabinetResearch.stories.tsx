import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DeleteResearchSheet,
  ExportSheet,
  NewResearchScreen,
  ResearchConfirmSheet,
  ResearchListScreen,
  ResearchScreen,
} from '../../src/native/screens/cabinet/index.ts'
import {
  offline,
  online,
  researchDone,
  researches,
  researchPaused,
  researchRunning,
  researchWaiting,
  shell,
} from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Research',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Глубокое исследование: the list. */
export const List: Story = {
  render: () => (
    <ResearchListScreen shell={shell} status={online} items={researches} onActions={() => {}} />
  ),
}
export const ListEmpty: Story = {
  render: () => <ResearchListScreen shell={shell} status={online} items={[]} />,
}
export const ListLoading: Story = {
  render: () => <ResearchListScreen shell={shell} status={online} items={[]} loading />,
}
export const ListError: Story = {
  render: () => <ResearchListScreen shell={shell} status={online} items={[]} error />,
}
export const ListOffline: Story = {
  render: () => <ResearchListScreen shell={shell} status={offline} items={researches} />,
}
export const DeleteConfirm: Story = {
  render: () => (
    <>
      <ResearchListScreen shell={shell} status={online} items={researches} />
      <DeleteResearchSheet />
    </>
  ),
}

/** In progress: the timer ticks, the document is being prepared. */
export const InProgress: Story = {
  render: () => <ResearchScreen status={online} research={researchRunning} />,
}
export const Clarify: Story = {
  render: () => (
    <ResearchScreen
      status={online}
      research={researchWaiting}
      picks={{ q1: { options: [0], free: '' } }}
    />
  ),
}
export const Report: Story = {
  render: () => (
    <ResearchScreen status={online} research={researchDone} draft="Добавь раздел про кэш" />
  ),
}
export const Paused: Story = {
  render: () => <ResearchScreen status={online} research={researchPaused} />,
}
export const NoWrite: Story = {
  render: () => <ResearchScreen status={online} research={researchDone} canWrite={false} />,
}
export const Loading: Story = { render: () => <ResearchScreen status={online} loading /> }
export const Error: Story = { render: () => <ResearchScreen status={online} error /> }
export const Offline: Story = {
  render: () => <ResearchScreen status={offline} research={researchDone} />,
}
export const StopConfirm: Story = {
  render: () => (
    <>
      <ResearchScreen status={online} research={researchRunning} />
      <ResearchConfirmSheet action="stop" />
    </>
  ),
}
export const Export: Story = {
  render: () => (
    <>
      <ResearchScreen status={online} research={researchDone} />
      <ExportSheet title="Выгрузить исследование" onPdf={() => {}} onMarkdown={() => {}} />
    </>
  ),
}

export const New: Story = {
  render: () => (
    <NewResearchScreen
      status={online}
      place="Acme · billing-service"
      text="Как устроена очередь платежей?"
    />
  ),
}
export const NewSpace: Story = {
  render: () => <NewResearchScreen status={online} place="Acme · документы" space />,
}
export const NewError: Story = {
  render: () => (
    <NewResearchScreen
      status={online}
      place="Acme · billing-service"
      text="?"
      error="не удалось начать исследование"
    />
  ),
}
export const NewNoRight: Story = {
  render: () => (
    <NewResearchScreen status={online} place="Acme · billing-service" canCreate={false} demo />
  ),
}
export const NewOffline: Story = {
  render: () => <NewResearchScreen status={offline} place="Acme · billing-service" />,
}
