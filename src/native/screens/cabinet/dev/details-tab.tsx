/** @jsxRuntime automatic */
/*
  The «Details» tab of a task (#629): where the pipeline is, the upstream hold, the original
  statement with its attachments, the gate, the answered clarifications, the formulation
  and the decomposition report.
*/
import { View } from 'react-native'
import { Card } from '../../../Card.tsx'
import { Disclosure } from '../../../Disclosure.tsx'
import { Callout, Spinner } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import type { Translate } from '../../../i18n.ts'
import { Prose } from '../../../Prose.tsx'
import { Row, RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { AttachmentRow } from '../attachments.tsx'
import type { Picks } from '../questions.tsx'
import type { Attachment } from '../../../model.ts'
import { BaselinePanel, ClarifyPanel, GatePanel } from './gate.tsx'
import type { TaskDetail } from './model.ts'

const STEP_KEY = {
  sync: 'devd.stepSync',
  conflicts: 'devd.stepConflicts',
  acceptance: 'devd.stepAcceptance',
  rework: 'devd.stepRework',
  open_prs: 'devd.stepOpenPrs',
} as const

/** The one sentence of where the task is, first match wins — as the web's FormulationStatus. */
export function statusText(t: Translate, task: TaskDetail): string {
  if (task.paused) return t('devd.stPaused')
  if (task.step) return t(STEP_KEY[task.step])
  switch (task.phase) {
    case 'running':
      return t('devd.stRunning')
    case 'clarify':
      return t('devd.stClarify')
    case 'gate':
      return t('devd.stGate')
    case 'decomposing':
      return t('devd.stDecomposing')
    case 'preparing':
      return t('devd.stPreparing')
    case 'implementing':
      return t('devd.stImplementing')
    case 'review':
      return t('devd.stReview')
    default:
      return task.subtasksTotal > 0 && task.subtasksDone === task.subtasksTotal
        ? t('devd.stDone')
        : t('devd.stIdle')
  }
}

function StatusCallout({ task }: { task: TaskDetail }) {
  const t = useT()
  const theme = useTheme()
  const active =
    !task.paused && ['running', 'decomposing', 'preparing', 'implementing'].includes(task.phase)
  return (
    <Card tone="muted" style={{ gap: theme.space(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {active ? <Spinner /> : <Icon name="info" size={18} color={theme.colors.primary} />}
        <Text variant="label" style={{ flex: 1 }}>
          {statusText(t, task)}
        </Text>
      </View>
      {(task.stepElapsed || task.subtasksTotal > 0) && (
        <Text variant="caption" tone="muted">
          {[
            task.stepElapsed && t('devd.stepOf', { elapsed: task.stepElapsed }),
            task.subtasksTotal > 0 &&
              t('devd.subtasksLine', { done: task.subtasksDone, total: task.subtasksTotal }),
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      )}
      {task.inProgress && task.inProgress.length > 0 && (
        <View style={{ gap: 4 }}>
          <Text variant="caption" tone="muted">
            {task.inProgress.length > 1
              ? t('devd.nowParallel', { n: task.inProgress.length })
              : t('devd.now')}
          </Text>
          {task.inProgress.map((a) => (
            <Text key={a.number} variant="caption">
              {`#${a.number} «${a.title}» — ${a.stage}`}
            </Text>
          ))}
        </View>
      )}
    </Card>
  )
}

export function DetailsTab({
  task,
  picks,
  canAct = true,
  canClarify = canAct,
  canGate = canAct,
  canBaseline = canAct,
  disabled = false,
  gateSent = false,
  onPick,
  onFree,
  onBaseline,
  staged,
  onRemoveStaged,
  onAttach,
  onSendAnswers,
  onApprove,
  onRework,
  onReject,
  onOpenAttachment,
  gatePinned = false,
}: {
  task: TaskDetail
  /** The gate's decisions are in the screen's footer. */
  gatePinned?: boolean
  picks?: Picks
  canAct?: boolean
  /** Each decision has its own right in the cabinet (#666); unset — `canAct`. */
  canClarify?: boolean
  canGate?: boolean
  canBaseline?: boolean
  disabled?: boolean
  gateSent?: boolean
  onPick?: (questionId: string, option: number) => void
  onFree?: (questionId: string, text: string) => void
  /** A decision on the baseline gate; «later» decides nothing — the task waits. */
  onBaseline?: (decision: 'ignore_task' | 'permanent' | 'later') => void
  /** Files staged for the answer, and how to drop one. */
  staged?: Attachment[]
  onRemoveStaged?: (id: string) => void
  onAttach?: () => void
  onSendAnswers?: () => void
  onApprove?: () => void
  onRework?: () => void
  onReject?: () => void
  onOpenAttachment?: (id: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  // A decision waits: it leads the tab and states itself, the statement folds under it (#692).
  const waiting =
    (task.phase === 'clarify' && !!task.questions) ||
    !!task.baseline ||
    (task.phase === 'gate' && !!task.formulation)
  const showStatus =
    !waiting && task.phase !== 'review' && (task.phase !== 'none' || task.subtasksTotal > 0)
  const statementTitle = task.devprep ? t('devd.devprepTitle') : t('devd.postanovka')
  const statementMeta =
    task.attachments.length > 0 ? t('devd.attachmentsN', { n: task.attachments.length }) : undefined
  const statement = (
    <>
      {task.postanovka ? (
        <Prose markdown={task.postanovka} title={task.title} />
      ) : (
        <Text tone="muted">{t('devd.none')}</Text>
      )}
      {task.attachments.length > 0 && (
        <RowGroup title={t('cabinet.attachments')}>
          {task.attachments.map((a) => (
            <AttachmentRow key={a.id} attachment={a} onOpen={() => onOpenAttachment?.(a.id)} />
          ))}
        </RowGroup>
      )}
    </>
  )
  return (
    <View
      style={{ paddingHorizontal: theme.space(4), paddingTop: theme.space(2), gap: theme.space(3) }}
    >
      {task.hold ? (
        <Callout
          tone="ok"
          title={t('devd.holdTitle', { merged: task.hold.merged, total: task.hold.total })}
        >
          {`${task.hold.repos.map((r) => `${r.merged ? '✓' : '◷'} ${r.repo} → ${r.upstream} (${r.base})${r.pr ? ` #${r.pr}` : ''}`).join('\n')}\n${t('devd.holdNote')}`}
        </Callout>
      ) : (
        showStatus && <StatusCallout task={task} />
      )}
      {task.phase === 'clarify' && task.questions && (
        <ClarifyPanel
          questions={task.questions}
          picks={picks}
          canAnswer={canClarify}
          disabled={disabled}
          sent={gateSent}
          onPick={onPick}
          onFree={onFree}
          staged={staged}
          onRemoveStaged={onRemoveStaged}
          onAttach={onAttach}
          onSend={onSendAnswers}
        />
      )}
      {task.baseline && (
        <BaselinePanel
          invite={task.baseline.invite}
          canDecide={canBaseline}
          disabled={disabled}
          sent={gateSent}
          onIgnoreTask={() => onBaseline?.('ignore_task')}
          onPermanent={() => onBaseline?.('permanent')}
          onLater={() => onBaseline?.('later')}
        />
      )}
      {task.phase === 'gate' && task.formulation && (
        <GatePanel
          formulation={task.formulation}
          canDecide={canGate}
          disabled={disabled}
          sent={gateSent}
          pinned={gatePinned}
          onApprove={onApprove}
          onRework={onRework}
          onReject={onReject}
        />
      )}
      {waiting ? (
        <Disclosure title={statementTitle} meta={statementMeta}>
          {statement}
        </Disclosure>
      ) : (
        <>
          <Text variant="heading">{statementTitle}</Text>
          {statement}
        </>
      )}
      {task.clarifications.length > 0 && (
        <>
          <Text variant="heading">{t('devd.clarifications')}</Text>
          <Text variant="caption" tone="muted">
            {t('devd.clarificationsNote', { n: task.clarifications.length })}
          </Text>
          <RowGroup>
            {task.clarifications.map((c, i) => (
              <Row key={i} title={c.question} subtitle={c.answer ?? t('devd.noAnswer')} lines={3} />
            ))}
          </RowGroup>
        </>
      )}
      {task.formulation && task.phase !== 'gate' && (
        <>
          <Text variant="heading">
            {task.stage.index >= 2 ? t('devd.finalFormulation') : t('devd.currentFormulation')}
          </Text>
          <Prose markdown={task.formulation} />
        </>
      )}
      {task.decompositionReport && (
        <>
          <Text variant="heading">{t('devd.decompositionReport')}</Text>
          <Prose markdown={task.decompositionReport} />
        </>
      )}
    </View>
  )
}
