/** @jsxRuntime automatic */
import { View } from 'react-native'
import { StatusDot } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { Row, RowGroup } from '../../Row.tsx'
import { ConfirmSheet, Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { Automation, AutomationRun } from './model.ts'

const RUN_TONE = { done: 'ok', failed: 'crit', running: 'info', waiting: 'warn' } as const

/** The runs of one automation: when, how it started, how it ended; open its session. */

export function AutomationHistorySheet({
  automation,
  runs,
  disabled = false,
  onOpenSession,
  onDeleteRecord,
  onClose,
}: {
  automation: Automation
  runs: AutomationRun[]
  disabled?: boolean
  onOpenSession?: (id: string) => void
  onDeleteRecord?: (id: string) => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Sheet title={t('buffcode.historyOf', { title: automation.title })} onClose={onClose}>
      {runs.length === 0 ? (
        <Text tone="muted" align="center" style={{ paddingVertical: theme.space(4) }}>
          {t('buffcode.noRuns')}
        </Text>
      ) : (
        <RowGroup>
          {runs.map((run) => (
            <Row
              key={run.id}
              leading={<StatusDot tone={RUN_TONE[run.status]} pulse={run.status === 'running'} />}
              title={`${run.when} · ${t(run.source === 'manual' ? 'buffcode.manually' : 'buffcode.onSchedule')}`}
              subtitle={run.summary}
              trailing={
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  <IconButton
                    icon="externalLink"
                    label={t('buffcode.openSession')}
                    size="sm"
                    onPress={() => onOpenSession?.(run.id)}
                  />
                  <IconButton
                    icon="trash"
                    label={t('buffcode.deleteRecord')}
                    size="sm"
                    disabled={disabled}
                    onPress={() => onDeleteRecord?.(run.id)}
                  />
                </View>
              }
              lines={2}
            />
          ))}
        </RowGroup>
      )}
    </Sheet>
  )
}

export function DeleteAutomationSheet({
  automation,
  onConfirm,
  onClose,
}: {
  automation: Automation
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('buffcode.deleteAutomation')}
      text={t('buffcode.deleteAutomationText', { title: automation.title })}
      confirmLabel={t('common.delete')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
