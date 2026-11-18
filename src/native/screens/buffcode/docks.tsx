/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Chip } from '../../Chip.tsx'
import { Input } from '../../Field.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { DockFrame } from './dock-frame.tsx'
import type { PermissionRequest } from './model.ts'

export { DockFrame }

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
