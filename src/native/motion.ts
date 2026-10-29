import { useEffect, useRef } from 'react'
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native'

/** The native driver where there is one; the web animates on the JS side. */
export const NATIVE_DRIVER = Platform.OS !== 'web'

/**
  An entrance (#692): 0 → 1 over `ms` once mounted, eased out — or at once when the person
  asked the system to reduce motion.
*/
export function useAppear(ms: number): Animated.Value {
  const appear = useRef(new Animated.Value(0)).current
  useEffect(() => {
    let live = true
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!live) return
      if (reduce) appear.setValue(1)
      else
        Animated.timing(appear, {
          toValue: 1,
          duration: ms,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: NATIVE_DRIVER,
        }).start()
    })
    return () => {
      live = false
    }
  }, [appear, ms])
  return appear
}
