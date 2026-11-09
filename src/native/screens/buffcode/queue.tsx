/** @jsxRuntime automatic */
import { Text, View } from 'react-native'
import { IconButton } from '../../Button.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** A message sent while the agent worked (#812): it waits for the end of the turn. */
export interface QueuedMessage {
  id: string
  text: string
  /** Attached files, by count. */
  files: number
}

/**
 * What waits above the composer (#812): each queued message can be dropped or sent at once —
 * into the agent's current turn. Nothing waits — nothing is shown.
 */
export function QueuedMessages({
  items,
  disabled = false,
  onCancel,
  onSendNow,
}: {
  items: QueuedMessage[]
  disabled?: boolean
  onCancel?: (id: string) => void
  onSendNow?: (id: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  if (!items.length) return null
  return (
    <View
      style={{ paddingHorizontal: theme.space(3), paddingTop: theme.space(2), gap: theme.space(1) }}
    >
      <Text style={{ fontFamily: theme.font.sans, fontSize: 12, color: c.mutedForeground }}>
        {t('buffcode.queued', { n: items.length })}
      </Text>
      {items.map((item) => {
        const files = item.files > 0 ? t('buffcode.queuedFiles', { n: item.files }) : ''
        const name = item.text.trim() || files
        return (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.space(1),
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.muted,
              paddingLeft: theme.space(2),
            }}
          >
            <View style={{ flex: 1, paddingVertical: theme.space(1) }}>
              {item.text.trim() !== '' && (
                <Text
                  numberOfLines={2}
                  style={{ fontFamily: theme.font.sans, fontSize: 14, color: c.foreground }}
                >
                  {item.text}
                </Text>
              )}
              {files !== '' && (
                <Text
                  style={{ fontFamily: theme.font.sans, fontSize: 12, color: c.mutedForeground }}
                >
                  {files}
                </Text>
              )}
            </View>
            <IconButton
              icon="send"
              label={t('buffcode.queuedSendNow', { text: name })}
              onPress={() => onSendNow?.(item.id)}
              size="sm"
              disabled={disabled}
            />
            <IconButton
              icon="x"
              label={t('buffcode.queuedCancel', { text: name })}
              onPress={() => onCancel?.(item.id)}
              size="sm"
              disabled={disabled}
            />
          </View>
        )
      })}
    </View>
  )
}
