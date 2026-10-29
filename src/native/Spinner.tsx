/** @jsxRuntime automatic */
import { useEffect, useRef } from 'react'
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native'
import { Icon } from './Icon.tsx'
import { useT, useTheme } from './theme.tsx'

/** The breaths of the waiting mark: a full one takes 2 s, as Buff Code's splash pulse. */
const BREATH_MS = 1000
const SPINNER_SIZE = { small: 20, large: 36 } as const

/**
  The one waiting indicator (#690): the brand's brain breathing, as on Buff Code's splash —
  never the platform's spinner. Still when the person asked the system to reduce motion.
*/
export function Spinner({ size = 'small', color }: { size?: 'small' | 'large'; color?: string }) {
  const theme = useTheme()
  const t = useT()
  const opacity = useRef(new Animated.Value(1)).current
  useEffect(() => {
    let live = true
    let loop: Animated.CompositeAnimation | undefined
    const breath = (toValue: number) =>
      Animated.timing(opacity, {
        toValue,
        duration: BREATH_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      })
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!live || reduce) return
      loop = Animated.loop(Animated.sequence([breath(0.4), breath(1)]))
      loop.start()
    })
    return () => {
      live = false
      loop?.stop()
    }
  }, [opacity])
  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel={t('common.loading')}
      style={{ opacity }}
    >
      <Icon name="brain" size={SPINNER_SIZE[size]} color={color ?? theme.colors.primary} />
    </Animated.View>
  )
}
