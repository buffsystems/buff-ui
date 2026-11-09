import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AiModeChip,
  AiModeParamsCard,
  AskListScreen,
  AskThreadScreen,
  AttachSourceSheet,
  DeleteThreadSheet,
  NewQuestionScreen,
  RenameSheet,
  ThreadActionsSheet,
} from '../../src/native/screens/cabinet/index.ts'
import {
  offline,
  online,
  shell,
  thread,
  threads,
  threadThinking,
  threadWaiting,
} from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Ask',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Спросить: the threads — busy, waiting for you, done, failed. */
export const List: Story = {
  render: () => (
    <AskListScreen shell={shell} status={online} threads={threads} onActions={() => {}} />
  ),
}
/** A reader (#666): no «Новый вопрос»; actions only on the threads they may manage. */
export const ListReadOnly: Story = {
  render: () => (
    <AskListScreen
      shell={shell}
      status={online}
      threads={threads}
      canCreate={false}
      canManage={() => false}
      onActions={() => {}}
    />
  ),
}
export const ListEmpty: Story = {
  render: () => <AskListScreen shell={shell} status={online} threads={[]} />,
}
export const ListLoading: Story = {
  render: () => <AskListScreen shell={shell} status={online} threads={[]} loading />,
}
export const ListError: Story = {
  render: () => <AskListScreen shell={shell} status={online} threads={[]} error />,
}
export const ListOffline: Story = {
  render: () => (
    <AskListScreen shell={shell} status={offline} threads={threads} onActions={() => {}} />
  ),
}
export const ThreadActions: Story = {
  render: () => (
    <>
      <AskListScreen shell={shell} status={online} threads={threads} />
      <ThreadActionsSheet />
    </>
  ),
}
export const Rename: Story = {
  render: () => (
    <>
      <AskListScreen shell={shell} status={online} threads={threads} />
      <RenameSheet value="Как устроен деплой на стенд" />
    </>
  ),
}
export const DeleteConfirm: Story = {
  render: () => (
    <>
      <AskListScreen shell={shell} status={online} threads={threads} />
      <DeleteThreadSheet />
    </>
  ),
}

/** A thread: the question with a file, the answer with reasoning and an image, a follow-up. */
export const Thread: Story = {
  render: () => <AskThreadScreen status={online} thread={thread} onActions={() => {}} />,
}
export const ThreadThinking: Story = {
  render: () => <AskThreadScreen status={online} thread={threadThinking} />,
}
// #813: the follow-up stays open while Buff answers; the question sent meanwhile waits.
export const ThreadThinkingWithQueued: Story = {
  render: () => (
    <AskThreadScreen
      status={online}
      draft="И что с инвалидацией?"
      thread={{
        ...threadThinking,
        messages: [
          ...threadThinking.messages,
          { id: 'q1', role: 'user', content: 'И ещё: какой TTL ставить?', queued: true },
        ],
      }}
    />
  ),
}
export const ThreadWaiting: Story = {
  render: () => (
    <AskThreadScreen
      status={online}
      thread={threadWaiting}
      picks={{ q1: { options: [0], free: '' } }}
    />
  ),
}
export const ThreadComposing: Story = {
  render: () => (
    <AskThreadScreen
      status={online}
      thread={thread}
      draft="А как откатить миграции?"
      staged={[{ id: 's1', name: 'ошибка.png', size: 140_000, kind: 'image', progress: 0.6 }]}
    />
  ),
}
export const ThreadNoWrite: Story = {
  render: () => <AskThreadScreen status={online} thread={thread} canWrite={false} />,
}
export const ThreadLoading: Story = { render: () => <AskThreadScreen status={online} loading /> }
export const ThreadError: Story = { render: () => <AskThreadScreen status={online} error /> }
export const ThreadNotFound: Story = { render: () => <AskThreadScreen status={online} notFound /> }
export const ThreadOffline: Story = {
  render: () => <AskThreadScreen status={offline} thread={thread} />,
}
export const Attach: Story = {
  render: () => (
    <>
      <AskThreadScreen status={online} thread={thread} />
      <AttachSourceSheet />
    </>
  ),
}

export const NewQuestion: Story = {
  render: () => (
    <NewQuestionScreen status={online} place="Acme · billing-service" text="Где считается НДС?" />
  ),
}
export const NewQuestionSpace: Story = {
  render: () => <NewQuestionScreen status={online} kind="space" place="Acme · документы" />,
}
export const NewQuestionNoRight: Story = {
  render: () => (
    <NewQuestionScreen status={online} place="Acme · billing-service" canCreate={false} />
  ),
}
export const NewQuestionOffline: Story = {
  render: () => <NewQuestionScreen status={offline} place="Acme · billing-service" />,
}

// Режимы ИИ (#840): «Параметры ИИ» на форме вопроса — свёрнуто к тому, что применится; чип и
// служебная строка в открытой сессии.
const aiDefaults = { thinking: 'high', contextTokens: 200_000 }
export const NewWithAiParams: Story = {
  render: () => (
    <NewQuestionScreen
      status={online}
      place="acme · shop"
      params={
        <AiModeParamsCard
          thinking={null}
          contextTokens={null}
          defaults={aiDefaults}
          modelWindow={400_000}
          onPickThinking={() => undefined}
          onPickContext={() => undefined}
        />
      }
    />
  ),
}
export const NewWithAiParamsOpen: Story = {
  render: () => (
    <NewQuestionScreen
      status={online}
      place="acme · shop"
      params={
        <AiModeParamsCard
          thinking="low"
          contextTokens={null}
          defaults={aiDefaults}
          modelWindow={400_000}
          defaultOpen
          onPickThinking={() => undefined}
          onPickContext={() => undefined}
        />
      }
    />
  ),
}
export const ThreadWithAiMode: Story = {
  render: () => (
    <AskThreadScreen
      status={online}
      thread={{
        ...thread,
        messages: [
          thread.messages[0]!,
          {
            id: 'note-1',
            role: 'note',
            content: 'Иван: размышления — низкие',
            when: 'сегодня, 14:05',
          },
          ...thread.messages.slice(1),
        ],
      }}
      chip={
        <AiModeChip
          thinking="low"
          contextTokens={200_000}
          modelWindow={400_000}
          onPress={() => undefined}
        />
      }
      onActions={() => {}}
    />
  ),
}
