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
/** Страница (#808): по умолчанию отрисованной, «Код» — исходник. В приложении страницу рисует WebView. */
const PAGE =
  '<!doctype html>\n<html>\n  <body>\n    <h1>Отчёт за неделю</h1>\n    <p>Сборок: 42</p>\n  </body>\n</html>'
export const HtmlPage: Story = {
  render: () => (
    <SessionScreen
      {...base}
      view="files"
      openFile={{
        path: 'out/report.html',
        language: 'html',
        content: PAGE,
        page: (
          <iframe
            title="report.html"
            srcDoc={PAGE}
            sandbox=""
            style={{ border: 0, width: '100%', height: '100%', background: '#fff' }}
          />
        ),
      }}
    />
  ),
}
/** Файл в пути (#809): сколько пришло из скольких и сколько ещё ждать. */
export const FileDownloading: Story = {
  render: () => (
    <SessionScreen
      {...base}
      view="files"
      openFile={{
        path: 'docs/presentation.pdf',
        content: '',
        loading: true,
        progress: { done: 3.6 * 1024 * 1024, total: 9.4 * 1024 * 1024, eta: 14 },
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
/** The work mode (#894): Work, Plan, Setup as one switch on top of the session's settings. */
export const DetailsWorkMode: Story = {
  render: () => (
    <>
      <SessionScreen {...base} work="setup" />
      <SessionDetailsSheet
        details={details}
        model="Buff Large"
        onModel={() => {}}
        mode="Спрашивать"
        onMode={() => {}}
        work="setup"
        onWork={() => {}}
      />
    </>
  ),
}
/** The session's settings with the thinking mode (#759): the model's variant, changed from here. */
export const DetailsThinkingMode: Story = {
  render: () => (
    <>
      <SessionScreen {...base} variant="high" />
      <SessionDetailsSheet
        details={details}
        model="DeepSeek V4"
        onModel={() => undefined}
        variant="high"
        onVariant={() => undefined}
        mode="Править самому"
        onMode={() => undefined}
      />
    </>
  ),
}
/** The session's settings with the context window (#839): the cap beside the thinking mode. */
export const DetailsContextWindow: Story = {
  render: () => (
    <>
      <SessionScreen {...base} variant="high" />
      <SessionDetailsSheet
        details={details}
        model="DeepSeek V4"
        onModel={() => undefined}
        variant="high"
        onVariant={() => undefined}
        context={200_000}
        modelWindow={400_000}
        onContext={() => undefined}
        mode="Править самому"
        onMode={() => undefined}
      />
    </>
  ),
}
export const ChangesOffline: Story = {
  render: () => <SessionScreen {...base} status={offline} view="changes" />,
}
export const TerminalOffline: Story = {
  render: () => <SessionScreen {...base} status={offline} view="terminal" />,
}
