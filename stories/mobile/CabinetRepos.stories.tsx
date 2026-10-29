import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AddRepoSheet,
  RemoveRepoSheet,
  ReposListScreen,
} from '../../src/native/screens/cabinet/index.ts'
import { addForm, emptyAddForm, holds, offline, online, repos, shell } from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Repos',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Репозитории: every sync state, the token banner, the deferred merges. */
export const List: Story = {
  render: () => (
    <ReposListScreen
      shell={shell}
      status={online}
      repos={repos}
      holds={holds}
      onRemove={() => {}}
    />
  ),
}
export const ListInSync: Story = {
  render: () => (
    <ReposListScreen
      shell={shell}
      status={online}
      repos={repos.slice(1, 2).map((r) => ({ ...r, syncing: false }))}
    />
  ),
}
export const ListEmpty: Story = {
  render: () => <ReposListScreen shell={shell} status={online} repos={[]} />,
}
export const ListLoading: Story = {
  render: () => <ReposListScreen shell={shell} status={online} repos={[]} loading />,
}
export const ListError: Story = {
  render: () => <ReposListScreen shell={shell} status={online} repos={[]} error />,
}
export const ListOffline: Story = {
  render: () => (
    <ReposListScreen
      shell={shell}
      status={offline}
      repos={repos}
      holds={holds}
      onRemove={() => {}}
    />
  ),
}
export const Add: Story = {
  render: () => (
    <>
      <ReposListScreen shell={shell} status={online} repos={repos} />
      <AddRepoSheet form={addForm} />
    </>
  ),
}
export const AddEmpty: Story = {
  render: () => (
    <>
      <ReposListScreen shell={shell} status={online} repos={repos} />
      <AddRepoSheet form={emptyAddForm} />
    </>
  ),
}
export const AddInvalid: Story = {
  render: () => (
    <>
      <ReposListScreen shell={shell} status={online} repos={repos} />
      <AddRepoSheet
        form={{ ...addForm, url: 'git@gitlab.com:acme/quotes.git', devName: 'bad name' }}
      />
    </>
  ),
}
export const AddBusy: Story = {
  render: () => (
    <>
      <ReposListScreen shell={shell} status={online} repos={repos} />
      <AddRepoSheet form={addForm} busy statusText="Клонируем quotes-feed…" />
    </>
  ),
}
export const Remove: Story = {
  render: () => (
    <>
      <ReposListScreen shell={shell} status={online} repos={repos} />
      <RemoveRepoSheet name="legacy-tools" />
    </>
  ),
}
