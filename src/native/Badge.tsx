/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useTheme, type NativeTheme } from './theme.tsx'

/** The same tones as the web `Badge` / `StatusDot`: a state, never a brand colour. */
export type Tone = 'neutral' | 'info' | 'ok' | 'warn' | 'crit'

export function toneColors(
  theme: NativeTheme,
  tone: Tone,
): { bg: string; fg: string; dot: string } {
  const c = theme.colors
  switch (tone) {
    case 'info':
      return { bg: c.brandSoft, fg: c.brandSoftForeground, dot: c.primary }
    case 'ok':
      return { bg: c.successSoft, fg: c.successSoftForeground, dot: c.success }
    case 'warn':
      return { bg: c.warningSoft, fg: c.warningSoftForeground, dot: c.warning }
    case 'crit':
      return { bg: c.destructiveSoft, fg: c.destructiveSoftForeground, dot: c.destructive }
    default:
      return { bg: c.muted2, fg: c.fg2, dot: c.mutedForeground }
  }
}

/** A small tinted label for a state: «в работе», «готов», «3». */
export function Badge({
  tone = 'neutral',
  icon,
  children,
}: {
  tone?: Tone
  icon?: IconName
  children: string | number
}) {
  const theme = useTheme()
  const { bg, fg } = toneColors(theme, tone)
  // An outer row lets the pill size to its text without `alignSelf`, so a parent row can
  // centre it and a column does not stretch it.
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          height: 22,
          borderRadius: theme.radius.full,
          backgroundColor: bg,
        }}
      >
        {icon && <Icon name={icon} size={12} color={fg} strokeWidth={2.25} />}
        <Text variant="caption" style={{ color: fg, fontWeight: '600' }}>
          {String(children)}
        </Text>
      </View>
    </View>
  )
}

/** A coloured dot for a state; `pulse` marks «in progress». Decorative: pair it with text. */
export function StatusDot({
  tone = 'neutral',
  pulse = false,
  size = 8,
}: {
  tone?: Tone
  pulse?: boolean
  size?: number
}) {
  const theme = useTheme()
  const { dot } = toneColors(theme, tone)
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ width: size + 8, height: size + 8, alignItems: 'center', justifyContent: 'center' }}
    >
      {pulse && (
        <View
          style={{
            position: 'absolute',
            width: size + 8,
            height: size + 8,
            borderRadius: size + 8,
            backgroundColor: dot,
            opacity: 0.25,
          }}
        />
      )}
      <View style={{ width: size, height: size, borderRadius: size, backgroundColor: dot }} />
    </View>
  )
}
