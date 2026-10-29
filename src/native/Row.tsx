/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/**
 * A list row: leading slot, title + subtitle, trailing slot, a chevron when it navigates.
 * The touch target is the theme's floor; rows separate with a hairline inside `RowGroup`.
 * Buttons of their own go in `actions`, beside the row's press — never inside it: a button in a
 * button is one element to a screen reader, its inner button out of reach.
 */
export function Row({
  leading,
  icon,
  title,
  subtitle,
  trailing,
  actions,
  chevron = false,
  onPress,
  disabled = false,
  destructive = false,
  lines = 1,
  label,
}: {
  leading?: ReactNode
  icon?: IconName
  title: string
  subtitle?: string
  trailing?: ReactNode
  /** The row's own buttons, after the pressable part. */
  actions?: ReactNode
  chevron?: boolean
  onPress?: () => void
  disabled?: boolean
  destructive?: boolean
  /** Lines of the title before it truncates. */
  lines?: number
  /** What a screen reader says, when the title alone does not say what the row does. */
  label?: string
}) {
  const theme = useTheme()
  const titleTone = destructive ? 'destructive' : 'fg'
  const body = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(3),
        minHeight: theme.touch + 8,
        paddingHorizontal: theme.space(4),
        paddingVertical: theme.space(2),
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {leading ?? (icon && <Icon name={icon} size={20} color={theme.colors.mutedForeground} />)}
      <View style={{ flex: 1, gap: 2 }}>
        <Text tone={titleTone} numberOfLines={lines}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" tone="muted" numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
      {/* One row, one way on: with buttons of its own the row needs no chevron as well. */}
      {chevron && !actions && (
        <Icon name="chevronRight" size={18} color={theme.colors.mutedForeground} />
      )}
    </View>
  )
  const action = actions && (
    <View style={{ flexDirection: 'row', gap: 2, paddingRight: theme.space(2) }}>{actions}</View>
  )
  if (!onPress)
    return action ? (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>{body}</View>
        {action}
      </View>
    ) : (
      body
    )
  const press = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({ backgroundColor: pressed ? theme.colors.muted : 'transparent' })}
    >
      {body}
    </Pressable>
  )
  if (!action) return press
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>{press}</View>
      {action}
    </View>
  )
}

/** The heading of a settings-like section: over a RowGroup, a switch, a field. */
export function SectionTitle({ children }: { children: string }) {
  const theme = useTheme()
  return (
    <Text
      variant="caption"
      tone="muted"
      style={{ paddingHorizontal: theme.space(4), textTransform: 'uppercase', letterSpacing: 0.5 }}
    >
      {children}
    </Text>
  )
}

/** Rows inside one card with hairlines between them. */
export function RowGroup({
  children,
  title,
}: {
  children: ReactNode[] | ReactNode
  title?: string
}) {
  const theme = useTheme()
  const items = Array.isArray(children) ? children.filter(Boolean) : [children]
  return (
    <View style={{ gap: theme.space(2) }}>
      {title && <SectionTitle>{title}</SectionTitle>}
      <View
        style={{
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.card,
          overflow: 'hidden',
          ...theme.raised,
        }}
      >
        {items.map((child, i) => (
          <View
            key={i}
            style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: theme.colors.border }}
          >
            {child}
          </View>
        ))}
      </View>
    </View>
  )
}
