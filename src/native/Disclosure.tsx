/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from './Icon.tsx'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/**
  A section folded under its heading (#692): what is there to read on demand, not in the
  way of what is to decide — the original statement under a gate, say.
*/
export function Disclosure({
  title,
  meta,
  defaultOpen = false,
  children,
}: {
  title: string
  /** A short note beside the title while folded: «2 attachments». */
  meta?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const theme = useTheme()
  const [open, setOpen] = useState(defaultOpen)
  return (
    <View style={{ gap: theme.space(3) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={meta ? `${title}. ${meta}` : title}
        onPress={() => setOpen((was) => !was)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          minHeight: theme.touch,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text variant="heading" style={{ flex: 1 }}>
          {title}
        </Text>
        {meta && !open && (
          <Text variant="caption" tone="muted">
            {meta}
          </Text>
        )}
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={18}
          color={theme.colors.mutedForeground}
        />
      </Pressable>
      {open && children}
    </View>
  )
}
