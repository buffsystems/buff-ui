import type { LoadFailure } from '../../../model.ts'
/** @jsxRuntime automatic */
/*
  The findings of a review (#629): the filter, the cards with their actions, and the sheet
  that adds or edits one.
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { EmptyState } from '../../../Feedback.tsx'
import { Chip } from '../../../Chip.tsx'
import { Icon } from '../../../Icon.tsx'
import { Prose } from '../../../Prose.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { ListSkeleton } from '../parts.tsx'
import type { Finding, FindingStatus } from './model.ts'

export type FindingFilter = 'all' | 'open' | 'rejected' | 'resolved'
const STATUS_TONE: Record<FindingStatus, Tone> = {
  pending: 'warn',
  approved: 'info',
  rejected: 'neutral',
  resolved: 'ok',
}

export function matchesFindingFilter(f: Finding, filter: FindingFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'open') return f.status === 'pending' || f.status === 'approved'
  return f.status === filter
}

/** One finding: who raised it, its state, the title, the detail, the actions. */
export function FindingCard({
  finding,
  canDecide = true,
  canAsk = true,
  disabled = false,
  onAsk,
  onToFix,
  onDismiss,
  onEdit,
}: {
  finding: Finding
  canDecide?: boolean
  canAsk?: boolean
  disabled?: boolean
  onAsk?: () => void
  onToFix?: () => void
  onDismiss?: () => void
  onEdit?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const dim = finding.status === 'rejected' || finding.status === 'resolved'
  const key = `review.s${finding.status[0].toUpperCase()}${finding.status.slice(1)}`
  return (
    <Card style={{ gap: theme.space(2), opacity: dim ? 0.7 : 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon
          name={finding.source === 'model' ? 'cpu' : 'user'}
          size={14}
          color={theme.colors.mutedForeground}
        />
        <Text variant="caption" tone="muted" style={{ flex: 1 }}>
          {finding.source === 'model' ? t('review.srcModel') : t('review.srcUser')}
        </Text>
        <Badge tone={STATUS_TONE[finding.status]}>{t(key)}</Badge>
      </View>
      <Text
        variant="label"
        style={{ textDecorationLine: finding.status === 'rejected' ? 'line-through' : 'none' }}
      >
        {finding.title}
      </Text>
      {finding.detail && <Prose markdown={finding.detail} />}
      {finding.status !== 'resolved' && (canDecide || canAsk) && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
          {canAsk && finding.status !== 'rejected' && (
            <Button
              size="sm"
              variant="ghost"
              leadingIcon="circleHelp"
              disabled={disabled}
              onPress={onAsk}
            >
              {t('review.askAssistant')}
            </Button>
          )}
          {canDecide && finding.status !== 'approved' && (
            <Button size="sm" leadingIcon="check" disabled={disabled} onPress={onToFix}>
              {t('review.toFix')}
            </Button>
          )}
          {canDecide && finding.status !== 'rejected' && (
            <Button size="sm" leadingIcon="x" disabled={disabled} onPress={onDismiss}>
              {t('review.dismiss')}
            </Button>
          )}
          {canDecide && (
            <Button
              size="sm"
              variant="ghost"
              leadingIcon="pencil"
              disabled={disabled}
              onPress={onEdit}
            >
              {t('review.edit')}
            </Button>
          )}
        </View>
      )}
    </Card>
  )
}

export function FindingsTab({
  findings,
  filter = 'open',
  loading = false,
  error = false,
  canAdd = true,
  canDecide = true,
  disabled = false,
  onFilter,
  onAdd,
  onAsk,
  onToFix,
  onDismiss,
  onEdit,
}: {
  findings: Finding[]
  filter?: FindingFilter
  loading?: boolean
  error?: LoadFailure
  canAdd?: boolean
  canDecide?: boolean
  disabled?: boolean
  onFilter?: (f: FindingFilter) => void
  onAdd?: () => void
  onAsk?: (id: string) => void
  onToFix?: (id: string) => void
  onDismiss?: (id: string) => void
  onEdit?: (id: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const count = (f: FindingFilter) => findings.filter((x) => matchesFindingFilter(x, f)).length
  const shown = findings.filter((x) => matchesFindingFilter(x, filter))
  return (
    <View
      style={{ paddingHorizontal: theme.space(4), paddingTop: theme.space(2), gap: theme.space(3) }}
    >
      {/* Four filters with counts don't fit a segmented control at 360 dp: chips wrap. */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
        {(['all', 'open', 'rejected', 'resolved'] as FindingFilter[]).map((id) => (
          <Chip key={id} selected={id === filter} count={count(id)} onPress={() => onFilter?.(id)}>
            {t(`review.filter${id[0].toUpperCase()}${id.slice(1)}`)}
          </Chip>
        ))}
      </View>
      <Button leadingIcon="plus" block disabled={disabled || !canAdd} onPress={onAdd}>
        {t('review.addFinding')}
      </Button>
      {loading ? (
        <ListSkeleton rows={3} />
      ) : error ? (
        <Text tone="destructive">{t('review.findingsError')}</Text>
      ) : findings.length === 0 ? (
        <EmptyState
          icon="listChecks"
          title={t('review.findingsNone')}
          text={t('review.findingsEmpty')}
        />
      ) : shown.length === 0 ? (
        <Text tone="muted" align="center">
          {t('review.findingsFiltered')}
        </Text>
      ) : (
        shown.map((f) => (
          <FindingCard
            key={f.id}
            finding={f}
            canDecide={canDecide}
            disabled={disabled}
            onAsk={() => onAsk?.(f.id)}
            onToFix={() => onToFix?.(f.id)}
            onDismiss={() => onDismiss?.(f.id)}
            onEdit={() => onEdit?.(f.id)}
          />
        ))
      )}
    </View>
  )
}
