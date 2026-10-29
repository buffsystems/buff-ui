import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SessionScreen,
  SessionDetailsSheet,
  ViewMenu,
  type SessionScreenProps,
} from '../../src/native/screens/buffcode/index.ts'
import {
  changes,
  details,
  files,
  machine,
  offline,
  projects,
  sessions,
  terminal,
  timeline,
  usage,
} from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Виды сессии: изменения, файлы, терминал, расход — и меню «…» с «О сессии». */
const meta = {
  title: 'Mobile/BuffCode/Views',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const base: SessionScreenProps = {
  install: machine,
  status: { kind: 'online' },
  session: sessions[0],
  project: projects[0],
  items: timeline,
  changes,
  nodes: files,
  terminal,
  usage,
}

export const Changes: Story = { render: () => <SessionScreen {...base} view="changes" /> }
export const ChangesEmpty: Story = {
  render: () => <SessionScreen {...base} view="changes" changes={[]} />,
}
export const Files: Story = { render: () => <SessionScreen {...base} view="files" /> }
export const FileOpen: Story = {
  render: () => (
    <SessionScreen
      {...base}
      view="files"
      openFile={{
        path: 'src/reports/export.ts',
        language: 'ts',
        content:
          "import { renderToBuffer } from '@react-pdf/renderer'\nimport { Report } from './Report'\n\nexport async function exportReport(id: string) {\n  return renderToBuffer(<Report id={id} />)\n}",
      }}
    />
  ),
}
export const Terminal: Story = { render: () => <SessionScreen {...base} view="terminal" /> }
export const Usage: Story = { render: () => <SessionScreen {...base} view="usage" /> }
export const Menu: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <ViewMenu />
    </>
  ),
}
export const Details: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <SessionDetailsSheet details={details} />
    </>
  ),
}
export const ChangesOffline: Story = {
  render: () => <SessionScreen {...base} status={offline} view="changes" />,
}
export const TerminalOffline: Story = {
  render: () => <SessionScreen {...base} status={offline} view="terminal" />,
}
