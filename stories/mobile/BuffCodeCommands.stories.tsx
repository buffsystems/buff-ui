import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ActionPaletteSheet,
  AttachSheet,
  PickerSheet,
  SessionScreen,
  type SessionScreenProps,
} from '../../src/native/screens/buffcode/index.ts'
import { agents, commands, machine, projects, sessions, timeline } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Команды через `/` и палитра действий сессии; меню вложений; смена агента. */
const meta = {
  title: 'Mobile/BuffCode/Commands',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const base: SessionScreenProps = {
  install: machine,
  status: { kind: 'online' },
  session: sessions[1],
  project: projects[0],
  items: timeline.slice(0, 4),
  commands,
  model: 'Sonnet 5.5',
  mode: 'ask',
}

export const SlashAll: Story = {
  render: () => <SessionScreen {...base} prompt="/" slashQuery="/" />,
}
export const SlashFiltered: Story = {
  render: () => <SessionScreen {...base} prompt="/rev" slashQuery="/rev" />,
}
export const SlashNoMatch: Story = {
  render: () => <SessionScreen {...base} prompt="/zzz" slashQuery="/zzz" />,
}
export const Palette: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <ActionPaletteSheet disabled={['redo']} />
    </>
  ),
}
export const Attach: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <AttachSheet />
    </>
  ),
}
export const SwitchAgent: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <PickerSheet
        title="Агент"
        icon="bot"
        items={agents.map((a) => ({ id: a.id, title: a.name }))}
        selectedId="build"
        emptyTitle=""
        emptyText=""
      />
    </>
  ),
}
