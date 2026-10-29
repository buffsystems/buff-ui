/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Pressable, View, type ViewStyle } from 'react-native'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** A raised surface; pressable when `onPress` is given (a list card). */
export function Card({
  onPress,
  padded = true,
  tone = 'card',
  style,
  children,
  accessibilityLabel,
}: {
  onPress?: () => void
  padded?: boolean
  /** `muted` sits inside another card, outlined and flat; `card` is the default surface. */
  tone?: 'card' | 'muted'
  style?: ViewStyle
  children: ReactNode
  accessibilityLabel?: string
}) {
  const theme = useTheme()
  const base: ViewStyle = {
    borderRadius: theme.radius.lg,
    padding: padded ? theme.space(4) : 0,
    overflow: 'hidden',
    ...(tone === 'muted'
      ? { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.muted }
      : { backgroundColor: theme.colors.card, ...theme.raised }),
  }
  if (!onPress) return <View style={[base, style]}>{children}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}
    >
      {children}
    </Pressable>
  )
}

/** The heading row of a section of a screen: a title, optionally an action on the right. */
export function SectionHeader({
  title,
  count,
  action,
}: {
  title: string
  count?: number
  action?: ReactNode
}) {
  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.space(4),
        paddingTop: theme.space(4),
        paddingBottom: theme.space(2),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: theme.space(2) }}>
        <Text variant="heading">{title}</Text>
        {count !== undefined && (
          <Text variant="label" tone="muted">
            {String(count)}
          </Text>
        )}
      </View>
      {action}
    </View>
  )
}

/** A key/value pair in a details block. */
export function KeyValue({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.space(3),
        paddingVertical: 6,
      }}
    >
      <Text variant="label" tone="muted">
        {label}
      </Text>
      <Text variant={mono ? 'mono' : 'label'} style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  )
}
