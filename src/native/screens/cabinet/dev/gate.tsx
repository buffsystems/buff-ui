/** @jsxRuntime automatic */
/*
  The gate of a task (#629): the analyst's clarifying questions, and the decision on the
  ready formulation — approve, rework with a note, reject after a confirmation.
*/
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout, Skeleton } from '../../../Feedback.tsx'
import { Field, Input } from '../../../Field.tsx'
import type { Attachment } from '../../../model.ts'
import { Prose } from '../../../Prose.tsx'
import { RowGroup } from '../../../Row.tsx'
import { Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { AttachmentRow } from '../attachments.tsx'
import { QuestionForm, type Picks, type Question } from '../questions.tsx'

/** The clarify step: questions, an attach row, «Answer». */
export function ClarifyPanel({
  questions,
  picks,
  staged = [],
  canAnswer = true,
  disabled = false,
  sent = false,
  onPick,
  onFree,
  onAttach,
  onRemoveStaged,
  onSend,
}: {
  questions: Question[]
  picks?: Picks
  staged?: Attachment[]
  canAnswer?: boolean
  disabled?: boolean
  /** Sent, waiting for the analyst to take the answers. */
  sent?: boolean
  onPick?: (questionId: string, option: number) => void
  onFree?: (questionId: string, text: string) => void
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  onSend?: () => void
}) {
  const t = useT()
  if (sent) return <SentNote text={t('devd.sentClarify')} />
  if (!canAnswer) return <Callout tone="neutral">{t('devd.noRightClarify')}</Callout>
  return (
    <QuestionForm
      title={t('q.analystAsks')}
      questions={questions}
      picks={picks}
      sendLabel={t('q.answer')}
      disabled={disabled}
      onPick={onPick}
      onFree={onFree}
      onSend={onSend}
    >
      {staged.length > 0 && (
        <RowGroup>
          {staged.map((a) => (
            <AttachmentRow
              key={a.id}
              attachment={a}
              onRemove={() => onRemoveStaged?.(a.id)}
              disabled={disabled}
            />
          ))}
        </RowGroup>
      )}
      <Button variant="ghost" leadingIcon="paperclip" onPress={onAttach} disabled={disabled}>
        {t('cabinet.attach')}
      </Button>
    </QuestionForm>
  )
}

/** The three decisions on a formulation: pinned under the task screen while it waits (#692). */
export function GateActions({
  disabled = false,
  onApprove,
  onRework,
  onReject,
}: {
  disabled?: boolean
  onApprove?: () => void
  onRework?: () => void
  onReject?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ gap: theme.space(2) }}>
      <Button variant="primary" leadingIcon="check" block disabled={disabled} onPress={onApprove}>
        {t('devd.approve')}
      </Button>
      <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
        <Button leadingIcon="pencil" disabled={disabled} onPress={onRework} style={{ flex: 1 }}>
          {t('devd.rework')}
        </Button>
        <Button
          variant="danger"
          leadingIcon="x"
          disabled={disabled}
          onPress={onReject}
          style={{ flex: 1 }}
        >
          {t('devd.reject')}
        </Button>
      </View>
    </View>
  )
}

/** The gate step: the formulation and the three decisions, unless the screen pins them. */
export function GatePanel({
  formulation,
  canDecide = true,
  disabled = false,
  sent = false,
  pinned = false,
  onApprove,
  onRework,
  onReject,
}: {
  formulation: string
  canDecide?: boolean
  disabled?: boolean
  sent?: boolean
  /** The decisions sit in the screen's footer, not under the formulation. */
  pinned?: boolean
  onApprove?: () => void
  onRework?: () => void
  onReject?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (sent) return <SentNote text={t('devd.sentGate')} />
  return (
    <Card style={{ gap: theme.space(3) }}>
      <Text variant="heading">{t('devd.gateTitle')}</Text>
      <Prose markdown={formulation} />
      {!canDecide ? (
        <Callout tone="neutral">{t('devd.noRightGate')}</Callout>
      ) : (
        !pinned && (
          <GateActions
            disabled={disabled}
            onApprove={onApprove}
            onRework={onRework}
            onReject={onReject}
          />
        )
      )}
    </Card>
  )
}

/** The baseline gate (#94): tests broken before this task — ignore them for the task, ignore
 *  them for good, or leave the task waiting until they are fixed. */
export function BaselinePanel({
  invite,
  canDecide = true,
  disabled = false,
  sent = false,
  onIgnoreTask,
  onPermanent,
  onLater,
}: {
  /** Markdown: what was found, from the pipeline. */
  invite: string
  canDecide?: boolean
  disabled?: boolean
  sent?: boolean
  onIgnoreTask?: () => void
  onPermanent?: () => void
  onLater?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (sent) return <SentNote text={t('devd.sentGate')} />
  return (
    <Card style={{ gap: theme.space(3) }}>
      <Text variant="heading">{t('devd.baselineTitle')}</Text>
      <Prose markdown={invite || t('devd.baselineDefault')} />
      {canDecide ? (
        <View style={{ gap: theme.space(2) }}>
          <Button
            variant="primary"
            leadingIcon="check"
            block
            disabled={disabled}
            onPress={onIgnoreTask}
          >
            {t('devd.baselineIgnoreTask')}
          </Button>
          <Button leadingIcon="shieldCheck" block disabled={disabled} onPress={onPermanent}>
            {t('devd.baselinePermanent')}
          </Button>
          <Button variant="ghost" leadingIcon="pause" block disabled={disabled} onPress={onLater}>
            {t('devd.baselineLater')}
          </Button>
        </View>
      ) : (
        <Callout tone="neutral">{t('devd.noRightBaseline')}</Callout>
      )}
    </Card>
  )
}

function SentNote({ text }: { text: string }) {
  return (
    <Card tone="muted" style={{ gap: 10 }}>
      <Text variant="label" tone="muted">
        {text}
      </Text>
      <Skeleton width="80%" />
      <Skeleton width="60%" />
    </Card>
  )
}

/** «Rework»: what to redo, in words. */
export function ReworkSheet({
  note = '',
  onNote,
  onSend,
  onClose,
}: {
  note?: string
  onNote?: (text: string) => void
  onSend?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet
      title={t('devd.rework')}
      onClose={onClose}
      footer={
        <Button variant="primary" block disabled={note.trim() === ''} onPress={onSend}>
          {t('devd.sendRework')}
        </Button>
      }
    >
      <Input
        value={note}
        placeholder={t('devd.reworkPlaceholder')}
        rows={4}
        onChangeText={onNote}
        autoFocus
      />
    </Sheet>
  )
}

/** «Reject»: irreversible, so a confirmation with an optional reason. */
export function RejectSheet({
  reason = '',
  onReason,
  onConfirm,
  onClose,
}: {
  reason?: string
  onReason?: (text: string) => void
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('devd.rejectTitle')} onClose={onClose}>
      <Text tone="fg2">{t('devd.rejectText')}</Text>
      <Field label={t('devd.rejectReason')}>
        <Input value={reason} rows={2} onChangeText={onReason} />
      </Field>
      <View style={{ gap: 8 }}>
        <Button variant="destructive" block onPress={onConfirm}>
          {t('devd.rejectConfirm')}
        </Button>
        <Button variant="secondary" block onPress={onClose}>
          {t('common.no')}
        </Button>
      </View>
    </Sheet>
  )
}
