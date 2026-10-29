/** @jsxRuntime automatic */
/*
  The decision of a review (#629): the bar with its caption and two buttons, and the sheets
  behind them — approve (with the repositories it publishes to), rework, and the block
  when open findings stand in the way.
*/
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Text } from '../../../Text.tsx'
import { ConfirmSheet, Sheet } from '../../../Sheet.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { Finding, Review } from './model.ts'

export function openFindings(findings: Finding[]): number {
  return findings.filter((f) => f.status === 'pending' || f.status === 'approved').length
}

/** The sticky bar under the changes: what approval does, then «Approve» / «Rework». */
export function DecisionBar({
  review,
  canApprove = true,
  canRework = true,
  disabled = false,
  onApprove,
  onRework,
}: {
  review: Review
  canApprove?: boolean
  canRework?: boolean
  disabled?: boolean
  onApprove?: () => void
  onRework?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const open = openFindings(review.findings)
  if (!canApprove && !canRework)
    return (
      <View style={{ padding: theme.space(3) }}>
        <Text variant="caption" tone="muted">
          {t('rvd.noRight')}
        </Text>
      </View>
    )
  // One short line over the buttons (#692): what approval does, or what holds it; the sheets
  // behind the buttons explain the rest.
  const caption =
    open > 0
      ? t('rvd.blocked', { n: open })
      : review.publishTargets.length > 0
        ? t('rvd.publishPr', { targets: review.publishTargets.join(', ') })
        : t('rvd.publishMerge')
  return (
    <View style={{ padding: theme.space(3), gap: theme.space(2) }}>
      <Text variant="caption" tone="muted" numberOfLines={2}>
        {caption}
      </Text>
      <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
        {/* The likely decision is the primary one: approve while nothing is open, else rework. */}
        <Button
          variant={open === 0 && canApprove ? 'primary' : 'outline'}
          leadingIcon="check"
          disabled={disabled || !canApprove}
          onPress={onApprove}
          style={{ flex: 1, opacity: open > 0 ? 0.6 : 1 }}
        >
          {t('rvd.approve')}
        </Button>
        <Button
          variant={open === 0 && canApprove ? 'outline' : 'primary'}
          leadingIcon="refreshCw"
          disabled={disabled || !canRework}
          onPress={onRework}
          style={{ flex: 1 }}
        >
          {t('rvd.rework')}
        </Button>
      </View>
    </View>
  )
}

/** «Approve» while findings are open: dismiss them all, or go to rework. */
export function BlockedSheet({
  open,
  onDismissAll,
  onRework,
  onClose,
}: {
  open: number
  onDismissAll?: () => void
  onRework?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('rvd.blockedTitle')} onClose={onClose}>
      <Text tone="fg2">{t('rvd.blockedText', { n: open })}</Text>
      <View style={{ gap: 8, paddingTop: 8 }}>
        <Button variant="primary" block onPress={onDismissAll}>
          {t('rvd.dismissAll', { n: open })}
        </Button>
        <Button block onPress={onRework}>
          {t('rvd.reworkSheet')}
        </Button>
        <Button variant="secondary" block onPress={onClose}>
          {t('common.cancel')}
        </Button>
      </View>
    </Sheet>
  )
}

/** «Send for rework?» when findings marked to fix exist. */
export function ReworkConfirmSheet({
  toFix,
  pending,
  onConfirm,
  onClose,
}: {
  toFix: number
  pending: number
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('rvd.reworkTitle')}
      text={`${t('rvd.reworkText', { n: toFix })}${pending > 0 ? ` ${t('rvd.reworkPending', { n: pending })}` : ''}`}
      confirmLabel={t('rvd.reworkSend')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
