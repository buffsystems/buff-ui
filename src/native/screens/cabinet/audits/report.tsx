/** @jsxRuntime automatic */
/*
  One audit section (#629): its status, the findings counts, the staleness note, the report
  itself — or why there is none yet.
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button, IconButton } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout, EmptyState, Spinner } from '../../../Feedback.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Prose } from '../../../Prose.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import type { AuditReport, AuditStatus } from './model.ts'

const HEADER_TONE: Record<AuditStatus, Tone> = {
  ready: 'ok',
  in_progress: 'info',
  scheduled: 'warn',
  missing: 'neutral',
}

/** The counts card: open · in progress · closed, and the lead time while it runs. */
export function FindingCountsCard({
  report,
  onChanges,
}: {
  report: AuditReport
  onChanges?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const f = report.findings
  const wip = report.section.status === 'in_progress'
  return (
    <Card tone="muted" style={{ gap: theme.space(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {wip && <Spinner />}
        <Text variant="label" style={{ flex: 1 }}>
          {wip ? t('audit.draftInWork') : t('audit.findings')}
        </Text>
        {report.tokens && (
          <Text variant="caption" tone="muted">
            {report.tokens}
          </Text>
        )}
      </View>
      {f && (
        <View style={{ flexDirection: 'row', gap: theme.space(4) }}>
          {(
            [
              ['fOpen', f.open, 'warn'],
              ['fInProgress', f.inProgress, 'info'],
              ['fClosed', f.closed, 'ok'],
            ] as const
          ).map(([key, n, tone]) => (
            <View key={key} style={{ gap: 2 }}>
              <Text
                variant="title"
                tone={tone === 'warn' ? 'warning' : tone === 'ok' ? 'success' : 'primary'}
              >
                {String(n)}
              </Text>
              <Text variant="caption" tone="muted">
                {t(`audit.${key}`)}
              </Text>
            </View>
          ))}
        </View>
      )}
      {report.changes && (
        <Button size="sm" variant="ghost" leadingIcon="gitCommit" onPress={onChanges}>
          {t('audit.changes', {
            files: report.changes.files,
            add: report.changes.add,
            del: report.changes.del,
          })}
        </Button>
      )}
      {report.leadTime && (
        <Text variant="caption" tone="muted">
          {t('audit.leadTime', { t: report.leadTime })}
        </Text>
      )}
    </Card>
  )
}

export function AuditSectionScreen({
  status,
  report,
  loading = false,
  error = false,
  canRun = true,
  onBack,
  onExport,
  onRun,
  onRetry,
  onChanges,
  refreshing,
  onRefresh,
}: {
  status: InstallStatus
  report?: AuditReport
  loading?: boolean
  error?: boolean
  canRun?: boolean
  onBack?: () => void
  onExport?: () => void
  onRun?: () => void
  onRetry?: () => void
  /** The files the section's run changed. */
  onChanges?: () => void
  refreshing?: boolean
  onRefresh?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const s = report?.section
  const st = s?.status
  const badge =
    st === 'missing' && report?.content
      ? { label: t('audit.sDraft'), tone: 'warn' as Tone }
      : st
        ? {
            label:
              st === 'ready'
                ? t('audit.sReady')
                : st === 'in_progress'
                  ? t('audit.sInProgress')
                  : st === 'scheduled'
                    ? t('audit.sScheduled')
                    : t('audit.sNoReport'),
            tone: HEADER_TONE[st],
          }
        : undefined
  const exportable = st === 'ready' && !report?.wip && !!report?.content
  const moved = s?.behind?.filter((b) => b.commits > 0) ?? []
  const emptyKey =
    st === 'ready'
      ? 'audit.emptyReady'
      : st === 'in_progress'
        ? 'audit.emptyInProgress'
        : st === 'scheduled'
          ? 'audit.emptyScheduled'
          : 'audit.emptyMissing'
  return (
    <>
      <TopBar
        title={s?.title ?? t('audit.title')}
        subtitle={t('audit.title')}
        onBack={onBack}
        actions={
          exportable ? (
            <IconButton icon="download" label={t('audit.exportSection')} onPress={onExport} />
          ) : undefined
        }
      />
      <Screen refreshing={refreshing} onRefresh={onRefresh}>
        <InstallBanner status={status} />
        {loading ? (
          <ListSkeleton rows={5} />
        ) : error || !report || !s ? (
          <LoadError text={t('audit.progressError')} onRetry={onRetry} />
        ) : (
          <View
            style={{
              paddingHorizontal: theme.space(4),
              paddingTop: theme.space(2),
              gap: theme.space(3),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
              {s.date && (
                <Text variant="caption" tone="muted">
                  {s.date}
                </Text>
              )}
            </View>
            {s.about ? (
              <Text variant="caption" tone="muted">
                {s.about}
              </Text>
            ) : null}
            {(st === 'in_progress' || report.findings || report.tokens || report.changes) && (
              <FindingCountsCard report={report} onChanges={onChanges} />
            )}
            {st === 'scheduled' && (
              <Callout tone="warn" title={t('audit.scheduledTitle')}>
                {t('audit.scheduledText')}
              </Callout>
            )}
            {st === 'ready' &&
              s.behind &&
              (moved.length === 0 ? (
                <Callout tone="ok">{t('audit.fresh')}</Callout>
              ) : (
                <Callout tone="warn" title={t('audit.staleReport')}>
                  {t('audit.staleSince', {
                    mods: moved.map((b) => `${b.module} +${b.commits}`).join(', '),
                  })}
                </Callout>
              ))}
            {report.content ? (
              <Prose markdown={report.content} />
            ) : st === 'missing' ? (
              <EmptyState
                icon="shieldCheck"
                title={t(emptyKey)}
                action={
                  live && canRun
                    ? { label: t('audit.runOne'), icon: 'play', onPress: onRun }
                    : undefined
                }
              />
            ) : (
              <Text tone="muted">{t(emptyKey)}</Text>
            )}
          </View>
        )}
      </Screen>
    </>
  )
}
