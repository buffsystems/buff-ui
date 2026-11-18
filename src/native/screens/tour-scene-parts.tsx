/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Icon } from '../Icon.tsx'
import type { IconName } from '../icons.ts'
import { Text } from '../Text.tsx'
import { useTheme } from '../theme.tsx'

/* What the tour's pictures (#931) are drawn with: a panel, a button as a picture, a line with an icon. */

export function Panel({ children }: { children: ReactNode }) {
  const theme = useTheme()
  return (
    <View
      style={{
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.card,
        padding: theme.space(4),
        gap: theme.space(3),
        ...theme.raised,
      }}
    >
      {children}
    </View>
  )
}

/** A button as a picture: the look of one, nothing to press. */
export function Pill({ children, primary = false }: { children: string; primary?: boolean }) {
  const theme = useTheme()
  return (
    <View
      style={{
        flex: 1,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        backgroundColor: primary ? theme.colors.primary : theme.colors.background,
      }}
    >
      <Text
        variant="label"
        numberOfLines={1}
        style={{ color: primary ? theme.colors.primaryForeground : theme.colors.foreground }}
      >
        {children}
      </Text>
    </View>
  )
}

export function Line({ icon, children }: { icon: IconName; children: ReactNode }) {
  const theme = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
      <Icon name={icon} size={18} color={theme.colors.mutedForeground} />
      {children}
    </View>
  )
}
