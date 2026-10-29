/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Badge, StatusDot } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Card } from '../../Card.tsx'
import { Chip, ChipRow } from '../../Chip.tsx'
import { EmptyState } from '../../Feedback.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { Workflow, WorkflowRun } from './model.ts'
import { Gutter, isLive, MachineShell, skeletonRows } from './shell.tsx'

export const RUN_TONE = { running: 'info', done: 'ok', failed: 'crit', paused: 'warn' } as const
export const RUN_KEY = {
  running: 'buffcode.wfRunning',
  done: 'buffcode.wfDone',
  failed: 'buffcode.wfFailed',
  paused: 'buffcode.wfPaused',
} as const

/** One saved workflow: what it does, when to use it, run / details. */
export function WorkflowCard({
  workflow,
  disabled = false,
  onRun,
  onDetails,
}: {
  workflow: Workflow
  disabled?: boolean
  onRun?: () => void
  onDetails?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Card style={{ gap: theme.space(2) }}>
      <Text variant="heading">{workflow.name}</Text>
      <Text tone="fg2">{workflow.description}</Text>
      {workflow.whenToUse && (
        <Text variant="caption" tone="muted">
          {t('buffcode.whenToUse', { text: workflow.whenToUse })}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          paddingTop: theme.space(1),
        }}
      >
        <Button size="sm" variant="primary" leadingIcon="play" disabled={disabled} onPress={onRun}>
          {t('buffcode.runWorkflow')}
        </Button>
        <Button size="sm" variant="ghost" onPress={onDetails}>
          {t('buffcode.moreDetails')}
        </Button>
      </View>
      {workflow.lastRun && (
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {t('buffcode.lastRunLabel')}: {workflow.lastRun}
        </Text>
      )}
    </Card>
  )
}

/** The workflows of a machine: the saved ones and their runs. */
export function WorkflowsScreen({
  install,
  status,
  workflows,
  runs,
  tab = 'saved',
  loading = false,
  onTab,
  onRun,
  onDetails,
  onOpenRun,
  onMenu,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  workflows: Workflow[]
  runs: WorkflowRun[]
  tab?: 'saved' | 'runs'
  loading?: boolean
  onTab?: (tab: 'saved' | 'runs') => void
  onRun?: (id: string) => void
  onDetails?: (id: string) => void
  onOpenRun?: (id: string) => void
  onMenu?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  const running = runs.filter((r) => r.state === 'running').length
  const empty = !loading && (tab === 'saved' ? workflows.length === 0 : runs.length === 0)
  return (
    <MachineShell
      install={install}
      status={status}
      title={t('buffcode.workflows')}
      onMenu={onMenu}
      onRepair={onRepair}
      scroll={!empty}
    >
      <View
        style={{ paddingTop: theme.space(3), gap: theme.space(3), flex: empty ? 1 : undefined }}
      >
        <ChipRow>
          <Chip
            selected={tab === 'saved'}
            count={workflows.length}
            onPress={() => onTab?.('saved')}
          >
            {t('buffcode.saved')}
          </Chip>
          <Chip selected={tab === 'runs'} count={runs.length} onPress={() => onTab?.('runs')}>
            {running
              ? `${t('buffcode.runs')} (${t('buffcode.runningCount', { n: running })})`
              : t('buffcode.runs')}
          </Chip>
        </ChipRow>
        {loading ? (
          skeletonRows(theme, 3)
        ) : empty ? (
          <EmptyState
            icon="workflow"
            title={tab === 'saved' ? t('buffcode.noWorkflows') : t('buffcode.noRuns')}
            text={tab === 'saved' ? t('buffcode.noWorkflowsText') : undefined}
          />
        ) : tab === 'saved' ? (
          <Gutter>
            {workflows.map((w) => (
              <WorkflowCard
                key={w.id}
                workflow={w}
                disabled={!live}
                onRun={() => onRun?.(w.id)}
                onDetails={() => onDetails?.(w.id)}
              />
            ))}
          </Gutter>
        ) : (
          <Gutter>
            <RowGroup>
              {runs.map((run) => (
                <Row
                  key={run.id}
                  leading={<StatusDot tone={RUN_TONE[run.state]} pulse={run.state === 'running'} />}
                  title={run.label}
                  subtitle={`${run.workflow ? `«${run.workflow}»` : t('buffcode.fromChat')} · ${run.elapsed}${run.amended ? ` · ${t('buffcode.amended')}` : ''}`}
                  trailing={<Badge tone={RUN_TONE[run.state]}>{t(RUN_KEY[run.state])}</Badge>}
                  chevron
                  onPress={() => onOpenRun?.(run.id)}
                  lines={2}
                />
              ))}
            </RowGroup>
          </Gutter>
        )}
      </View>
    </MachineShell>
  )
}
