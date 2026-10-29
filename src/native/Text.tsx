/** @jsxRuntime automatic */
import {
  Platform,
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native'
import { faceWeight, NATIVE_FACES, useTheme, type NativeTheme } from './theme.tsx'

export type TextVariant = keyof NativeTheme['text']
/** `fg` is the default; the rest map to the palette's foreground steps and status colours. */
export type TextTone =
  'fg' | 'fg2' | 'muted' | 'primary' | 'success' | 'warning' | 'destructive' | 'inverse'

export interface TextProps extends RNTextProps {
  variant?: TextVariant
  tone?: TextTone
  align?: TextStyle['textAlign']
}

export function toneColor(theme: NativeTheme, tone: TextTone): string {
  const { colors } = theme
  switch (tone) {
    case 'fg2':
      return colors.fg2
    case 'muted':
      return colors.mutedForeground
    case 'primary':
      return colors.primary
    case 'success':
      return colors.success
    case 'warning':
      return colors.warning
    case 'destructive':
      return colors.destructive
    case 'inverse':
      return colors.primaryForeground
    default:
      return colors.foreground
  }
}

/**
  On a phone the weight picks the face's file by name (#692); the web keeps the family stack
  and lets the browser pick the weight.
*/
function nativeWeight(mono: boolean, weight: TextStyle['fontWeight']): TextStyle | null {
  if (Platform.OS === 'web') return null
  return {
    fontFamily: NATIVE_FACES[mono ? 'mono' : 'sans'][faceWeight(weight)],
    fontWeight: 'normal',
  }
}

/** Themed text: `variant` sets size/weight, `tone` the colour; always the brand face. */
export function Text({ variant = 'body', tone = 'fg', align, style, ...props }: TextProps) {
  const theme = useTheme()
  const spec = theme.text[variant]
  const weight = StyleSheet.flatten(style)?.fontWeight ?? spec.fontWeight
  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily: variant === 'mono' ? theme.font.mono : theme.font.sans,
          fontSize: spec.fontSize,
          lineHeight: spec.lineHeight,
          fontWeight: spec.fontWeight,
          color: toneColor(theme, tone),
          textAlign: align,
        },
        style,
        nativeWeight(variant === 'mono', weight),
      ]}
    />
  )
}
