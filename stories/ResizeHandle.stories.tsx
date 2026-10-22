import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizeHandle } from '../src/react/index.ts'

const meta = { title: 'Layout/ResizeHandle', component: ResizeHandle } satisfies Meta<
  typeof ResizeHandle
>

export default meta
type Story = StoryObj<typeof meta>

const pane = { padding: '0.75rem', overflow: 'hidden' } as const

function PanesDemo() {
  const [side, setSide] = useState(220)
  const [terminal, setTerminal] = useState(110)
  return (
    <div className="ui-panel" style={{ display: 'flex', height: 340, maxWidth: 720 }}>
      <aside className="ui-note" style={{ ...pane, width: side, background: 'var(--muted)' }}>
        Сессии — {side}px
      </aside>
      <ResizeHandle
        aria-label="Ширина списка сессий"
        direction="horizontal"
        size={side}
        min={160}
        max={360}
        onResize={setSide}
        style={{ marginInline: -4 }}
      />
      <main style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column' }}>
        <div className="ui-note" style={{ ...pane, flex: 1 }}>
          Лента сессии
        </div>
        <ResizeHandle
          aria-label="Высота терминала"
          direction="vertical"
          edge="start"
          size={terminal}
          min={60}
          max={240}
          onResize={setTerminal}
          style={{ marginBlock: -4 }}
        />
        <div
          className="ui-terminal"
          style={{ ...pane, height: terminal, borderRadius: 0, boxSizing: 'border-box' }}
        >
          $ make ci — {terminal}px
        </div>
      </main>
    </div>
  )
}

export const Panes: Story = {
  args: { 'aria-label': '', direction: 'horizontal', size: 0, min: 0, max: 0, onResize: () => {} },
  render: () => <PanesDemo />,
}

export const Focused: Story = {
  args: { 'aria-label': '', direction: 'horizontal', size: 0, min: 0, max: 0, onResize: () => {} },
  render: () => <PanesDemo />,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>('[role=separator]')?.focus()
  },
}
