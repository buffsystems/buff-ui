/** @jsxRuntime automatic */
/*
  The audits landing (#629): the first-run invitation, or the summary of every section.
*/
import { View } from 'react-native'
import { IconButton } from '../../../Button.tsx'
import { Callout, EmptyState } from '../../../Feedback.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import type { ProjectRef, ShellProps } from '../model.ts'
import { inProject, ListSkeleton, LoadError } from '../parts.tsx'
import { CabinetShell } from '../shell.tsx'
import { isLocked, type AuditRun, type AuditSection } from './model.ts'
import { AuditsSummary } from './summary.tsx'

export function AuditsLandingScreen({
  shell,
  status,
  sections,
  runs = [],
  loading = false,
  error = false,
  canRun = true,
  onOpen,
  onRun,
  onRerun,
  onRefreshStale,
  onExport,
  onPause,
  onResume,
  onCancel,
  onRetry,
  project,
  refreshing,
  onRefresh,
}: {
  shell: ShellProps
  status: InstallStatus
  sections: AuditSection[]
  runs?: AuditRun[]
  loading?: boolean
  error?: boolean
  canRun?: boolean
  onOpen?: (id: string) => void
  onRun?: () => void
  onRerun?: () => void
  onRefreshStale?: () => void
  onExport?: () => void
  onPause?: (runId: string) => void
  onResume?: (runId: string) => void
  onCancel?: (runId: string) => void
  onRetry?: () => void
  project?: ProjectRef
  refreshing?: boolean
  onRefresh?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const act = status.kind === 'online' && canRun
  const ready = sections.filter((s) => s.status === 'ready').length
  const firstRun =
    sections.length > 0 && sections.every((s) => s.status === 'missing') && runs.length === 0
  return (
    <CabinetShell
      shell={shell}
      section="audits"
      subtitle={inProject(project, t('audit.title'))}
      refreshing={refreshing}
      onRefresh={onRefresh}
      actions={
        !firstRun && !loading ? (
          <>
            {ready > 0 && (
              <IconButton icon="download" label={t('audit.exportAll')} onPress={onExport} />
            )}
            <IconButton
              icon="refreshCw"
              label={t('audit.rerun')}
              onPress={onRerun}
              disabled={!act || sections.every(isLocked)}
            />
          </>
        ) : undefined
      }
    >
      <InstallBanner status={status} />
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError text={t('audit.loadError')} onRetry={onRetry} />
      ) : firstRun ? (
        <View style={{ gap: theme.space(3) }}>
          <EmptyState
            icon="shieldCheck"
            title={t('audit.title')}
            text={t('audit.firstSubtitle')}
            action={act ? { label: t('audit.run'), icon: 'play', onPress: onRun } : undefined}
          />
          <View
            style={{
              paddingHorizontal: theme.space(4),
              paddingTop: theme.space(2),
              gap: theme.space(3),
            }}
          >
            <Text tone="fg2">{t('audit.firstIntro')}</Text>
            <Callout tone="info">{t('audit.afterRun', { n: sections.length })}</Callout>
          </View>
        </View>
      ) : (
        <AuditsSummary
          sections={sections}
          runs={runs}
          a={{ disabled: !act, onOpen, onRefreshStale, onExport, onPause, onResume, onCancel }}
        />
      )}
    </CabinetShell>
  )
}
