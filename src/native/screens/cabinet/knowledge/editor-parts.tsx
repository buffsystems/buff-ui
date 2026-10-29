/** @jsxRuntime automatic */
/*
  The knowledge editor's pieces (#629): the address rule, the examples per type, a checkbox.
*/
import { Pressable, View } from 'react-native'
import { Icon } from '../../../Icon.tsx'
import { Text } from '../../../Text.tsx'
import { useTheme } from '../../../theme.tsx'
import type { KnowledgeType } from './model.ts'

export const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** The example per type, as string keys: the placeholders speak the app's language. */
export const EXAMPLE: Record<KnowledgeType, { title: string; description: string }> = {
  rule: { title: 'kbe.exampleRuleTitle', description: 'kbe.exampleRuleDescription' },
  fact: { title: 'kbe.exampleFactTitle', description: 'kbe.exampleFactDescription' },
  pitfall: { title: 'kbe.examplePitfallTitle', description: 'kbe.examplePitfallDescription' },
}

export function Check({
  label,
  hint,
  checked,
  disabled,
  onPress,
}: {
  label: string
  hint: string
  checked: boolean
  disabled: boolean
  onPress?: () => void
}) {
  const theme = useTheme()
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: theme.space(3),
        minHeight: theme.touch,
        alignItems: 'flex-start',
      }}
    >
      <Icon
        name={checked ? 'checkCircle' : 'square'}
        size={20}
        color={checked ? theme.colors.primary : theme.colors.mutedForeground}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="label">{label}</Text>
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      </View>
    </Pressable>
  )
}
