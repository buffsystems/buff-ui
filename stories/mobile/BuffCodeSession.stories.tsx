import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionScreen, type SessionScreenProps } from '../../src/native/screens/buffcode/index.ts'
import {
  changes,
  commands,
  git,
  machine,
  offline,
  permission,
  permissionEdit,
  projects,
  questions,
  sessions,
  timeline,
  trust,
} from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Экран сессии: переключатель видов, лента, доки над композером, композер. */
const meta = {
  title: 'Mobile/BuffCode/Session',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
  // `base` is the props the stories share (and the Sidebar's stories borrow), not a story.
  excludeStories: ['base'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const base: SessionScreenProps = {
  install: machine,
  status: { kind: 'online' },
  session: sessions[0],
  project: projects[0],
  items: timeline,
  running: true,
  changes,
  git,
  model: 'Sonnet 5.5',
  agent: 'build',
  mode: 'edit',
  commands,
}

export const Running: Story = { render: () => <SessionScreen {...base} /> }
/** Scrolled up: the floating button brings the latest message back. */
export const ScrolledUp: Story = {
  render: () => <SessionScreen {...base} initialScroll="top" />,
}
export const Idle: Story = {
  render: () => (
    <SessionScreen
      {...base}
      running={false}
      items={timeline.slice(0, 5)}
      prompt="Теперь добавь кнопку"
      attachments={[
        { id: 'a1', name: 'button.png', size: 184320, kind: 'image', progress: 0.6 },
        { id: 'a2', name: 'spec.pdf', size: 1048576, kind: 'file' },
      ]}
    />
  ),
}
export const Empty: Story = {
  render: () => <SessionScreen {...base} running={false} items={[]} changes={[]} />,
}
export const Loading: Story = {
  render: () => <SessionScreen {...base} running={false} items={[]} loading view="changes" />,
}
export const PermissionDock: Story = {
  render: () => <SessionScreen {...base} dock={{ kind: 'permission', request: permission }} />,
}
export const PermissionSubagentEdit: Story = {
  render: () => <SessionScreen {...base} dock={{ kind: 'permission', request: permissionEdit }} />,
}
export const QuestionDock: Story = {
  render: () => <SessionScreen {...base} dock={{ kind: 'question', questions, index: 0 }} />,
}
export const QuestionMultiple: Story = {
  render: () => <SessionScreen {...base} dock={{ kind: 'question', questions, index: 1 }} />,
}
export const McpDock: Story = {
  render: () => (
    <SessionScreen
      {...base}
      dock={{
        kind: 'mcp',
        request: {
          server: 'buff-knowledge',
          message:
            'Добавить запись в базу знаний?\n\n> fontkit должен быть в `dependencies`, иначе тесты в production падают.',
          fields: [
            { key: 'title', kind: 'text', label: 'Заголовок', hint: 'Коротко, как правило' },
            { key: 'shared', kind: 'switch', label: 'Для всей организации' },
          ],
        },
      }}
    />
  ),
}
export const WebSearchDock: Story = {
  render: () => (
    <SessionScreen
      {...base}
      dock={{
        kind: 'websearch',
        request: {
          providers: [
            { id: 'tavily', name: 'Tavily' },
            { id: 'brave', name: 'Brave' },
          ],
        },
      }}
    />
  ),
}
export const TrustStripShown: Story = {
  render: () => <SessionScreen {...base} trust={trust} />,
}
export const SlashAutocomplete: Story = {
  render: () => <SessionScreen {...base} running={false} prompt="/re" slashQuery="/re" />,
}
export const Offline: Story = {
  render: () => <SessionScreen {...base} status={offline} running={false} />,
}
