import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  GitSheet,
  SessionScreen,
  SideConversationScreen,
  TrustSheet,
  type SessionScreenProps,
} from '../../src/native/screens/buffcode/index.ts'
import {
  git,
  gitClean,
  machine,
  offline,
  projects,
  sessions,
  side,
  timeline,
  trust,
} from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Боковой разговор, Git (чип и диалог), полоса доверия. */
const meta = {
  title: 'Mobile/BuffCode/Side',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const
const base: SessionScreenProps = {
  install: machine,
  status,
  session: sessions[0],
  project: projects[0],
  items: timeline.slice(0, 4),
  git,
}

export const SideConversation: Story = {
  render: () => (
    <SideConversationScreen
      install={machine}
      status={status}
      title="fontkit в production"
      messages={side}
      draft="А как быть с peer-зависимостями?"
    />
  ),
}
export const SideAnswering: Story = {
  render: () => (
    <SideConversationScreen install={machine} status={status} messages={side.slice(0, 1)} running />
  ),
}
export const SideEmpty: Story = {
  render: () => <SideConversationScreen install={machine} status={status} messages={[]} />,
}
export const SideOffline: Story = {
  render: () => <SideConversationScreen install={machine} status={offline} messages={side} />,
}
export const GitChanges: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <GitSheet state={git} />
    </>
  ),
}
export const GitClean: Story = {
  render: () => (
    <>
      <SessionScreen {...base} git={gitClean} />
      <GitSheet state={gitClean} />
    </>
  ),
}
export const GitBusy: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <GitSheet state={git} busy="push" />
    </>
  ),
}
export const TrustList: Story = {
  render: () => (
    <>
      <SessionScreen {...base} trust={trust} />
      <TrustSheet items={trust} />
    </>
  ),
}
