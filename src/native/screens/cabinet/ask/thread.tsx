/** @jsxRuntime automatic */
/*
  One Ask thread (#629): the person's bubbles on the right, Buff's answers as prose on the
  left, attachments under either, the «thinking» line with its timer, the analyst's
  question when it waits, and the composer. The message list is reused by a review's
  discussion tab.
*/
import { View } from 'react-native'
import { IconButton } from '../../../Button.tsx'
import { Callout, EmptyState } from '../../../Feedback.tsx'
import type { Attachment, InstallStatus } from '../../../model.ts'
import { Screen, TopBar } from '../../../Screen.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import { ThreadComposer } from '../attachments.tsx'
import { QuestionForm, type Picks } from '../questions.tsx'
import type { AskThread } from './model.ts'
import { MessageList, ThinkingLine } from './messages.tsx'

export function AskThreadScreen({
  status,
  thread,
  loading = false,
  error = false,
  notFound = false,
  canWrite = true,
  draft = '',
  staged = [],
  picks,
  onBack,
  onActions,
  onPick,
  onAnswer,
  onAttach,
  onRemoveStaged,
  onSend,
  onOpenAttachment,
  onRetry,
  onDraft,
  onFree,
  cost,
}: {
  status: InstallStatus
  thread?: AskThread
  loading?: boolean
  error?: boolean
  notFound?: boolean
  canWrite?: boolean
  draft?: string
  staged?: Attachment[]
  picks?: Picks
  onBack?: () => void
  onActions?: () => void
  onPick?: (questionId: string, option: number) => void
  onAnswer?: () => void
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  onSend?: () => void
  onOpenAttachment?: (id: string) => void
  onRetry?: () => void
  /** The follow-up as typed. */
  onDraft?: (text: string) => void
  /** The person's own answer to Buff's question. */
  onFree?: (questionId: string, text: string) => void
  /** What the thread cost so far: «12 ₽ · 41 тыс. токенов». */
  cost?: string
}) {
  const t = useT()
  const live = status.kind === 'online'
  const title = thread?.title ?? t('ask.fallbackTitle')
  const body = loading ? (
    <ListSkeleton rows={5} />
  ) : error ? (
    <LoadError text={t('ask.threadError')} onRetry={onRetry} />
  ) : notFound || !thread ? (
    <EmptyState icon="inbox" title={t('ask.notFound')} text={t('ask.notFoundText')} />
  ) : (
    <ThreadBody
      thread={thread}
      picks={picks}
      canWrite={canWrite}
      disabled={!live}
      onPick={onPick}
      onFree={onFree}
      onAnswer={onAnswer}
      onOpenAttachment={onOpenAttachment}
    />
  )
  const thinking = thread?.status === 'running' || thread?.status === 'answering'
  const pending = thread?.status === 'waiting'
  return (
    <>
      <TopBar
        title={title}
        subtitle={[thread?.project, cost].filter(Boolean).join(' · ') || undefined}
        onBack={onBack}
        actions={
          thread && onActions ? (
            <IconButton
              icon="ellipsis"
              label={t('devd.actions')}
              onPress={onActions}
              disabled={!live}
            />
          ) : undefined
        }
      />
      <Screen
        follow
        footer={
          thread && canWrite ? (
            <ThreadComposer
              value={draft}
              placeholder={
                pending
                  ? t('ask.answerPending')
                  : thread.task
                    ? t('ask.followUpReview')
                    : t('ask.followUp')
              }
              staged={staged}
              busy={thinking}
              disabled={!live || pending}
              canAttach={staged.length < 3}
              onAttach={onAttach}
              onRemoveStaged={onRemoveStaged}
              onSend={onSend}
              onValue={onDraft}
            />
          ) : thread ? (
            <Callout tone="neutral">{t('ask.noWrite')}</Callout>
          ) : undefined
        }
      >
        <InstallBanner status={status} />
        {body}
      </Screen>
    </>
  )
}

function ThreadBody({
  thread,
  picks,
  canWrite,
  disabled,
  onPick,
  onFree,
  onAnswer,
  onOpenAttachment,
}: {
  thread: AskThread
  picks?: Picks
  canWrite: boolean
  disabled: boolean
  onPick?: (questionId: string, option: number) => void
  onFree?: (questionId: string, text: string) => void
  onAnswer?: () => void
  onOpenAttachment?: (id: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const last = thread.messages[thread.messages.length - 1]
  const asked = thread.status === 'waiting' && last?.role === 'assistant' && last.questions
  return (
    <>
      <MessageList messages={thread.messages} onOpenAttachment={onOpenAttachment} />
      {(thread.status === 'running' || thread.status === 'answering') && (
        <ThinkingLine elapsed={thread.elapsed} reasoning={thread.liveReasoning} />
      )}
      {asked && canWrite && (
        <View style={{ paddingHorizontal: theme.space(4) }}>
          <QuestionForm
            title={t('q.analystAsks')}
            questions={last.questions ?? []}
            picks={picks}
            sendLabel={t('q.answer')}
            disabled={disabled}
            onPick={onPick}
            onFree={onFree}
            onSend={onAnswer}
          />
        </View>
      )}
    </>
  )
}
