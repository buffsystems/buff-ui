/** @jsxRuntime automatic */
/*
  The audit summary (#629): the strip of four counts, the runs in flight, the stale sections,
  every section with its status, and the digest export card.
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout } from '../../../Feedback.tsx'
import type { Translate } from '../../../i18n.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { isStale, type AuditRun, type AuditSection, type AuditStatus } from './model.ts'
import { PausedRunCard } from './run.tsx'

const STATUS_TONE: Record<AuditStatus, Tone> = {
  ready: 'ok',
  in_progress: 'info',
  scheduled: 'warn',
  missing: 'neutral',
}
const STATUS_KEY: Record<AuditStatus, string> = {
  ready: 'audit.sReady',
  in_progress: 'audit.sInProgress',
  scheduled: 'audit.sScheduled',
  missing: 'audit.sMissing',
}

/** The status word of a section in the list; stale wins over ready. */
export function sectionStatus(t: Translate, s: AuditSection): { label: string; tone: Tone } {
  if (isStale(s)) return { label: t('audit.sStale'), tone: 'warn' }
  return { label: t(STATUS_KEY[s.status]), tone: STATUS_TONE[s.status] }
}

/** One number of the strip: the count, coloured by what it means, and its word under it. */
function Stat({ label, value, tone }: { label: string; value: number; tone?: Tone }) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={{ flex: 1, alignItems: 'center', gap: 2 }}
    >
      <Text
        variant="title"
        tone={
          tone === 'crit'
            ? 'destructive'
            : tone === 'ok'
              ? 'success'
              : tone === 'warn'
                ? 'warning'
                : 'fg'
        }
      >
        {String(value)}
      </Text>
      <Text variant="caption" tone="muted" align="center" numberOfLines={1}>
        {label}
      </Text>
    </View>
  )
}

export interface SummaryActions {
  disabled: boolean
  onOpen?: (id: string) => void
  onRefreshStale?: () => void
  onExport?: () => void
  onPause?: (runId: string) => void
  onResume?: (runId: string) => void
  onCancel?: (runId: string) => void
}

function RunCard({
  run,
  sections,
  a,
}: {
  run: AuditRun
  sections: AuditSection[]
  a: SummaryActions
}) {
  const t = useT()
  const theme = useTheme()
  const own = run.sectionIds
    .map((id) => sections.find((s) => s.id === id))
    .filter((s): s is AuditSection => !!s)
  const r = own.filter((s) => s.status === 'in_progress').length
  const q = own.filter((s) => s.status === 'scheduled').length
  return (
    <Card style={{ gap: theme.space(2) }}>
      <Text variant="label">{t('audit.activeTitle', { r, q })}</Text>
      <RowGroup>
        {own.map((s) => (
          <Row
            key={s.id}
            title={s.title}
            trailing={<Badge tone={STATUS_TONE[s.status]}>{sectionStatus(t, s).label}</Badge>}
            onPress={() => a.onOpen?.(s.id)}
            chevron
            lines={2}
          />
        ))}
      </RowGroup>
      <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
        <Button
          size="sm"
          leadingIcon="pause"
          disabled={a.disabled}
          onPress={() => a.onPause?.(run.id)}
        >
          {t('audit.pause')}
        </Button>
        <Button
          size="sm"
          variant="danger"
          leadingIcon="square"
          disabled={a.disabled}
          onPress={() => a.onCancel?.(run.id)}
        >
          {t('audit.cancel')}
        </Button>
      </View>
    </Card>
  )
}

export function AuditsSummary({
  sections,
  runs,
  a,
}: {
  sections: AuditSection[]
  runs: AuditRun[]
  a: SummaryActions
}) {
  const t = useT()
  const theme = useTheme()
  const ready = sections.filter((s) => s.status === 'ready')
  const stale = sections.filter(isStale)
  const missing = sections.filter((s) => s.status === 'missing')
  const running = sections.filter((s) => s.status === 'in_progress').length
  const queued = sections.filter((s) => s.status === 'scheduled').length
  const lastDate = ready
    .map((s) => s.date)
    .filter(Boolean)
    .sort()
    .pop()
  return (
    <View
      style={{ paddingHorizontal: theme.space(4), paddingTop: theme.space(2), gap: theme.space(3) }}
    >
      <Text variant="caption" tone="muted">
        {`${lastDate ? t('audit.lastReport', { date: lastDate }) : t('audit.forming')} · ${t('audit.readyOf', { ready: ready.length, total: sections.length })}`}
      </Text>
      {/* Four numbers in one strip (#692): four tiles took 470 px and pushed the sections
          off the first screen; the callouts under it say what to do about them. */}
      <Card style={{ flexDirection: 'row', paddingHorizontal: theme.space(2) }}>
        <Stat
          label={t('audit.statReady')}
          value={ready.length}
          tone={ready.length === sections.length ? 'ok' : undefined}
        />
        <Stat
          label={t('audit.statStale')}
          value={stale.length}
          tone={stale.length ? 'warn' : undefined}
        />
        <Stat
          label={t('audit.statMissing')}
          value={missing.length}
          tone={missing.length ? 'crit' : undefined}
        />
        <Stat label={t('audit.statActive')} value={running + queued} />
      </Card>
      {runs.map((run) =>
        run.paused ? (
          <PausedRunCard
            key={run.id}
            run={run}
            sections={sections}
            disabled={a.disabled}
            onResume={() => a.onResume?.(run.id)}
            onCancel={() => a.onCancel?.(run.id)}
          />
        ) : (
          <RunCard key={run.id} run={run} sections={sections} a={a} />
        ),
      )}
      {stale.length > 0 && (
        <Callout
          tone="warn"
          icon="clock"
          title={t('audit.staleTitle', { n: stale.length })}
          action={
            <Button size="sm" variant="primary" disabled={a.disabled} onPress={a.onRefreshStale}>
              {t('audit.refreshStale', { n: stale.length })}
            </Button>
          }
        >
          {stale
            .map(
              (s) => `${s.title}: ${s.behind?.map((b) => `${b.module} +${b.commits}`).join(', ')}`,
            )
            .join('\n')}
        </Callout>
      )}
      <Text variant="heading">{t('audit.allSections')}</Text>
      <RowGroup>
        {sections.map((s) => {
          const st = sectionStatus(t, s)
          const behind = s.behind?.reduce((n, b) => n + b.commits, 0) ?? 0
          return (
            <Row
              key={s.id}
              title={s.title}
              subtitle={
                [s.date, behind > 0 && t('audit.behind', { n: behind })]
                  .filter(Boolean)
                  .join(' · ') || undefined
              }
              trailing={<Badge tone={st.tone}>{st.label}</Badge>}
              chevron
              onPress={() => a.onOpen?.(s.id)}
              lines={2}
            />
          )
        })}
      </RowGroup>
      {ready.length > 0 && (
        <Card tone="muted" style={{ gap: theme.space(2) }}>
          <Text variant="label">{t('audit.digestTitle')}</Text>
          <Text variant="caption" tone="muted">
            {t('audit.digestText', { n: ready.length })}
          </Text>
          <Button size="sm" leadingIcon="download" onPress={a.onExport}>
            {t('cabinet.export')}
          </Button>
        </Card>
      )}
    </View>
  )
}
