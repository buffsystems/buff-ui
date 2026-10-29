/** @jsxRuntime automatic */
import { Pressable, View, type ViewStyle } from 'react-native'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Spinner } from './Spinner.tsx'
import { Text } from './Text.tsx'
import { useTheme, type NativeTheme } from './theme.tsx'

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  /** ONE primary per screen, outline for the rest, ghost for low-weight actions. `danger` is
   *  a stop or a reject on a screen — outlined in red; the filled `destructive` is kept for
   *  the confirmation that follows it. */
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: IconName
  trailingIcon?: IconName
  /** Busy: a spinner replaces the leading icon and the button is disabled. */
  loading?: boolean
  disabled?: boolean
  /** Full width of its container. */
  block?: boolean
  onPress?: () => void
  children: string
  accessibilityLabel?: string
  style?: ViewStyle
}

function look(
  theme: NativeTheme,
  variant: ButtonVariant,
): { bg: string; fg: string; border: string } {
  const c = theme.colors
  switch (variant) {
    case 'primary':
      return { bg: c.primary, fg: c.primaryForeground, border: c.primary }
    case 'secondary':
      return { bg: c.secondary, fg: c.secondaryForeground, border: c.secondary }
    case 'ghost':
      return { bg: 'transparent', fg: c.foreground, border: 'transparent' }
    case 'destructive':
      return { bg: c.destructive, fg: c.destructiveForeground, border: c.destructive }
    case 'danger':
      return { bg: c.card, fg: c.destructive, border: c.destructive }
    default:
      return { bg: c.card, fg: c.foreground, border: c.borderStrong }
  }
}

/** A busy button stays bright — it is working; only an unavailable one dims. */
export function buttonOpacity(s: {
  disabled: boolean
  loading: boolean
  pressed: boolean
}): number {
  if (s.disabled) return 0.55
  if (s.loading) return 1
  return s.pressed ? 0.8 : 1
}

const HEIGHT: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 }
const FONT: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 16 }

export function Button({
  variant = 'outline',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  block = false,
  onPress,
  children,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const theme = useTheme()
  const { bg, fg, border } = look(theme, variant)
  const inactive = disabled || loading
  const iconSize = size === 'sm' ? 16 : 18
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: HEIGHT[size],
          paddingHorizontal: size === 'sm' ? theme.space(3) : theme.space(4),
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.space(2),
          // `auto` follows the parent's alignItems: centred in a centred column, sized by its
          // text in a row, full width in a plain column (the phone's default).
          alignSelf: block ? 'stretch' : 'auto',
          opacity: buttonOpacity({ disabled, loading, pressed }),
        },
        style,
      ]}
    >
      {loading ? (
        <Spinner color={fg} />
      ) : (
        leadingIcon && <Icon name={leadingIcon} size={iconSize} color={fg} />
      )}
      <Text
        variant="label"
        numberOfLines={1}
        style={{
          color: fg,
          fontSize: FONT[size],
          lineHeight: FONT[size] + 4,
          fontWeight: '500',
          flexShrink: 1,
        }}
      >
        {children}
      </Text>
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} color={fg} />}
    </Pressable>
  )
}

/** A square icon-only button; always carries a label for the screen reader. */
export function IconButton({
  icon,
  label,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
}: {
  icon: IconName
  label: string
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}) {
  const theme = useTheme()
  const { bg, fg, border } = look(theme, variant)
  const side = HEIGHT[size]
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        width: side,
        height: side,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: border,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.55 : pressed ? 0.8 : 1,
      })}
    >
      <View>
        <Icon name={icon} size={size === 'sm' ? 16 : 20} color={fg} />
      </View>
    </Pressable>
  )
}
