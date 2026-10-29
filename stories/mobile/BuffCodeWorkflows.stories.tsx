import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  WorkflowRunScreen,
  WorkflowsScreen,
  WorkflowStartSheet,
} from '../../src/native/screens/buffcode/index.ts'
import { machine, offline, workflowRuns, workflows } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Воркфлоу: карточки, запуски, диалог запуска с параметрами, экран запуска. */
const meta = {
  title: 'Mobile/BuffCode/Workflows',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const

export const Cards: Story = {
  render: () => (
    <WorkflowsScreen install={machine} status={status} workflows={workflows} runs={workflowRuns} />
  ),
}
export const Runs: Story = {
  render: () => (
    <WorkflowsScreen
      install={machine}
      status={status}
      workflows={workflows}
      runs={workflowRuns}
      tab="runs"
    />
  ),
}
export const Empty: Story = {
  render: () => <WorkflowsScreen install={machine} status={status} workflows={[]} runs={[]} />,
}
export const Loading: Story = {
  render: () => (
    <WorkflowsScreen install={machine} status={status} workflows={[]} runs={[]} loading />
  ),
}
export const Offline: Story = {
  render: () => (
    <WorkflowsScreen install={machine} status={offline} workflows={workflows} runs={workflowRuns} />
  ),
}
export const Start: Story = {
  render: () => (
    <>
      <WorkflowsScreen install={machine} status={status} workflows={workflows} runs={[]} />
      <WorkflowStartSheet workflow={workflows[0]} projectName="billing-service" />
    </>
  ),
}
export const StartNoArgs: Story = {
  render: () => (
    <>
      <WorkflowsScreen install={machine} status={status} workflows={workflows} runs={[]} />
      <WorkflowStartSheet workflow={workflows[2]} />
    </>
  ),
}
export const RunRunning: Story = {
  render: () => <WorkflowRunScreen install={machine} status={status} run={workflowRuns[0]} />,
}
export const RunDone: Story = {
  render: () => <WorkflowRunScreen install={machine} status={status} run={workflowRuns[1]} />,
}
export const RunFailed: Story = {
  render: () => <WorkflowRunScreen install={machine} status={status} run={workflowRuns[2]} />,
}
export const RunOffline: Story = {
  render: () => <WorkflowRunScreen install={machine} status={offline} run={workflowRuns[0]} />,
}
