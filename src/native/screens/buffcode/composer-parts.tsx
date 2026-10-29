/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { IconButton } from '../../Button.tsx'
import { Icon } from '../../Icon.tsx'
import type { Attachment } from '../../model.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

export function sizeLabel(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** An attachment in the composer: a thumbnail or a file mark, the name, the upload progress. */

export function AttachmentChip({
  attachment,
  disabled = false,
  onRemove,
}: {
  attachment: Attachment
  disabled?: boolean
  onRemove?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const uploading = attachment.progress !== undefined && attachment.progress < 1
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 8,
        paddingRight: 2,
        height: 40,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.muted,
        maxWidth: 220,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          backgroundColor: attachment.kind === 'image' ? c.primary : c.muted2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          name={attachment.kind === 'image' ? 'image' : 'fileText'}
          size={14}
          color={attachment.kind === 'image' ? '#fff' : c.mutedForeground}
        />
      </View>
      <View style={{ flexShrink: 1 }}>
        <Text variant="caption" numberOfLines={1}>
          {attachment.name}
        </Text>
        <Text variant="caption" tone="muted" style={{ fontSize: 10, lineHeight: 12 }}>
          {uploading
            ? t('buffcode.uploading', { percent: Math.round((attachment.progress ?? 0) * 100) })
            : sizeLabel(attachment.size)}
        </Text>
        {uploading && (
          <View style={{ height: 2, backgroundColor: c.muted2, borderRadius: 2, marginTop: 2 }}>
            <View
              style={{
                width: `${Math.round((attachment.progress ?? 0) * 100)}%`,
                height: 2,
                backgroundColor: c.primary,
                borderRadius: 2,
              }}
            />
          </View>
        )}
      </View>
      <IconButton
        icon="x"
        label={t('buffcode.removeAttachment')}
        onPress={onRemove}
        size="sm"
        disabled={disabled}
      />
    </View>
  )
}

/** A small chip in the composer's bottom row: the model, the mode, the branch. */

export function ComposerChip({
  icon,
  label,
  accent = false,
  disabled = false,
  onPress,
}: {
  icon?: Parameters<typeof Icon>[0]['name']
  label: string
  accent?: boolean
  disabled?: boolean
  onPress?: () => void
}) {
  const theme = useTheme()
  const c = theme.colors
  const fg = accent ? c.brandSoftForeground : c.fg2
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        height: 28,
        paddingHorizontal: 8,
        borderRadius: theme.radius.full,
        backgroundColor: accent ? c.brandSoft : c.muted,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      {icon && <Icon name={icon} size={12} color={fg} />}
      <Text variant="caption" style={{ color: fg, fontWeight: '500' }} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  )
}
