/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { GitState, PermissionMode } from './model.ts'
import { MODE_KEY } from './new-session.tsx'

/**
 * One quiet line over the composer instead of a row of chips (owner's review): the model,
 * the branch with its counts, the permission mode — tap it for the session details sheet.
 */
export function SessionContextLine({
  model,
  git,
  mode,
  disabled = false,
  onPress,
}: {
  model?: string
  git?: GitState
  mode?: PermissionMode
  disabled?: boolean
  onPress?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const parts = [
    model,
    git?.branch &&
      [
        git.branch,
        git.changes.length ? `±${git.changes.length}` : '',
        git.ahead ? `↑${git.ahead}` : '',
      ]
        .filter(Boolean)
        .join(' '),
    mode && t(MODE_KEY[mode]),
  ].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('buffcode.contextDetails')}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: theme.space(4),
        paddingVertical: 6,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Text variant="caption" tone="muted" numberOfLines={1} style={{ flex: 1 }}>
        {parts.join(' · ')}
      </Text>
      <Icon name="chevronRight" size={14} color={c.mutedForeground} />
    </Pressable>
  )
}

/** The floating «to the latest message» button, shown while the timeline is scrolled up. */
export function JumpToLatest({ onPress }: { onPress?: () => void }) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        position: 'absolute',
        right: theme.space(4),
        bottom: theme.space(3),
        alignItems: 'flex-end',
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('buffcode.toLatest')}
        onPress={onPress}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: c.foreground,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 0.92,
        })}
      >
        <Icon name="arrowDown" size={18} color={c.background} strokeWidth={2.25} />
      </Pressable>
    </View>
  )
}

/** In place of the composer while a dock waits for the person's answer. */
export function WaitingAboveNote() {
  const t = useT()
  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        padding: theme.space(3),
        paddingHorizontal: theme.space(4),
      }}
    >
      <Icon name="info" size={16} color={theme.colors.mutedForeground} />
      <Text variant="caption" tone="muted" style={{ flex: 1 }}>
        {t('buffcode.waitingAbove')}
      </Text>
    </View>
  )
}
