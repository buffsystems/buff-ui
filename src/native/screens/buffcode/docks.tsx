/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import { View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Chip } from '../../Chip.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { PermissionRequest } from './model.ts'

/** The frame of a dock above the composer: a tinted card with a title row, body and actions. */
export function DockFrame({
  icon,
  title,
  badge,
  warning = false,
  children,
  footer,
}: {
  icon: IconName
  title: string
  badge?: string
  warning?: boolean
  children?: ReactNode
  footer: ReactNode
}) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      accessibilityRole="alert"
      style={{
        marginHorizontal: theme.space(3),
        marginBottom: theme.space(2),
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: warning ? c.warning : c.borderStrong,
        backgroundColor: c.popover,
        padding: theme.space(3),
        gap: theme.space(3),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        <Icon name={icon} size={18} color={warning ? c.warning : c.primary} />
        <Text variant="label" style={{ flex: 1, fontWeight: '600' }}>
          {title}
        </Text>
        {badge && <Badge tone="neutral">{badge}</Badge>}
      </View>
      {children}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: theme.space(2),
          flexWrap: 'wrap',
        }}
      >
        {footer}
      </View>
    </View>
  )
}

/** «May I run this?» — allow once, always (within the mode's scope), or deny with a reason. */
export function PermissionDock({
  request,
  disabled = false,
  onDecide,
}: {
  request: PermissionRequest
  disabled?: boolean
  onDecide?: (decision: 'once' | 'always' | 'reject', reason?: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const [reason, setReason] = useState('')
  return (
    <DockFrame
      icon="alertTriangle"
      title={t('buffcode.permissionTitle')}
      badge={request.subagent ? t('buffcode.subagent') : undefined}
      warning
      footer={
        <>
          <Button
            size="sm"
            variant="ghost"
            disabled={disabled}
            onPress={() => onDecide?.('reject', reason.trim() || undefined)}
          >
            {t('buffcode.deny')}
          </Button>
          <Button
            size="sm"
            disabled={disabled || !request.alwaysNote}
            onPress={() => onDecide?.('always')}
          >
            {t('buffcode.allowAlways')}
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={disabled}
            onPress={() => onDecide?.('once')}
          >
            {t('buffcode.allowOnce')}
          </Button>
        </>
      }
    >
      <Text>{request.title}</Text>
      {request.hint && (
        <Text variant="caption" tone="muted">
          {request.hint}
        </Text>
      )}
      {request.patterns.length > 0 && (
        <View style={{ gap: 4 }}>
          {request.patterns.map((p) => (
            <Text
              key={p}
              variant="mono"
              style={{
                color: theme.colors.codeFg,
                backgroundColor: theme.colors.codeBg,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: theme.radius.sm,
              }}
              numberOfLines={1}
            >
              {p}
            </Text>
          ))}
        </View>
      )}
      {request.diffFile && <Chip icon="fileText">{request.diffFile}</Chip>}
      {request.alwaysNote && (
        <Text variant="caption" tone="muted">
          {request.alwaysNote}
        </Text>
      )}
      <Input
        placeholder={t('buffcode.denyReason')}
        value={reason}
        onChangeText={setReason}
        editable={!disabled}
      />
    </DockFrame>
  )
}
