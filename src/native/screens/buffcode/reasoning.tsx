/** @jsxRuntime automatic */
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '../../Icon.tsx'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** The model's thoughts (#888): a folded «Мысли» row; a tap opens their Markdown, as in the window. */
export function Reasoning({ markdown }: { markdown: string }) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const [open, setOpen] = useState(false)
  return (
    <View style={{ gap: theme.space(2) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('buffcode.thoughts')}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        hitSlop={6}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          minHeight: 32,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Icon name="brain" size={14} color={c.mutedForeground} />
        <Text variant="caption" tone="muted">
          {t('buffcode.thoughts')}
        </Text>
        <Icon name={open ? 'chevronDown' : 'chevronRight'} size={14} color={c.mutedForeground} />
      </Pressable>
      {open && (
        <View style={{ paddingLeft: theme.space(5), opacity: 0.85 }}>
          <Prose markdown={markdown} />
        </View>
      )}
    </View>
  )
}
