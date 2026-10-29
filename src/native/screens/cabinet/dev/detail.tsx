/** @jsxRuntime automatic */
/*
  One task (#629): its header with the status, the stage strip, and the tabs — details,
  subtasks, tests, history, metrics. The sheets (actions, export, rework, reject) are drawn
  by the host over this screen.
*/
import { View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button, IconButton } from '../../../Button.tsx'
import { Callout, EmptyState } from '../../../Feedback.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import type { Attachment } from '../../../model.ts'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, TabStrip } from '../parts.tsx'
import type { Picks } from '../questions.tsx'
import { TestsTab, type TestFilter } from './changes.tsx'
import { pauseLine } from './controls.tsx'
import { DetailsTab } from './details-tab.tsx'
import { GateActions } from './gate.tsx'
import { HistoryTab, MetricsTiles } from './history.tsx'
import type { HistoryEvent, TaskDetail, TestEntry } from './model.ts'
import { StageStrip, taskStatus } from './stage.tsx'
import { SubtasksTab } from './subtasks.tsx'

export type DetailTab = 'details' | 'subtasks' | 'tests' | 'history' | 'metrics'

export function TaskDetailScreen({
  status,
  task,
  tab = 'details',
  loading = false,
  notFound = false,
  tests = [],
  testFilter,
  history = [],
  picks,
  canAct = true,
  canClarify,
  canGate,
  canBaseline,
  gateSent = false,
  onBack,
  onTab,
  onActions,
  onExport,
  onOpenReview,
  onOpenSubtask,
  onOpenChanges,
  onPick,
  onFree,
  onBaseline,
  staged,
  onRemoveStaged,
  notice,
  onAttach,
  onSendAnswers,
  onApprove,
  onRework,
  onReject,
  onTestFilter,
  onOpenEvent,
  onOpenAttachment,
  onToList,
}: {
  status: InstallStatus
  task?: TaskDetail
  tab?: DetailTab
  loading?: boolean
  notFound?: boolean
  tests?: TestEntry[]
  testFilter?: TestFilter
  history?: HistoryEvent[]
  picks?: Picks
  canAct?: boolean
  /** The clarify answer, the formulation gate and the baseline decision — each its own right (#666). */
  canClarify?: boolean
  canGate?: boolean
  canBaseline?: boolean
  gateSent?: boolean
  onBack?: () => void
  onTab?: (tab: DetailTab) => void
  onActions?: () => void
  onExport?: () => void
  onOpenReview?: () => void
  onOpenSubtask?: (n: number) => void
  onOpenChanges?: () => void
  onPick?: (questionId: string, option: number) => void
  onFree?: (questionId: string, text: string) => void
  onBaseline?: (decision: 'ignore_task' | 'permanent' | 'later') => void
  staged?: Attachment[]
  onRemoveStaged?: (id: string) => void
  /** A warning over the run: the org's model spending ceiling reached (the cabinet's CeilingNotice). */
  notice?: string
  onAttach?: () => void
  onSendAnswers?: () => void
  onApprove?: () => void
  onRework?: () => void
  onReject?: () => void
  onTestFilter?: (f: TestFilter) => void
  onOpenEvent?: (id: string) => void
  onOpenAttachment?: (id: string) => void
  onToList?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const number = task?.number ?? 0
  if (notFound || (!task && !loading))
    return (
      <>
        <TopBar title={t('dev.task', { n: number })} onBack={onBack} />
        <Screen scroll={false}>
          <EmptyState
            icon="inbox"
            title={t('devd.notFound', { n: number })}
            text={t('devd.notFoundText')}
            action={{ label: t('devd.toList'), onPress: onToList }}
          />
        </Screen>
      </>
    )
  if (!task)
    return (
      <>
        <TopBar title={t('common.loading')} onBack={onBack} />
        <Screen>
          <InstallBanner status={status} />
          <ListSkeleton rows={5} />
        </Screen>
      </>
    )
  const st = taskStatus(t, task)
  const tabs = [
    { id: 'details', label: t('devd.tabDetails') },
    ...(task.subtasks.length > 0
      ? [{ id: 'subtasks', label: t('devd.tabSubtasks'), count: task.subtasksTotal }]
      : []),
    {
      id: 'tests',
      label: t('devd.tabTests'),
      count: tests.filter((x) => x.status === 'disabled').length || undefined,
    },
    { id: 'history', label: t('devd.tabHistory') },
    { id: 'metrics', label: t('devd.tabMetrics') },
  ]
  const running =
    !task.paused && ['running', 'decomposing', 'preparing', 'implementing'].includes(task.phase)
  // Waiting on the gate, its decisions stay in reach while the formulation scrolls (#692).
  const gatePinned =
    tab === 'details' &&
    task.phase === 'gate' &&
    !!task.formulation &&
    (canGate ?? canAct) &&
    !gateSent
  return (
    <>
      <TopBar
        title={t('dev.task', { n: task.number })}
        onBack={onBack}
        actions={
          <>
            {task.exportable && (
              <IconButton icon="download" label={t('devt.exportTitle')} onPress={onExport} />
            )}
            {onActions && (
              <IconButton
                icon="ellipsis"
                label={t('devd.actions')}
                onPress={onActions}
                disabled={!live}
              />
            )}
          </>
        }
      />
      <Screen
        footer={
          gatePinned ? (
            <View style={{ padding: theme.space(3) }}>
              <GateActions
                disabled={!live}
                onApprove={onApprove}
                onRework={onRework}
                onReject={onReject}
              />
            </View>
          ) : undefined
        }
      >
        <InstallBanner status={status} />
        <View
          style={{
            paddingHorizontal: theme.space(4),
            paddingTop: theme.space(2),
            gap: theme.space(3),
          }}
        >
          <Text variant="title">{task.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone={st.tone}>{st.label}</Badge>
            {task.paused && (
              <Badge tone="warn" icon="pause">
                {t('dev.paused')}
              </Badge>
            )}
            <Text variant="caption" tone="muted" style={{ flex: 1 }} numberOfLines={2}>
              {task.paused ? pauseLine(t, task.paused) : (task.stageNotes[task.stage.id] ?? '')}
            </Text>
          </View>
          {task.phase === 'review' && (
            <Button
              variant="primary"
              leadingIcon="gitPullRequest"
              block
              disabled={!live}
              onPress={onOpenReview}
            >
              {t('devd.toReview')}
            </Button>
          )}
          {task.state === 'closed' && task.phase !== 'review' && (
            <Button leadingIcon="gitPullRequest" block onPress={onOpenReview}>
              {t('devd.reviewHistory')}
            </Button>
          )}
          <StageStrip
            stage={task.stage}
            notes={task.stageNotes}
            paused={!!task.paused}
            running={running}
          />
        </View>
        {notice && (
          <View style={{ paddingHorizontal: theme.space(4) }}>
            <Callout tone="warn" icon="zap">
              {notice}
            </Callout>
          </View>
        )}
        <TabStrip tabs={tabs} selected={tab} onSelect={(id) => onTab?.(id as DetailTab)} />
        {tab === 'details' && (
          <DetailsTab
            task={task}
            picks={picks}
            canAct={canAct}
            canClarify={canClarify}
            canGate={canGate}
            canBaseline={canBaseline}
            disabled={!live}
            gateSent={gateSent}
            onPick={onPick}
            onFree={onFree}
            onBaseline={onBaseline}
            staged={staged}
            onRemoveStaged={onRemoveStaged}
            onAttach={onAttach}
            onSendAnswers={onSendAnswers}
            onApprove={onApprove}
            onRework={onRework}
            onReject={onReject}
            onOpenAttachment={onOpenAttachment}
            gatePinned={gatePinned}
          />
        )}
        {tab === 'subtasks' && <SubtasksTab task={task} onOpen={onOpenSubtask} />}
        {tab === 'tests' && <TestsTab tests={tests} filter={testFilter} onFilter={onTestFilter} />}
        {tab === 'history' && <HistoryTab events={history} onOpen={onOpenEvent} />}
        {tab === 'metrics' && <MetricsTiles metrics={task.metrics} onOpenChanges={onOpenChanges} />}
      </Screen>
    </>
  )
}
