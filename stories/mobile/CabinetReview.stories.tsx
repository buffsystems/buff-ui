import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ApproveSheet,
  BlockedSheet,
  FileDiffScreen,
  FindingSheet,
  ReviewNotOnGateScreen,
  ReviewQueueScreen,
  ReviewScreen,
  ReworkConfirmSheet,
} from '../../src/native/screens/cabinet/index.ts'
import {
  approveRepos,
  diffLines,
  offline,
  online,
  queue,
  review,
  reviewClosed,
  reviewFailed,
  shell,
  thread,
} from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Review',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Ревью: the queue of tasks awaiting a decision. */
export const Queue: Story = {
  render: () => <ReviewQueueScreen shell={shell} status={online} rows={queue} />,
}
export const QueueEmpty: Story = {
  render: () => <ReviewQueueScreen shell={shell} status={online} rows={[]} />,
}
export const QueueLoading: Story = {
  render: () => <ReviewQueueScreen shell={shell} status={online} rows={[]} loading />,
}
export const QueueError: Story = {
  render: () => <ReviewQueueScreen shell={shell} status={online} rows={[]} error />,
}
export const QueueOffline: Story = {
  render: () => <ReviewQueueScreen shell={shell} status={offline} rows={queue} />,
}

/** The review: checks, the files per pull request, the decision bar. */
export const Changes: Story = {
  render: () => <ReviewScreen status={online} review={review} />,
}
export const ChangesLandError: Story = {
  render: () => <ReviewScreen status={online} review={reviewFailed} />,
}
export const ChangesNoRight: Story = {
  render: () => (
    <ReviewScreen status={online} review={review} canApprove={false} canRework={false} />
  ),
}
export const Findings: Story = {
  render: () => <ReviewScreen status={online} review={review} tab="findings" />,
}
export const FindingsAll: Story = {
  render: () => <ReviewScreen status={online} review={review} tab="findings" findingFilter="all" />,
}
export const FindingsEmpty: Story = {
  render: () => (
    <ReviewScreen status={online} review={{ ...review, findings: [] }} tab="findings" />
  ),
}
export const Discuss: Story = {
  render: () => (
    <ReviewScreen
      status={online}
      review={review}
      tab="discuss"
      discussion={{ ...thread, task: 141 }}
      staged={[{ id: 's1', name: 'скриншот.png', size: 320_000, kind: 'image' }]}
    />
  ),
}
export const DiscussNew: Story = {
  render: () => <ReviewScreen status={online} review={review} tab="discuss" />,
}
export const Closed: Story = {
  render: () => <ReviewScreen status={online} review={reviewClosed} />,
}
export const Loading: Story = { render: () => <ReviewScreen status={online} loading /> }
export const Error: Story = { render: () => <ReviewScreen status={online} error /> }
export const Offline: Story = {
  render: () => <ReviewScreen status={offline} review={review} />,
}
export const NotOnGate: Story = {
  render: () => <ReviewNotOnGateScreen status={online} task={139} phase="implementing" />,
}
export const NotOnGateClosed: Story = {
  render: () => <ReviewNotOnGateScreen status={online} task={133} phase="none" closed />,
}
export const FileDiff: Story = {
  render: () => (
    <FileDiffScreen status={online} path="src/session/middleware.ts" lines={diffLines} />
  ),
}

export const Approve: Story = {
  render: () => (
    <>
      <ReviewScreen status={online} review={review} />
      <ApproveSheet repos={approveRepos} />
    </>
  ),
}
export const ApproveChecking: Story = {
  render: () => (
    <>
      <ReviewScreen status={online} review={review} />
      <ApproveSheet repos={[]} loading />
    </>
  ),
}
export const ApproveBlocked: Story = {
  render: () => (
    <>
      <ReviewScreen status={online} review={review} />
      <BlockedSheet open={2} />
    </>
  ),
}
export const ReworkConfirm: Story = {
  render: () => (
    <>
      <ReviewScreen status={online} review={review} />
      <ReworkConfirmSheet toFix={1} pending={1} />
    </>
  ),
}
export const ReworkDescribe: Story = {
  render: () => (
    <>
      <ReviewScreen status={online} review={review} />
      <FindingSheet
        mode="rework"
        draft={{ title: 'Переделать TTL', detail: '', attachments: [] }}
      />
    </>
  ),
}
export const NewFinding: Story = {
  render: () => (
    <>
      <ReviewScreen status={online} review={review} tab="findings" />
      <FindingSheet
        mode="add"
        draft={{
          title: '',
          detail: '',
          attachments: [{ id: 'a1', name: 'лог.txt', size: 4_000, kind: 'file', progress: 0.3 }],
        }}
      />
    </>
  ),
}
