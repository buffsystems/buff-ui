/** @jsxRuntime automatic */
/*
  The review queue (#629): the tasks whose development is done and a pull request is open —
  and the screen for a task that is not (yet, or any more) on the review gate.
*/
import { Pressable, View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { EmptyState } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import type { InstallStatus, LoadFailure } from '../../../model.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import type { GatePhase } from '../dev/model.ts'
import type { ProjectRef, SectionId, ShellProps } from '../model.ts'
import { inProject, ListSkeleton, LoadError } from '../parts.tsx'
import { CabinetShell } from '../shell.tsx'
import type { ReviewQueueRow } from './model.ts'

/** One task of the queue: number, title, open findings, waiting since, two actions. */
export function QueueCard({
  row,
  disabled = false,
  onOpen,
  onDiscuss,
  onTask,
}: {
  row: ReviewQueueRow
  disabled?: boolean
  onOpen?: () => void
  onDiscuss?: () => void
  onTask?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const hint = [
    row.openFindings > 0
      ? t('review.findingsOpenN', { n: row.openFindings })
      : t('review.findingsNone'),
    row.since && t('review.waitingSince', { when: row.since }),
  ]
    .filter(Boolean)
    .join(' · ')
  // One card, one tap (#692): the card opens the review; discussing and the task are quiet
  // buttons under it, beside the press, not three calls to action stacked in it.
  return (
    <Card padded={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('review.open')}: #${row.number} ${row.title}`}
        disabled={disabled}
        onPress={onOpen}
        style={({ pressed }) => ({
          gap: theme.space(1),
          padding: theme.space(4),
          paddingBottom: theme.space(2),
          backgroundColor: pressed ? theme.colors.muted : 'transparent',
        })}
      >
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
          <Text variant="label" style={{ flex: 1, fontSize: 15, lineHeight: 20 }} numberOfLines={2}>
            <Text variant="mono" tone="muted">{`#${row.number} `}</Text>
            {row.title}
          </Text>
          {row.openFindings > 0 && <Badge tone="warn">{row.openFindings}</Badge>}
          <Icon name="chevronRight" size={18} color={theme.colors.mutedForeground} />
        </View>
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      </Pressable>
      <View style={{ flexDirection: 'row', paddingHorizontal: theme.space(2), paddingBottom: 4 }}>
        <Button
          size="sm"
          variant="ghost"
          leadingIcon="messageSquare"
          disabled={disabled}
          onPress={onDiscuss}
        >
          {t('review.discuss')}
        </Button>
        <Button size="sm" variant="ghost" leadingIcon="workflow" onPress={onTask}>
          {t('review.toTask')}
        </Button>
      </View>
    </Card>
  )
}

export function ReviewQueueScreen({
  shell,
  status,
  rows,
  loading = false,
  error = false,
  onOpen,
  onDiscuss,
  onTask,
  onGo,
  onRetry,
  refreshing,
  onRefresh,
  project,
}: {
  shell: ShellProps
  status: InstallStatus
  rows: ReviewQueueRow[]
  loading?: boolean
  error?: LoadFailure
  onOpen?: (n: number) => void
  onDiscuss?: (n: number) => void
  onTask?: (n: number) => void
  /** The empty state's «go elsewhere» rows. */
  onGo?: (section: SectionId) => void
  onRetry?: () => void
  refreshing?: boolean
  onRefresh?: () => void
  project?: ProjectRef
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  return (
    <CabinetShell
      shell={shell}
      section="review"
      subtitle={inProject(project, t('review.queueTitle'))}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <InstallBanner status={status} />
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError error={error} text={t('review.queueError')} onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <View style={{ gap: theme.space(3) }}>
          <EmptyState
            icon="gitPullRequest"
            title={t('review.queueEmpty')}
            text={t('review.queueEmptyText')}
          />
          <View style={{ paddingHorizontal: theme.space(4) }}>
            <RowGroup>
              <Row
                icon="circleHelp"
                title={t('cabinet.ask')}
                chevron
                onPress={() => onGo?.('ask')}
              />
              <Row
                icon="microscope"
                title={t('cabinet.researchFull')}
                chevron
                onPress={() => onGo?.('research')}
              />
              <Row icon="workflow" title={t('cabinet.dev')} chevron onPress={() => onGo?.('dev')} />
            </RowGroup>
          </View>
        </View>
      ) : (
        <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
          <Text variant="caption" tone="muted">
            {t('review.queueLine', { n: rows.length })}
          </Text>
          {rows.map((row) => (
            <QueueCard
              key={row.number}
              row={row}
              disabled={!live}
              onOpen={() => onOpen?.(row.number)}
              onDiscuss={() => onDiscuss?.(row.number)}
              onTask={() => onTask?.(row.number)}
            />
          ))}
        </View>
      )}
    </CabinetShell>
  )
}

const PHASE_KEY: Partial<Record<GatePhase, string>> = {
  clarify: 'rvd.phaseClarify',
  gate: 'rvd.phaseGate',
  decomposing: 'rvd.phaseDecomposing',
  preparing: 'rvd.phasePreparing',
  implementing: 'rvd.phaseImplementing',
  running: 'rvd.phaseRunning',
}

/** A task opened for review that is not on the gate: where it is instead. */
export function ReviewNotOnGateScreen({
  status,
  task,
  phase,
  closed = false,
  onBack,
  onOpenTask,
}: {
  status: InstallStatus
  task: number
  phase: GatePhase
  closed?: boolean
  onBack?: () => void
  onOpenTask?: () => void
}) {
  const t = useT()
  const key = PHASE_KEY[phase]
  const text = closed
    ? t('review.closedText')
    : `${key ? `${t('review.nowPhase', { phase: t(key) })} ` : ''}${t('review.notYetText')}`
  return (
    <>
      <TopBar title={t('review.ofTask', { n: task })} onBack={onBack} />
      <Screen scroll={false}>
        <InstallBanner status={status} />
        <EmptyState
          icon={closed ? 'checkCircle' : 'clock'}
          title={
            closed ? t('review.closedTitle', { n: task }) : t('review.notYetTitle', { n: task })
          }
          text={text}
          action={{ label: t('review.openTask'), onPress: onOpenTask }}
        />
      </Screen>
    </>
  )
}
