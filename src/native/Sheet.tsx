/** @jsxRuntime automatic */
import { useMemo, useRef, type ReactNode } from 'react'
import { Animated, PanResponder, Pressable, ScrollView, View } from 'react-native'
import { IconButton } from './Button.tsx'
import { NATIVE_DRIVER, useAppear } from './motion.ts'
import { Text } from './Text.tsx'
import { useT, useTheme } from './theme.tsx'

/** The sheet rises from below as the scrim fades in; a pull past this closes it. */
const RISE_MS = 240
const RISE_FROM = 360
const PULL_TO_CLOSE = 96

/** The sheet's entrance and the pull on its handle (#692): it rises, and follows the finger. */
function useSheetMotion(onClose?: () => void) {
  const appear = useAppear(RISE_MS)
  const pull = useRef(new Animated.Value(0)).current
  const handle = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => !!onClose && g.dy > 4,
        onPanResponderMove: (_, g) => pull.setValue(Math.max(0, g.dy)),
        onPanResponderRelease: (_, g) => {
          if (onClose && (g.dy > PULL_TO_CLOSE || g.vy > 1)) onClose()
          else
            Animated.spring(pull, {
              toValue: 0,
              useNativeDriver: NATIVE_DRIVER,
            }).start()
        },
      }),
    [onClose, pull],
  )
  const translateY = Animated.add(
    pull,
    appear.interpolate({ inputRange: [0, 1], outputRange: [RISE_FROM, 0] }),
  )
  return { appear, translateY, handle: handle.panHandlers }
}

/**
 * A bottom sheet, drawn over the screen it belongs to. Presentational: the host decides
 * when it is open; `onClose` fires from the scrim, the close button and a pull on the handle.
 */
export function Sheet({
  title,
  onClose,
  children,
  footer,
}: {
  title?: string
  onClose?: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const theme = useTheme()
  const t = useT()
  const motion = useSheetMotion(onClose)
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: motion.appear,
        }}
      >
        <Pressable
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(5, 8, 16, 0.5)' }}
        />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        style={{
          maxHeight: '85%',
          borderTopLeftRadius: theme.radius.lg + 6,
          borderTopRightRadius: theme.radius.lg + 6,
          backgroundColor: theme.colors.popover,
          // In dark the dimmed screen and the sheet are close in tone: a hairline draws its edge.
          borderTopWidth: theme.scheme === 'dark' ? 1 : 0,
          borderColor: theme.colors.border,
          paddingBottom: theme.space(6),
          transform: [{ translateY: motion.translateY }],
        }}
      >
        <View {...motion.handle}>
          <View style={{ alignItems: 'center', paddingTop: 8 }}>
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 4,
                backgroundColor: theme.colors.borderStrong,
              }}
            />
          </View>
          {title && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: theme.space(4),
                paddingRight: theme.space(2),
                paddingTop: theme.space(2),
              }}
            >
              <Text variant="heading" style={{ flex: 1 }}>
                {title}
              </Text>
              <IconButton icon="x" label={t('common.close')} onPress={onClose} size="sm" />
            </View>
          )}
        </View>
        {/* A long list (projects, installs) scrolls inside the sheet; title and footer stay. */}
        <ScrollView
          style={{ flexGrow: 0, flexShrink: 1 }}
          contentContainerStyle={{
            paddingHorizontal: theme.space(4),
            paddingTop: theme.space(3),
            gap: theme.space(3),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer && (
          <View
            style={{
              paddingHorizontal: theme.space(4),
              paddingTop: theme.space(4),
              gap: theme.space(2),
            }}
          >
            {footer}
          </View>
        )}
      </Animated.View>
    </View>
  )
}

/** A yes/no question in a sheet: title, text, a primary (or destructive) action and cancel. */
export function ConfirmSheet({
  title,
  text,
  confirmLabel,
  destructive = false,
  onConfirm,
  onClose,
}: {
  title: string
  text?: string
  confirmLabel: string
  destructive?: boolean
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={title} onClose={onClose}>
      {text && <Text tone="fg2">{text}</Text>}
      <View style={{ gap: 8, paddingTop: 8 }}>
        <SheetAction label={confirmLabel} primary destructive={destructive} onPress={onConfirm} />
        <SheetAction label={t('common.cancel')} onPress={onClose} />
      </View>
    </Sheet>
  )
}

function SheetAction({
  label,
  primary = false,
  destructive = false,
  onPress,
}: {
  label: string
  primary?: boolean
  destructive?: boolean
  onPress?: () => void
}) {
  const theme = useTheme()
  const c = theme.colors
  const bg = destructive ? c.destructive : primary ? c.primary : c.secondary
  const fg = destructive
    ? c.destructiveForeground
    : primary
      ? c.primaryForeground
      : c.secondaryForeground
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        height: 48,
        borderRadius: theme.radius.md,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text variant="label" style={{ color: fg, fontSize: 15, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  )
}
