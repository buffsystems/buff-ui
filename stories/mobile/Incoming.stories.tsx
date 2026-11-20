import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomeScreen, IncomingBar, IncomingScreen, type Attachment } from '../../src/native/index.ts'
import { attention, installs } from './fixtures.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Что прислало другое приложение (#943): куда отправить, и плашка, пока вложение «в руке». */
const meta = {
  title: 'Mobile/Incoming',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const files: Attachment[] = [
  { id: 'a', name: 'IMG_2041.jpg', size: 1_840_000, kind: 'image' },
  { id: 'b', name: 'spec-v3.pdf', size: 412_000, kind: 'file' },
  { id: 'c', name: 'notes.txt', size: 980, kind: 'file' },
  { id: 'd', name: 'trace.log', size: 64_000, kind: 'file' },
]

export const Connections: Story = {
  render: () => <IncomingScreen files={files.slice(0, 2)} installs={installs} />,
}
export const ManyFilesAndText: Story = {
  render: () => (
    <IncomingScreen
      files={files}
      text="https://example.com/spec — посмотри раздел 4"
      installs={installs}
    />
  ),
}
export const TextOnly: Story = {
  render: () => (
    <IncomingScreen files={[]} text="https://example.com/article" installs={installs} />
  ),
}
export const CabinetPlaces: Story = {
  render: () => (
    <IncomingScreen files={files.slice(0, 1)} installs={installs} picked={installs[0]} />
  ),
}
export const Reading: Story = {
  render: () => <IncomingScreen files={[]} loading installs={installs} />,
}
export const Failed: Story = {
  render: () => <IncomingScreen files={[]} failed installs={installs} />,
}
export const NoConnections: Story = {
  render: () => <IncomingScreen files={files.slice(0, 1)} installs={[]} />,
}
export const BarOverHome: Story = {
  render: () => (
    <>
      <IncomingBar files={2} text />
      <HomeScreen installs={installs} attention={attention} />
    </>
  ),
}
