import type { LoadFailure } from '../../../model.ts'
/** @jsxRuntime automatic */
/*
  The review of one task (#629): the header with its state, the checks, and the tabs —
  changes, findings, discussion — with the decision bar pinned under the changes.
*/
import { View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { IconButton } from '../../../Button.tsx'
import { Callout } from '../../../Feedback.tsx'
import type { Attachment, InstallStatus } from '../../../model.ts'
import { RowGroup } from '../../../Row.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ThreadRow } from '../ask/list.tsx'
import type { AskThread, AskThreadRow } from '../ask/model.ts'
import { MessageList, ThinkingLine } from '../ask/messages.tsx'
import { ListSkeleton, LoadError, TabStrip } from '../parts.tsx'
import { ThreadComposer } from '../attachments.tsx'
import { ChecksBlock } from './checks.tsx'
import { DecisionBar } from './decide.tsx'
import { ChangesTab } from './files.tsx'
import { FindingsTab, type FindingFilter } from './findings.tsx'
import type { Review } from './model.ts'

export type ReviewTab = 'changes' | 'findings' | 'discuss'

export function ReviewScreen({
  status,
  review,
  tab = 'changes',
  loading = false,
  error = false,
  findingFilter,
  discussion,
  threads = [],
  onOpenThread,
  draft = '',
  onDraft,
  refreshing,
  onRefresh,
  staged = [],
  canApprove = true,
  canRework = true,
  canDecideFindings = true,
  canAddFinding = true,
  onBack,
  onTab,
  onOpenTask,
  onOpenFile,
  onPatch,
  onLog,
  onFindingFilter,
  onAddFinding,
  onAskFinding,
  onToFix,
  onDismiss,
  onEditFinding,
  onApprove,
  onRework,
  onAttach,
  onRemoveStaged,
  onSend,
  onOpenAttachment,
  onRetry,
}: {
  status: InstallStatus
  review?: Review
  tab?: ReviewTab
  loading?: boolean
  error?: LoadFailure
  findingFilter?: FindingFilter
  /** The discussion with the assistant, as an Ask thread; none = not started. */
  discussion?: AskThread
  /** The task's discussions; a message in the composer starts a new one. */
  threads?: AskThreadRow[]
  onOpenThread?: (id: string) => void
  draft?: string
  onDraft?: (text: string) => void
  refreshing?: boolean
  onRefresh?: () => void
  staged?: Attachment[]
  canApprove?: boolean
  canRework?: boolean
  canDecideFindings?: boolean
  canAddFinding?: boolean
  onBack?: () => void
  onTab?: (tab: ReviewTab) => void
  onOpenTask?: () => void
  onOpenFile?: (repo: string, path: string) => void
  onPatch?: (repo: string) => void
  onLog?: () => void
  onFindingFilter?: (f: FindingFilter) => void
  onAddFinding?: () => void
  onAskFinding?: (id: string) => void
  onToFix?: (id: string) => void
  onDismiss?: (id: string) => void
  onEditFinding?: (id: string) => void
  onApprove?: () => void
  onRework?: () => void
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  onSend?: () => void
  onOpenAttachment?: (id: string) => void
  onRetry?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const onGate = review?.phase === 'review'
  const readOnly = !live || !!review?.closed
  const openCount = review
    ? review.findings.filter((f) => f.status === 'pending' || f.status === 'approved').length
    : 0
  const tabs = [
    { id: 'changes', label: t('review.tabChanges') },
    { id: 'findings', label: t('review.tabFindings'), count: openCount },
    { id: 'discuss', label: t('review.tabDiscuss') },
  ]
  const thinking = discussion?.status === 'running' || discussion?.status === 'answering'
  const footer =
    review && tab !== 'discuss' && onGate ? (
      <DecisionBar
        review={review}
        canApprove={canApprove}
        canRework={canRework}
        disabled={!live}
        onApprove={onApprove}
        onRework={onRework}
      />
    ) : review && tab === 'discuss' && !review.closed && onSend ? (
      <ThreadComposer
        value={draft}
        placeholder={t('ask.followUpReview')}
        staged={staged}
        busy={thinking}
        disabled={!live}
        onValue={onDraft}
        canAttach={staged.length < 3}
        onAttach={onAttach}
        onRemoveStaged={onRemoveStaged}
        onSend={onSend}
      />
    ) : undefined
  return (
    <>
      <TopBar
        title={review ? t('review.ofTask', { n: review.task }) : t('cabinet.review')}
        subtitle={review?.prs[0]?.repo}
        onBack={onBack}
        actions={<IconButton icon="workflow" label={t('review.openTask')} onPress={onOpenTask} />}
      />
      <Screen footer={footer} refreshing={refreshing} onRefresh={onRefresh}>
        <InstallBanner status={status} />
        {loading || !review ? (
          error ? (
            <LoadError error={error} onRetry={onRetry} />
          ) : (
            <ListSkeleton rows={5} />
          )
        ) : (
          <>
            <View
              style={{
                paddingHorizontal: theme.space(4),
                paddingTop: theme.space(2),
                gap: theme.space(3),
              }}
            >
              <Text variant="title">{review.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Badge tone={onGate ? 'warn' : review.closed ? 'ok' : 'neutral'}>
                  {onGate
                    ? t('review.onReview')
                    : review.closed
                      ? t('review.merged')
                      : t('review.notOnGate')}
                </Badge>
                <Text variant="caption" tone="muted" style={{ flex: 1 }}>
                  {onGate
                    ? t('review.onReviewText', { when: review.since ?? '' })
                    : review.closed
                      ? t('review.mergedText')
                      : ''}
                </Text>
              </View>
              {review.checks && (
                <ChecksBlock
                  checks={review.checks}
                  onLog={onLog}
                  onFindings={() => onTab?.('findings')}
                />
              )}
            </View>
            <TabStrip tabs={tabs} selected={tab} onSelect={(id) => onTab?.(id as ReviewTab)} />
            {tab === 'changes' && (
              <ChangesTab
                review={review}
                disabled={!live}
                onOpenFile={onOpenFile}
                onPatch={onPatch}
              />
            )}
            {tab === 'findings' && (
              <FindingsTab
                findings={review.findings}
                filter={findingFilter}
                canAdd={canAddFinding && onGate}
                canDecide={canDecideFindings && onGate}
                disabled={readOnly}
                onFilter={onFindingFilter}
                onAdd={onAddFinding}
                onAsk={onAskFinding}
                onToFix={onToFix}
                onDismiss={onDismiss}
                onEdit={onEditFinding}
              />
            )}
            {tab === 'discuss' &&
              (discussion ? (
                <>
                  <MessageList messages={discussion.messages} onOpenAttachment={onOpenAttachment} />
                  {thinking && (
                    <ThinkingLine
                      elapsed={discussion.elapsed}
                      reasoning={discussion.liveReasoning}
                    />
                  )}
                </>
              ) : (
                <View
                  style={{
                    paddingHorizontal: theme.space(4),
                    paddingTop: theme.space(2),
                    gap: theme.space(3),
                  }}
                >
                  {review.closed ? (
                    <Callout tone="neutral">{t('ask.mergedNote')}</Callout>
                  ) : (
                    <>
                      <Text variant="heading">{t('ask.titleReview')}</Text>
                      <Text tone="fg2">{t('ask.introReview')}</Text>
                    </>
                  )}
                  {threads.length > 0 && (
                    <RowGroup>
                      {threads.map((th) => (
                        <ThreadRow
                          key={th.id}
                          thread={th}
                          fallbackTitle={t('ask.titleReview')}
                          onPress={() => onOpenThread?.(th.id)}
                        />
                      ))}
                    </RowGroup>
                  )}
                </View>
              ))}
          </>
        )}
      </Screen>
    </>
  )
}
