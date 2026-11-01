import type { LoadFailure } from '../../../model.ts'
/** @jsxRuntime automatic */
/*
  The «History» and «Metrics» tabs of a task (#629): the event feed, and the four tiles —
  changes, cost, tokens, time.
*/
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { EmptyState, Spinner } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import type { IconName } from '../../../icons.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme, type NativeTheme } from '../../../theme.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import type { HistoryEvent, HistoryTone, TaskMetricsData } from './model.ts'

const TONE_ICON: Record<HistoryTone, IconName> = {
  action: 'bell',
  success: 'checkCircle',
  error: 'alertTriangle',
  info: 'info',
  neutral: 'archive',
}

function toneColor(theme: NativeTheme, tone: HistoryTone): string {
  const c = theme.colors
  switch (tone) {
    case 'action':
      return c.warning
    case 'success':
      return c.success
    case 'error':
      return c.destructive
    case 'info':
      return c.primary
    default:
      return c.mutedForeground
  }
}

export function HistoryTab({
  events,
  loading = false,
  error = false,
  hasMore = false,
  onOpen,
  onShowMore,
  onRetry,
}: {
  events: HistoryEvent[]
  loading?: boolean
  error?: LoadFailure
  hasMore?: boolean
  onOpen?: (id: string) => void
  onShowMore?: () => void
  onRetry?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (loading) return <ListSkeleton />
  if (error) return <LoadError error={error} text={t('devt.historyError')} onRetry={onRetry} />
  if (events.length === 0) return <EmptyState icon="clock" title={t('devt.historyEmpty')} />
  return (
    <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
      <RowGroup>
        {events.map((e) => (
          <Row
            key={e.id}
            leading={<Icon name={TONE_ICON[e.tone]} size={20} color={toneColor(theme, e.tone)} />}
            title={e.count && e.count > 1 ? `${e.title} ×${e.count}` : e.title}
            subtitle={e.when}
            trailing={
              e.unread ? (
                <View
                  accessibilityLabel={t('devt.new')}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: theme.colors.primary,
                  }}
                />
              ) : undefined
            }
            onPress={() => onOpen?.(e.id)}
            lines={2}
          />
        ))}
      </RowGroup>
      {hasMore && (
        <Button variant="ghost" onPress={onShowMore} style={{ alignSelf: 'center' }}>
          {t('devt.showMore')}
        </Button>
      )}
    </View>
  )
}

function Tile({
  label,
  value,
  unit,
  note,
  live = false,
  onPress,
}: {
  label: string
  value: string
  unit?: string
  note?: string
  live?: boolean
  onPress?: () => void
}) {
  const theme = useTheme()
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${label} ${value}`}
      style={{ flex: 1, gap: 4, minWidth: 140 }}
    >
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text variant="title">{value}</Text>
        {unit && (
          <Text variant="caption" tone="muted">
            {unit}
          </Text>
        )}
        {live && <Spinner />}
      </View>
      {note && (
        <Text variant="caption" tone="muted" numberOfLines={2}>
          {note}
        </Text>
      )}
      {onPress && <Icon name="chevronRight" size={16} color={theme.colors.mutedForeground} />}
    </Card>
  )
}

/** The metric tiles; «Changes» opens the file list. */
export function MetricsTiles({
  metrics,
  loading = false,
  error = false,
  onOpenChanges,
  onRetry,
}: {
  metrics?: TaskMetricsData
  loading?: boolean
  error?: LoadFailure
  onOpenChanges?: () => void
  onRetry?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (loading) return <ListSkeleton rows={2} />
  if (error) return <LoadError error={error} text={t('devt.metricsError')} onRetry={onRetry} />
  if (!metrics) return null
  const fmt = (n: number) => n.toLocaleString('ru-RU')
  const tokens = (metrics.tokensIn + metrics.tokensOut) / 1e6
  return (
    <View
      style={{
        paddingHorizontal: theme.space(4),
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.space(2),
      }}
    >
      <Tile
        label={t('devt.mChanges')}
        value={String(metrics.filesTotal)}
        unit={t('devt.mFiles')}
        note={t('devt.mLines', { a: metrics.linesAdded, d: metrics.linesDeleted })}
        onPress={onOpenChanges}
      />
      <Tile
        label={t('devt.mCost')}
        value={t('dev.rub', { n: fmt(metrics.costRub) })}
        note={t('devt.mCostNote')}
      />
      <Tile
        label={t('devt.mTokens')}
        value={tokens.toFixed(1)}
        unit={t('devt.mMillion')}
        note={t('devt.mTokensNote', { i: fmt(metrics.tokensIn), o: fmt(metrics.tokensOut) })}
      />
      {metrics.time && (
        <Tile
          label={t('devt.mTime')}
          value={metrics.time.value}
          note={metrics.time.note}
          live={metrics.time.live}
        />
      )}
    </View>
  )
}
