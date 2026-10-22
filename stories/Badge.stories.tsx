import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, StatusDot } from '../src/react/index.ts'
import type { BadgeTone, StatusTone } from '../src/react/index.ts'

const meta = {
  title: 'Status/Badge',
  component: Badge,
  args: { children: 'В работе', tone: 'info', dot: true },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const tones: BadgeTone[] = ['neutral', 'info', 'ok', 'warn', 'crit', 'primary', 'outline']

export const Tones: Story = {
  render: () => (
    <div className="sb-stack">
      <div className="sb-row">
        {tones.map((tone) => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </div>
      <div className="sb-row">
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} dot>
            {tone}
          </Badge>
        ))}
      </div>
    </div>
  ),
}

const dotTones: StatusTone[] = ['neutral', 'info', 'ok', 'warn', 'crit']

export const StatusDots: Story = {
  render: () => (
    <div className="sb-stack">
      <div className="sb-row">
        {dotTones.map((tone) => (
          <span key={tone} className="sb-row">
            <StatusDot tone={tone} /> {tone}
          </span>
        ))}
      </div>
      <div className="sb-row">
        <StatusDot tone="info" pulse size={10} /> в работе (pulse)
      </div>
    </div>
  ),
}
