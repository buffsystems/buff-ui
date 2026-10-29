/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** A filter chip: pressed = selected. A row of them scrolls sideways on a phone. */
export function Chip({
  selected = false,
  icon,
  count,
  onPress,
  children,
}: {
  selected?: boolean
  icon?: IconName
  count?: number
  onPress?: () => void
  children: string
}) {
  const theme = useTheme()
  const c = theme.colors
  const fg = selected ? c.accentForeground : c.fg2
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: 34,
        paddingHorizontal: 12,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: selected ? c.accent : c.border,
        backgroundColor: selected ? c.accent : c.card,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon && <Icon name={icon} size={14} color={fg} />}
      <Text variant="label" style={{ color: fg }}>
        {children}
      </Text>
      {count !== undefined && (
        <Text variant="caption" style={{ color: fg, opacity: 0.8 }}>
          {String(count)}
        </Text>
      )}
    </Pressable>
  )
}

/** The horizontal strip of chips under a top bar. */
export function ChipRow({ children }: { children: ReactNode }) {
  const theme = useTheme()
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.space(2), paddingHorizontal: theme.space(4) }}
    >
      <View style={{ flexDirection: 'row', gap: theme.space(2) }}>{children}</View>
    </ScrollView>
  )
}
