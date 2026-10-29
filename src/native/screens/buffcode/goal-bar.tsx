/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { GoalBarState } from './model.ts'

/**
 * The session's goal above the composer (#711), as in the window: the goal line, the last check's
 * reason, and Pause / Resume / Reset. The app builds `line` with BuffGoal.line.
 */
export function GoalBar({
  goal,
  disabled = false,
  onPause,
  onResume,
  onClear,
}: {
  goal: GoalBarState
  disabled?: boolean
  onPause?: () => void
  onResume?: () => void
  onClear?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const running = goal.status === 'active' || goal.status === 'checking'
  return (
    <View
      style={{
        gap: theme.space(1),
        paddingHorizontal: theme.space(4),
        paddingVertical: theme.space(2),
        borderTopWidth: 1,
        borderTopColor: c.border,
        backgroundColor: c.muted,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        <Icon name="microscope" size={14} color={c.brandSoftForeground} />
        <Text variant="caption" numberOfLines={2} style={{ flex: 1, fontWeight: '500' }}>
          {goal.line}
        </Text>
        {running && (
          <Button size="sm" variant="ghost" onPress={onPause} disabled={disabled}>
            {t('buffcode.goalPause')}
          </Button>
        )}
        {goal.status === 'paused' && (
          <Button size="sm" variant="ghost" onPress={onResume} disabled={disabled}>
            {t('buffcode.goalResume')}
          </Button>
        )}
        <Button size="sm" variant="ghost" onPress={onClear} disabled={disabled}>
          {t('buffcode.goalReset')}
        </Button>
      </View>
      {goal.reason ? (
        <Text variant="caption" tone="muted">
          {goal.reason}
        </Text>
      ) : null}
    </View>
  )
}
