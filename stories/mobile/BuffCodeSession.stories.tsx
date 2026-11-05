import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SessionScreen,
  type SessionScreenProps,
  type ToolStatus,
} from '../../src/native/screens/buffcode/index.ts'
import {
  changes,
  commands,
  filesRefused,
  git,
  machine,
  offline,
  permission,
  permissionEdit,
  planning,
  projects,
  questions,
  sessions,
  subagents,
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

/** The machine works on the turn: the breathing brain and the timer under the timeline (#742). */
export const Running: Story = {
  render: () => <SessionScreen {...base} working={{ elapsed: '0:42' }} />,
}
/** The permission mode in the composer (#760): an icon of its own per mode; a tap opens the settings. */
export const ModeFullAccess: Story = {
  render: () => <SessionScreen {...base} running={false} mode="full" />,
}
export const ModePlan: Story = {
  render: () => <SessionScreen {...base} running={false} mode="ask" plan />,
}
/** A compaction (#761): the summary for the model opens on a tap; while it runs — shown as it is written. */
export const CompactionRunning: Story = {
  render: () => (
    <SessionScreen
      {...base}
      items={[
        ...timeline.slice(0, 3),
        {
          kind: 'compaction',
          id: 'c9',
          when: '14:40',
          status: 'running',
          summary:
            '## Цель\nЭкспорт отчётов в PDF с кириллицей.\n\n## Сделано\n- генератор на pdfkit',
        },
      ]}
    />
  ),
}
/** Tool calls in a row (#758): one folded line each run, as in the window; the last one at work. */
export const ToolGroups: Story = {
  render: () => {
    const call = (id: string, tool: string, title: string, status: ToolStatus = 'done') =>
      ({ kind: 'tool', id, tool, title, status }) as const
    return (
      <SessionScreen
        {...base}
        items={[
          { kind: 'user', id: 'u1', text: 'Почини экспорт PDF', when: '14:02' },
          call('t1', 'read', 'src/reports/pdf.ts'),
          call('t2', 'grep', 'fontkit'),
          call('t3', 'read', 'package.json'),
          call('t4', 'shell', 'bun test src/reports', 'error'),
          call('t5', 'shell', 'bun add fontkit'),
          {
            kind: 'assistant',
            id: 'a1',
            markdown: 'Не хватало `fontkit`. Поставил, перезапускаю тесты.',
          },
          call('t6', 'edit', 'src/reports/pdf.ts'),
          call('t7', 'shell', 'bun test src/reports', 'running'),
        ]}
      />
    )
  },
}
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
/** The model's to-do list and subagents (#752, #753, #762): cards in the timeline, the working ones behind the composer's icon. */
export const TodoAndSubagents: Story = {
  render: () => (
    <SessionScreen
      {...base}
      items={planning}
      subagents={subagents}
      onOpenSubagent={() => undefined}
    />
  ),
}
/** Subagents at work while a dock waits (#762): a line above the dock opens their list. */
export const SubagentsWithDock: Story = {
  render: () => (
    <SessionScreen
      {...base}
      items={planning}
      subagents={subagents}
      dock={{ kind: 'permission', request: { title: 'bun test', patterns: ['bun test *'] } }}
      onOpenSubagent={() => undefined}
    />
  ),
}
/** A subagent's session opened from its card (#753): read-only, the parent answers. */
export const SubagentReadOnly: Story = {
  render: () => (
    <SessionScreen
      {...base}
      session={{ ...base.session, title: 'Найти, как в проекте формируются PDF' }}
      items={planning.slice(0, 1)}
      readOnly
      running={false}
    />
  ),
}
/** The model refused a request with files (#757): analyse them with code, switch the model or go on without them. */
export const FilesRefused: Story = {
  render: () => (
    <SessionScreen {...base} running={false} items={filesRefused} onFileChoice={() => undefined} />
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
