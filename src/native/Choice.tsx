/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from './Icon.tsx'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/**
  One option of a choice (#692): a radio when one may be picked, a check when several — the
  same mark everywhere an option is picked (the cabinet's questions, Buff Code's dock).
*/
export function Choice({
  label,
  hint,
  badge,
  picked,
  multiple = false,
  disabled = false,
  onPress,
}: {
  label: string
  hint?: string
  /** Beside the label: «recommended». */
  badge?: ReactNode
  picked: boolean
  multiple?: boolean
  disabled?: boolean
  onPress?: () => void
}) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <Pressable
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: picked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(3),
        minHeight: theme.touch,
        paddingHorizontal: theme.space(3),
        paddingVertical: theme.space(2),
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: picked ? c.primary : c.border,
        backgroundColor: picked ? c.brandSoft : c.card,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: multiple ? 5 : 10,
          borderWidth: 2,
          borderColor: picked ? c.primary : c.borderStrong,
          backgroundColor: picked ? c.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {picked && <Icon name="check" size={12} color={c.primaryForeground} strokeWidth={3} />}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Text variant="label" style={{ color: picked ? c.brandSoftForeground : c.foreground }}>
            {label}
          </Text>
          {badge}
        </View>
        {hint && (
          <Text variant="caption" tone="muted">
            {hint}
          </Text>
        )}
      </View>
    </Pressable>
  )
}
