/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { useTheme } from '../../theme.tsx'

/** A switch: on / off / mixed (a group with some types on). The track is the touch target. */
export function Toggle({
  value,
  mixed = false,
  disabled = false,
  label,
  onChange,
}: {
  value: boolean
  mixed?: boolean
  disabled?: boolean
  label: string
  onChange?: (next: boolean) => void
}) {
  const theme = useTheme()
  const c = theme.colors
  const on = value || mixed
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: mixed ? 'mixed' : value, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!value)}
      hitSlop={8}
      style={{ width: 51, height: 31, justifyContent: 'center', opacity: disabled ? 0.5 : 1 }}
    >
      <View
        style={{
          width: 51,
          height: 31,
          borderRadius: 16,
          backgroundColor: on ? c.primary : c.muted2,
          opacity: mixed ? 0.6 : 1,
          justifyContent: 'center',
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            width: 27,
            height: 27,
            borderRadius: 14,
            backgroundColor: '#ffffff',
            alignSelf: on ? 'flex-end' : 'flex-start',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      </View>
    </Pressable>
  )
}
