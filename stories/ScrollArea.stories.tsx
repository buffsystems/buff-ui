import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from '../src/react/index.ts'

const meta = { title: 'Layout/ScrollArea', component: ScrollArea } satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const steps = Array.from({ length: 30 }, (_, i) => `Шаг ${i + 1}: чтение, правка, проверка`)

export const Panes: Story = {
  render: () => (
    <div className="sb-row" style={{ alignItems: 'flex-start' }}>
      <ScrollArea
        type="always"
        aria-label="Шаги"
        className="ui-panel"
        style={{ height: 220, width: 280 }}
        viewportProps={{ tabIndex: 0 }}
      >
        <ol className="ui-note" style={{ margin: 0, padding: '0.75rem 1.5rem' }}>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </ScrollArea>
      <ScrollArea
        type="always"
        orientation="both"
        className="ui-panel"
        style={{ height: 220, width: 280 }}
      >
        <pre style={{ margin: 0, padding: '0.75rem', font: '12px var(--font-mono)' }}>
          {steps.map((step) => `${step} — ${'длинная строка лога '.repeat(4)}`).join('\n')}
        </pre>
      </ScrollArea>
    </div>
  ),
}

const files = Array.from({ length: 14 }, (_, i) => `src/module-${i + 1}/index.ts`)

export const Horizontal: Story = {
  render: () => (
    <div className="sb-stack">
      <ScrollArea
        type="always"
        orientation="horizontal"
        className="ui-panel"
        style={{ width: 320 }}
      >
        <div className="sb-row" style={{ flexWrap: 'nowrap', padding: '0.5rem 0.5rem 0.75rem' }}>
          {files.map((file) => (
            <span key={file} className="ui-badge ui-badge--outline">
              {file}
            </span>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea
        type="scroll"
        orientation="horizontal"
        className="ui-panel"
        style={{ width: 320 }}
      >
        <pre style={{ margin: 0, padding: '0.75rem', font: '12px var(--font-mono)' }}>
          {'const line = "одна очень длинная строка кода, которая не помещается в панель"'}
        </pre>
      </ScrollArea>
    </div>
  ),
}
