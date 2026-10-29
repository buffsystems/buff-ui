/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Badge, StatusDot } from '../../Badge.tsx'
import { Button, IconButton } from '../../Button.tsx'
import { Card } from '../../Card.tsx'
import { EmptyState } from '../../Feedback.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { Automation } from './model.ts'
import { Gutter, isLive, MachineShell, skeletonRows } from './shell.tsx'

/** One automation: its schedule, the next run, counts; run now / stop; pause, edit, history, delete. */
export function AutomationCard({
  automation,
  disabled = false,
  onRunNow,
  onStop,
  onOpenSession,
  onPause,
  onEdit,
  onHistory,
  onDelete,
}: {
  automation: Automation
  disabled?: boolean
  onRunNow?: () => void
  onStop?: () => void
  onOpenSession?: () => void
  onPause?: () => void
  onEdit?: () => void
  onHistory?: () => void
  onDelete?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const a = automation
  return (
    <Card style={{ gap: theme.space(3), opacity: a.paused ? 0.75 : 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        {a.state !== 'idle' && <StatusDot tone={a.state === 'waiting' ? 'warn' : 'info'} pulse />}
        <Text variant="heading" numberOfLines={2} style={{ flex: 1 }}>
          {a.title}
        </Text>
        {a.paused && (
          <Badge tone="neutral" icon="pause">
            {t('buffcode.pause')}
          </Badge>
        )}
      </View>
      <View style={{ gap: 2 }}>
        <Text variant="label" tone="fg2">
          {a.schedule}
        </Text>
        <Text variant="caption" tone="muted">
          {a.paused ? t('buffcode.paused') : a.next ? t('buffcode.nextRun', { when: a.next }) : ''}
        </Text>
        <Text variant="caption" tone="muted">
          {t('buffcode.runsCount', { n: a.runs })}
          {a.last ? ` · ${t('buffcode.lastRun', { run: a.last })}` : ''}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
        {a.state === 'idle' ? (
          <Button
            size="sm"
            variant="primary"
            leadingIcon="play"
            disabled={disabled}
            onPress={onRunNow}
          >
            {t('buffcode.runNow')}
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="danger"
              leadingIcon="square"
              disabled={disabled}
              onPress={onStop}
            >
              {t('buffcode.stop')}
            </Button>
            <Button size="sm" disabled={disabled} onPress={onOpenSession}>
              {t(a.state === 'waiting' ? 'buffcode.answerInSession' : 'buffcode.openSession')}
            </Button>
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: theme.space(2) }}>
        <IconButton
          icon={a.paused ? 'play' : 'pause'}
          label={t(a.paused ? 'buffcode.resume' : 'buffcode.pause')}
          size="sm"
          variant="outline"
          disabled={disabled}
          onPress={onPause}
        />
        <IconButton
          icon="pencil"
          label={t('buffcode.edit')}
          size="sm"
          variant="outline"
          disabled={disabled}
          onPress={onEdit}
        />
        <IconButton
          icon="history"
          label={t('buffcode.history')}
          size="sm"
          variant="outline"
          onPress={onHistory}
        />
        <IconButton
          icon="trash"
          label={t('common.delete')}
          size="sm"
          variant="outline"
          disabled={disabled}
          onPress={onDelete}
        />
      </View>
    </Card>
  )
}

/** The automations of a machine, in the window's scope: scheduled tasks the agent runs alone. */
export function AutomationsScreen({
  install,
  status,
  automations,
  loading = false,
  onNew,
  onMenu,
  onRepair,
  onRunNow,
  onStop,
  onOpenSession,
  onPause,
  onEdit,
  onHistory,
  onDelete,
}: {
  install: Install
  status: InstallStatus
  automations: Automation[]
  loading?: boolean
  onNew?: () => void
  onMenu?: () => void
  onRepair?: () => void
  onRunNow?: (id: string) => void
  onStop?: (id: string) => void
  onOpenSession?: (id: string) => void
  onPause?: (id: string) => void
  onEdit?: (id: string) => void
  onHistory?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  const empty = !loading && automations.length === 0
  return (
    <MachineShell
      install={install}
      status={status}
      title={t('buffcode.automations')}
      onMenu={onMenu}
      onRepair={onRepair}
      scroll={!empty}
      actions={
        <IconButton
          icon="plus"
          label={t('buffcode.newAutomation')}
          onPress={onNew}
          disabled={!live}
        />
      }
    >
      {empty ? (
        <EmptyState
          icon="calendar"
          title={t('buffcode.noAutomations')}
          text={t('buffcode.noAutomationsText')}
          action={
            live ? { label: t('buffcode.newAutomation'), icon: 'plus', onPress: onNew } : undefined
          }
        />
      ) : loading ? (
        <View style={{ paddingTop: theme.space(4) }}>{skeletonRows(theme, 3)}</View>
      ) : (
        <View style={{ paddingTop: theme.space(4) }}>
          <Gutter>
            {automations.map((a) => (
              <AutomationCard
                key={a.id}
                automation={a}
                disabled={!live}
                onRunNow={() => onRunNow?.(a.id)}
                onStop={() => onStop?.(a.id)}
                onOpenSession={() => onOpenSession?.(a.id)}
                onPause={() => onPause?.(a.id)}
                onEdit={() => onEdit?.(a.id)}
                onHistory={() => onHistory?.(a.id)}
                onDelete={() => onDelete?.(a.id)}
              />
            ))}
          </Gutter>
        </View>
      )}
    </MachineShell>
  )
}
