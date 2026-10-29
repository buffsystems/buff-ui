/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { sizeLabel } from './composer-parts.tsx'

/**
 * A file the agent handed over (#708): its kind, name, size and the agent's note; a tap opens it —
 * a picture or text in the app, a document in the system's viewer.
 */
export function SentFile({
  name,
  mime,
  bytes,
  note,
  onOpen,
}: {
  name: string
  mime: string
  bytes: number
  note?: string
  onOpen?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const icon = mime.startsWith('image/') ? 'image' : mime.startsWith('text/') ? 'fileText' : 'file'
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t('buffcode.sentFile')}: ${name}`}
      disabled={!onOpen}
      onPress={onOpen}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(3),
        padding: theme.space(3),
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.card,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: theme.radius.sm,
          backgroundColor: c.brandSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={18} color={c.brandSoftForeground} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" tone="muted">
          {t('buffcode.sentFile')} · {sizeLabel(bytes)}
        </Text>
        <Text numberOfLines={2} style={{ fontWeight: '500' }}>
          {name}
        </Text>
        {note ? (
          <Text variant="caption" tone="muted" numberOfLines={3}>
            {note}
          </Text>
        ) : null}
      </View>
      <Icon name="chevronRight" size={16} color={c.mutedForeground} />
    </Pressable>
  )
}
