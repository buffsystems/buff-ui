import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = { title: 'Content/Terminal' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RunLog: Story = {
  render: () => (
    <pre className="ui-terminal ui-terminal--framed" style={{ maxWidth: 640 }}>
      <span className="ui-ansi-gray">$ make update ROLE=frontend</span>
      {'\n'}
      <span className="ui-ansi-green ui-ansi-bold">ok:</span> [stand] клон на теге v0.13.0
      {'\n'}
      <span className="ui-ansi-yellow">changed:</span> [stand] образ собран
      {'\n'}
      <span className="ui-ansi-red">failed:</span> [edge] nginx -t
      {'\n'}
      <span className="ui-ansi-blue">PLAY RECAP</span> <span className="ui-ansi-cyan">stand</span>{' '}
      ok=12 <span className="ui-ansi-magenta">skipped=3</span>
    </pre>
  ),
}
