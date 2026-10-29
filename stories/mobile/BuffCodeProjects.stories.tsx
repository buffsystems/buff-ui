import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectsScreen } from '../../src/native/screens/buffcode/index.ts'
import { blockedEe, machine, offline, projects, repair, serviceDown } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Проекты, которые знает служба Buff Code на машине. */
const meta = {
  title: 'Mobile/BuffCode/Projects',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const

export const List: Story = {
  render: () => <ProjectsScreen install={machine} status={status} projects={projects} />,
}
export const Empty: Story = {
  render: () => <ProjectsScreen install={machine} status={status} projects={[]} />,
}
export const Loading: Story = {
  render: () => <ProjectsScreen install={machine} status={status} projects={[]} loading />,
}
export const Offline: Story = {
  render: () => <ProjectsScreen install={machine} status={offline} projects={projects} />,
}
export const ServiceDown: Story = {
  render: () => <ProjectsScreen install={machine} status={serviceDown} projects={projects} />,
}
export const BlockedByPolicy: Story = {
  render: () => <ProjectsScreen install={machine} status={blockedEe} projects={projects} />,
}
export const NeedsRepair: Story = {
  render: () => (
    <ProjectsScreen install={machine} status={repair} projects={projects} onRepair={() => {}} />
  ),
}
