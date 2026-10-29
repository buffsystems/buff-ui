/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button, IconButton } from '../../../Button.tsx'
import { Chip, ChipRow } from '../../../Chip.tsx'
import { EmptyState } from '../../../Feedback.tsx'
import { Segmented } from '../../../Field.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Text } from '../../../Text.tsx'
import { useLocale, useT, useTheme } from '../../../theme.tsx'
import { rubles } from '../../../i18n.ts'
import { InstallBanner } from '../../status.tsx'
import type { ProjectRef, ShellProps } from '../model.ts'
import { inProject, ListSkeleton, LoadError } from '../parts.tsx'
import { CabinetShell } from '../shell.tsx'
import type { TaskRow } from './model.ts'
import { StagePipe, taskStatus, taskSubtitle } from './stage.tsx'

export type StageFilter = 'all' | 'review' | 'development' | 'stopped' | 'merged' | 'draft'
export type StateFilter = 'all' | 'open' | 'closed'
const STAGE_FILTERS: StageFilter[] = ['all', 'review', 'development', 'stopped', 'merged', 'draft']
const FILTER_KEY: Record<StageFilter, string> = {
  all: 'dev.filterAll',
  review: 'dev.filterReview',
  development: 'dev.filterDevelopment',
  stopped: 'dev.filterStopped',
  merged: 'dev.filterMerged',
  draft: 'dev.filterDraft',
}

/** Which chip a task falls under; drafts, stopped and rejected stay out of the stage chips. */
export function matchesFilter(task: TaskRow, filter: StageFilter): boolean {
  if (filter === 'all') return true
  if (task.stage.rejected) return false
  if (filter === 'draft') return !!task.draft
  if (filter === 'stopped') return task.stage.stopped
  if (task.draft || task.stage.stopped) return false
  if (filter === 'review') return task.stage.id === 'review'
  if (filter === 'merged') return task.stage.id === 'merged'
  return ['formulation', 'decomposition', 'development'].includes(task.stage.id)
}

/** One task of the list (#692): a dense row, not a card — number and title, then the pipe,
the status and what is known (subtasks, why, cost, time); an unknown value leaves no dash. */
export function TaskCard({ task, onPress }: { task: TaskRow; onPress?: () => void }) {
  const t = useT()
  const theme = useTheme()
  const locale = useLocale()
  const status = taskStatus(t, task)
  const subtitle = taskSubtitle(t, task)
  const pastReview = task.stage.index >= 4
  const progress =
    task.subtasksTotal === 0
      ? ''
      : pastReview
        ? t('dev.subtasksOf', { n: task.subtasksTotal })
        : t('dev.progress', { done: task.subtasksDone, total: task.subtasksTotal })
  const cost = task.costRub ? t('dev.rub', { n: rubles(task.costRub, locale) }) : ''
  const meta = [subtitle, progress, cost, task.updated].filter(Boolean).join(' · ')
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`#${task.number} ${task.title}`}
      onPress={onPress}
      style={({ pressed }) => ({
        gap: 6,
        paddingHorizontal: theme.space(4),
        paddingVertical: theme.space(3),
        backgroundColor: pressed ? theme.colors.muted : 'transparent',
      })}
    >
      <Text variant="label" style={{ fontSize: 15, lineHeight: 20 }} numberOfLines={2}>
        <Text variant="mono" tone="muted">{`#${task.number} `}</Text>
        {task.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <StagePipe stage={task.stage} />
        <Badge tone={status.tone}>{status.label}</Badge>
        <Text variant="caption" tone="muted" style={{ flex: 1 }} numberOfLines={1}>
          {meta}
        </Text>
      </View>
    </Pressable>
  )
}

/** Development: the project's tasks with the stage chips and the open/closed switch. */
export function DevListScreen({
  shell,
  status,
  tasks,
  filter = 'all',
  state = 'open',
  loading = false,
  error = false,
  toolsReady = true,
  canCreate = true,
  canPrepareTools = canCreate,
  moreCount = 0,
  onFilter,
  onState,
  onOpenTask,
  onCreate,
  onPrepareTools,
  onShowMore,
  onRetry,
  project,
  refreshing,
  onRefresh,
  onOpenTests,
}: {
  shell: ShellProps
  status: InstallStatus
  tasks: TaskRow[]
  filter?: StageFilter
  state?: StateFilter
  loading?: boolean
  error?: boolean
  toolsReady?: boolean
  /** May create a task here; a reader sees neither the button nor the invitation. */
  canCreate?: boolean
  /** May start the development-tools preparation (the cabinet's «project.audit»). */
  canPrepareTools?: boolean
  moreCount?: number
  onFilter?: (f: StageFilter) => void
  onState?: (s: StateFilter) => void
  onOpenTask?: (number: number) => void
  onCreate?: () => void
  /** Opens the development-tools preparation (the devprep task). */
  onPrepareTools?: () => void
  onShowMore?: () => void
  onRetry?: () => void
  /** The project the list belongs to: its name heads the screen; it is picked in the drawer. */
  project?: ProjectRef
  refreshing?: boolean
  onRefresh?: () => void
  /** The project's own test list. */
  onOpenTests?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const byState = tasks.filter((x) => state === 'all' || x.state === state)
  const shown = byState.filter((x) => matchesFilter(x, filter))
  return (
    <CabinetShell
      shell={shell}
      section="dev"
      subtitle={inProject(project, t('dev.total', { n: tasks.length }))}
      refreshing={refreshing}
      onRefresh={onRefresh}
      actions={
        <View style={{ flexDirection: 'row' }}>
          {onOpenTests && (
            <IconButton
              icon="listChecks"
              label={t('devt.openProjectTests')}
              onPress={onOpenTests}
            />
          )}
          {canCreate && (
            <IconButton
              icon="plus"
              label={t('dev.newTask')}
              onPress={onCreate}
              disabled={!live || !toolsReady}
            />
          )}
        </View>
      }
    >
      <InstallBanner status={status} />
      {!toolsReady ? (
        <EmptyState
          icon="wrench"
          title={t('dev.toolsNotReadyTitle')}
          text={t('dev.toolsNotReadyText')}
          action={
            live && canPrepareTools
              ? { label: t('dev.prepareTools'), icon: 'play', onPress: onPrepareTools }
              : undefined
          }
        />
      ) : (
        <>
          <View style={{ paddingHorizontal: theme.space(4) }}>
            <Segmented
              value={state}
              onChange={(id) => onState?.(id as StateFilter)}
              options={(['all', 'open', 'closed'] as StateFilter[]).map((id) => ({
                id,
                label: t(`dev.state${id[0].toUpperCase()}${id.slice(1)}`),
              }))}
            />
          </View>
          <ChipRow>
            {STAGE_FILTERS.map((f) => (
              <Chip
                key={f}
                selected={f === filter}
                count={byState.filter((x) => matchesFilter(x, f)).length}
                onPress={() => onFilter?.(f)}
              >
                {t(FILTER_KEY[f])}
              </Chip>
            ))}
          </ChipRow>
          {loading ? (
            <ListSkeleton />
          ) : error ? (
            <LoadError text={t('dev.loadError')} onRetry={onRetry} />
          ) : tasks.length === 0 ? (
            <EmptyState
              icon="workflow"
              title={t('dev.emptyTitle')}
              text={t(canCreate ? 'dev.emptyText' : 'dev.emptyTextRead')}
              action={
                canCreate && live
                  ? { label: t('dev.newTask'), icon: 'plus', onPress: onCreate }
                  : undefined
              }
            />
          ) : shown.length === 0 ? (
            <Text tone="muted" align="center" style={{ padding: theme.space(6) }}>
              {t('dev.emptyFilter')}
            </Text>
          ) : (
            <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
              <View
                style={{
                  borderRadius: theme.radius.lg,
                  backgroundColor: theme.colors.card,
                  overflow: 'hidden',
                  ...theme.raised,
                }}
              >
                {shown.map((task, i) => (
                  <View
                    key={task.number}
                    style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: theme.colors.border }}
                  >
                    <TaskCard task={task} onPress={() => onOpenTask?.(task.number)} />
                  </View>
                ))}
              </View>
              {moreCount > 0 && (
                <Button variant="ghost" onPress={onShowMore} style={{ alignSelf: 'center' }}>
                  {t('dev.showMore', { n: moreCount })}
                </Button>
              )}
            </View>
          )}
        </>
      )}
    </CabinetShell>
  )
}
