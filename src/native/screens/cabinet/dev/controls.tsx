/** @jsxRuntime automatic */
/*
  What a person does to a run (#629): the actions sheet behind «⋯», the confirmation for
  each action, the balance pause notice, and the export sheet.
*/
import { Callout } from '../../../Feedback.tsx'
import { Button } from '../../../Button.tsx'
import type { IconName } from '../../../icons.ts'
import type { Translate } from '../../../i18n.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { ConfirmSheet, Sheet } from '../../../Sheet.tsx'
import { useT } from '../../../theme.tsx'
import type { Pause, RunAction } from './model.ts'

const ACTION: Record<RunAction, { icon: IconName; key: string; destructive?: boolean }> = {
  continue: { icon: 'play', key: 'devt.continue' },
  pause: { icon: 'pause', key: 'devt.pause' },
  stop: { icon: 'square', key: 'devt.stop', destructive: true },
  resume: { icon: 'refreshCw', key: 'devt.resume' },
  close: { icon: 'archive', key: 'devt.close' },
}

/** Which actions a task offers: running, paused, stopped, closeable. */
export function runActions(state: {
  running: boolean
  paused: boolean
  stopped: boolean
  closeable: boolean
}): RunAction[] {
  const out: RunAction[] = []
  if (state.paused) out.push('continue')
  if (state.running && !state.paused) out.push('pause')
  if (state.running || state.paused) out.push('stop')
  if (state.stopped) out.push('resume')
  if (state.closeable) out.push('close')
  return out
}

/** The «Actions» sheet: one row per available action. */
export function RunControlsSheet({
  actions,
  disabled = false,
  onAction,
  onClose,
}: {
  actions: RunAction[]
  disabled?: boolean
  onAction?: (action: RunAction) => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('devd.actions')} onClose={onClose}>
      <RowGroup>
        {actions.map((a) => (
          <Row
            key={a}
            icon={ACTION[a].icon}
            title={t(ACTION[a].key)}
            destructive={ACTION[a].destructive}
            disabled={disabled}
            onPress={() => onAction?.(a)}
          />
        ))}
      </RowGroup>
    </Sheet>
  )
}

/** The confirmation of one run action, with the web's exact wording. */
export function RunConfirmSheet({
  action,
  onConfirm,
  onClose,
}: {
  action: RunAction
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t(`devt.${action}Title`)}
      text={t(`devt.${action}Text`)}
      confirmLabel={t(ACTION[action].key)}
      destructive={action === 'stop'}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}

/** «paused by … · when» / «paused by the system: …». */
export function pauseLine(t: Translate, pause: Pause): string {
  if (pause.reason === 'balance') return t('dev.pausedBalance', { when: pause.when })
  if (pause.reason === 'runway') return t('dev.pausedRunway', { when: pause.when })
  return t('dev.pausedBy', { by: pause.by, when: pause.when })
}

/** The warn banner while balance / runway pauses hold. */
export function PauseNotice({ count, onTopUp }: { count: number; onTopUp?: () => void }) {
  const t = useT()
  return (
    <Callout
      tone="warn"
      icon="pause"
      action={
        <Button size="sm" onPress={onTopUp}>
          {t('dev.topUp')}
        </Button>
      }
    >
      {t('dev.pauseNotice', { n: count })}
    </Callout>
  )
}

/** Export: a format, then saved to the phone or shared. */
export function ExportSheet({
  title,
  onPdf,
  onMarkdown,
  onClose,
}: {
  title: string
  onPdf?: () => void
  onMarkdown?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={title} onClose={onClose}>
      <RowGroup>
        {/* A format the host cannot produce is not offered. */}
        {onPdf && (
          <Row
            icon="fileText"
            title={t('devt.exportPdf')}
            subtitle={t('cabinet.saveToPhone')}
            onPress={onPdf}
            chevron
          />
        )}
        {onMarkdown && (
          <Row
            icon="download"
            title={t('devt.exportMd')}
            subtitle={t('cabinet.saveToPhone')}
            onPress={onMarkdown}
            chevron
          />
        )}
      </RowGroup>
    </Sheet>
  )
}
