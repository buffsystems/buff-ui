import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DeleteSessionSheet,
  SessionActionsSheet,
  SessionsScreen,
} from '../../src/native/screens/buffcode/index.ts'
import { machine, offline, projects, sessions } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Сессии проекта: начатые из окна, консоли или с телефона продолжаются; новая — с телефона. */
const meta = {
  title: 'Mobile/BuffCode/Sessions',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const
const project = projects[0]

export const List: Story = {
  render: () => (
    <SessionsScreen
      install={machine}
      status={status}
      project={project}
      sessions={sessions}
      onMore={() => {}}
    />
  ),
}
/** Раздел «Настройка» машины (#765, #891): сессии настройки всех её проектов, «+» начинает новую. */
export const SetupPlace: Story = {
  render: () => (
    <SessionsScreen
      install={machine}
      status={status}
      setup
      sessions={[
        {
          ...sessions[0]!,
          id: 'setup-1',
          title: 'Рабочая почта',
          project: 'billing-service',
          running: false,
          attention: 0,
        },
        { ...sessions[3]!, id: 'setup-2', title: 'Папка с договорами', project: 'storefront' },
      ]}
      onMore={() => {}}
    />
  ),
}
export const SetupPlaceEmpty: Story = {
  render: () => <SessionsScreen install={machine} status={status} setup sessions={[]} />,
}
export const Empty: Story = {
  render: () => (
    <SessionsScreen install={machine} status={status} project={projects[2]} sessions={[]} />
  ),
}
export const Loading: Story = {
  render: () => (
    <SessionsScreen install={machine} status={status} project={project} sessions={[]} loading />
  ),
}
export const NoResults: Story = {
  render: () => (
    <SessionsScreen install={machine} status={status} project={project} sessions={[]} query="кэш" />
  ),
}
export const Offline: Story = {
  render: () => (
    <SessionsScreen
      install={machine}
      status={offline}
      project={project}
      sessions={sessions}
      onMore={() => {}}
    />
  ),
}
export const Actions: Story = {
  render: () => (
    <>
      <SessionsScreen install={machine} status={status} project={project} sessions={sessions} />
      <SessionActionsSheet session={sessions[1]} />
    </>
  ),
}
export const ConfirmDelete: Story = {
  render: () => (
    <>
      <SessionsScreen install={machine} status={status} project={project} sessions={sessions} />
      <DeleteSessionSheet session={sessions[1]} />
    </>
  ),
}
