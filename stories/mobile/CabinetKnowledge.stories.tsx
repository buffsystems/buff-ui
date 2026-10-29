import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ArchiveSheet,
  KnowledgeEditorScreen,
  KnowledgeEntryScreen,
  KnowledgeListScreen,
} from '../../src/native/screens/cabinet/index.ts'
import {
  emptyForm,
  entries,
  form,
  offline,
  online,
  passDone,
  passFailed,
  passPaused,
  passRunning,
  shell,
} from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Knowledge',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const projects = ['billing-service', 'web-cabinet']

/** База знаний: the entries with the pass card, the search and the filters. */
export const List: Story = {
  render: () => (
    <KnowledgeListScreen
      shell={shell}
      status={online}
      entries={entries}
      projects={projects}
      pass={passDone}
      canRefresh
    />
  ),
}
export const ListPassRunning: Story = {
  render: () => (
    <KnowledgeListScreen
      shell={shell}
      status={online}
      entries={entries}
      pass={passRunning}
      canRefresh
    />
  ),
}
export const ListPassPaused: Story = {
  render: () => (
    <KnowledgeListScreen shell={shell} status={online} entries={entries} pass={passPaused} />
  ),
}
export const ListPassFailed: Story = {
  render: () => (
    <KnowledgeListScreen shell={shell} status={online} entries={entries} pass={passFailed} />
  ),
}
export const ListFiltered: Story = {
  render: () => (
    <KnowledgeListScreen
      shell={shell}
      status={online}
      entries={entries}
      projects={projects}
      filters={['ai', 'type:rule']}
      query="тул"
    />
  ),
}
export const ListArchive: Story = {
  render: () => (
    <KnowledgeListScreen shell={shell} status={online} entries={entries} view="archive" />
  ),
}
export const ListArchiveEmpty: Story = {
  render: () => (
    <KnowledgeListScreen
      shell={shell}
      status={online}
      entries={entries.slice(0, 3)}
      view="archive"
    />
  ),
}
export const ListEmpty: Story = {
  render: () => <KnowledgeListScreen shell={shell} status={online} entries={[]} />,
}
export const ListLoading: Story = {
  render: () => <KnowledgeListScreen shell={shell} status={online} entries={[]} loading />,
}
export const ListError: Story = {
  render: () => <KnowledgeListScreen shell={shell} status={online} entries={[]} error />,
}
export const ListOffline: Story = {
  render: () => (
    <KnowledgeListScreen
      shell={shell}
      status={offline}
      entries={entries}
      pass={passDone}
      canRefresh
    />
  ),
}
export const Archive: Story = {
  render: () => (
    <>
      <KnowledgeListScreen shell={shell} status={online} entries={entries} />
      <ArchiveSheet reason="правило отменили" />
    </>
  ),
}

/** One entry: the body as prose, the meta, «Edit». */
export const Entry: Story = {
  render: () => <KnowledgeEntryScreen status={online} entry={entries[0]} />,
}
export const EntryNeedsReview: Story = {
  render: () => <KnowledgeEntryScreen status={online} entry={entries[1]} />,
}
export const EntryArchived: Story = {
  render: () => <KnowledgeEntryScreen status={online} entry={entries[3]} />,
}
export const EntryLoading: Story = {
  render: () => <KnowledgeEntryScreen status={online} loading />,
}
export const EntryError: Story = { render: () => <KnowledgeEntryScreen status={online} error /> }
export const EntryOffline: Story = {
  render: () => <KnowledgeEntryScreen status={offline} entry={entries[0]} />,
}

export const Editor: Story = {
  render: () => <KnowledgeEditorScreen status={online} form={form} editing />,
}
export const EditorNew: Story = {
  render: () => <KnowledgeEditorScreen status={online} form={emptyForm} />,
}
export const EditorPreview: Story = {
  render: () => <KnowledgeEditorScreen status={online} form={form} editing preview />,
}
export const EditorInvalid: Story = {
  render: () => (
    <KnowledgeEditorScreen
      status={online}
      form={{ ...form, name: 'Bad Name', body: 'token=sk-live-123' }}
      secretWarning
    />
  ),
}
export const EditorConflict: Story = {
  render: () => (
    <KnowledgeEditorScreen
      status={online}
      form={form}
      editing
      conflict={{
        by: 'ivan',
        title: 'Сборка требует тулчейн',
        description: 'Поставьте тулчейн',
        body: 'Нужен `make toolchain`.',
      }}
    />
  ),
}
export const EditorOffline: Story = {
  render: () => <KnowledgeEditorScreen status={offline} form={form} editing />,
}
