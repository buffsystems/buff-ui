import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, Skeleton, SkeletonBlock, Spinner } from '../src/react/index.ts'

const meta = { title: 'Feedback/Loading & keys', component: Spinner } satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 360 }}>
      <div className="sb-row">
        <Spinner /> <Spinner size={24} />
      </div>
      <SkeletonBlock label="Загрузка задач">
        <div className="sb-stack">
          <Skeleton style={{ height: 20, width: '60%' }} />
          <Skeleton style={{ height: 14, width: '90%' }} />
          <Skeleton style={{ height: 14, width: '75%' }} />
        </div>
      </SkeletonBlock>
    </div>
  ),
}

export const KeyCaps: Story = {
  render: () => (
    <div className="sb-row">
      Поиск <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
}
