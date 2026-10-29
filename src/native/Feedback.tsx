/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Animated, View } from 'react-native'
import { toneColors, type Tone } from './Badge.tsx'
import { Button } from './Button.tsx'
import { Icon } from './Icon.tsx'
import { useAppear } from './motion.ts'
import { Spinner } from './Spinner.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

export { Spinner }

/** A grey block standing in for content that is loading. */
export function Skeleton({
  width = '100%',
  height = 14,
  radius,
}: {
  width?: number | `${number}%`
  height?: number
  radius?: number
}) {
  const theme = useTheme()
  return (
    <View
      accessibilityElementsHidden
      style={{
        width,
        height,
        borderRadius: radius ?? theme.radius.sm,
        backgroundColor: theme.colors.muted2,
      }}
    />
  )
}

export function Separator() {
  const theme = useTheme()
  return <View style={{ height: 1, backgroundColor: theme.colors.border }} />
}

/** A tinted note with an icon: a warning on a screen, a hint under a form. */
export function Callout({
  tone = 'info',
  icon,
  title,
  children,
  action,
}: {
  tone?: Tone
  icon?: IconName
  title?: string
  children?: string
  action?: ReactNode
}) {
  const theme = useTheme()
  const { bg, fg } = toneColors(theme, tone)
  const defaultIcon: IconName =
    tone === 'crit' || tone === 'warn' ? 'alertTriangle' : tone === 'ok' ? 'checkCircle' : 'info'
  return (
    <View
      accessibilityRole="alert"
      style={{
        flexDirection: 'row',
        gap: theme.space(3),
        padding: theme.space(3),
        borderRadius: theme.radius.md,
        backgroundColor: bg,
      }}
    >
      <Icon name={icon ?? defaultIcon} size={18} color={fg} />
      <View style={{ flex: 1, gap: 4 }}>
        {title && (
          <Text variant="label" style={{ color: fg, fontWeight: '600' }}>
            {title}
          </Text>
        )}
        {children && (
          <Text variant="label" style={{ color: fg }}>
            {children}
          </Text>
        )}
        {action}
      </View>
    </View>
  )
}

/**
  The centre of an empty, loading or failed screen: an icon, a sentence, maybe an action. `done`:
  the screen reports a success — its icon in the success colour.
*/
export function EmptyState({
  icon = 'inbox',
  title,
  text,
  action,
  loading = false,
  done = false,
}: {
  icon?: IconName
  title: string
  text?: string
  action?: { label: string; onPress?: () => void; icon?: IconName }
  loading?: boolean
  done?: boolean
}) {
  const theme = useTheme()
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.space(8),
        gap: theme.space(3),
      }}
    >
      {loading ? (
        <Spinner size="large" />
      ) : (
        <Icon
          name={icon}
          size={36}
          color={done ? theme.colors.success : theme.colors.mutedForeground}
          strokeWidth={done ? 1.75 : 1.25}
        />
      )}
      <Text variant="heading" align="center">
        {title}
      </Text>
      {text && (
        <Text tone="muted" align="center">
          {text}
        </Text>
      )}
      {action && (
        <Button
          variant="primary"
          leadingIcon={action.icon}
          onPress={action.onPress}
          style={{ marginTop: theme.space(2) }}
        >
          {action.label}
        </Button>
      )}
    </View>
  )
}

const TOAST_RISE_MS = 200

/** A transient message at the bottom of the screen; it rises and fades in (#692). */
export function Toast({ tone = 'neutral', children }: { tone?: Tone; children: string }) {
  const theme = useTheme()
  const { dot } = toneColors(theme, tone)
  const appear = useAppear(TOAST_RISE_MS)
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={{
        opacity: appear,
        transform: [
          { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
        ],
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        marginHorizontal: theme.space(4),
        padding: theme.space(3),
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.foreground,
      }}
    >
      {tone !== 'neutral' && (
        <View style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: dot }} />
      )}
      <Text variant="label" style={{ color: theme.colors.background, flex: 1 }}>
        {children}
      </Text>
    </Animated.View>
  )
}
