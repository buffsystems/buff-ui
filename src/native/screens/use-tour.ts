import { useCallback, useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native'

/**
 * Whether cards may turn by themselves: not when the person asked the system for less motion or
 * a screen reader is on — and the answer follows the system while the tour is open.
 */
function useSelfTurning(wanted: boolean): boolean {
  const [reduce, setReduce] = useState(true)
  const [reader, setReader] = useState(true)
  useEffect(() => {
    if (!wanted) return
    let live = true
    void AccessibilityInfo.isReduceMotionEnabled().then((on) => live && setReduce(on))
    // The web cannot tell a screen reader and answers «on» to be safe: there «reduce motion»
    // alone decides.
    if (Platform.OS === 'web') setReader(false)
    else void AccessibilityInfo.isScreenReaderEnabled().then((on) => live && setReader(on))
    const subs = [
      AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce),
      ...(Platform.OS === 'web'
        ? []
        : [AccessibilityInfo.addEventListener('screenReaderChanged', setReader)]),
    ]
    return () => {
      live = false
      for (const s of subs) s?.remove?.()
    }
  }, [wanted])
  return wanted && !reduce && !reader
}

export interface Tour {
  index: number
  /** The current card's time, 0 → 1. */
  progress: Animated.Value
  /** Cards turn by themselves (the system allows it). */
  selfTurning: boolean
  /** There is a clock to pause: cards turn by themselves and the last one has not run out. */
  pausable: boolean
  paused: boolean
  togglePause: () => void
  /** A finger down holds the card, up lets it go on. */
  hold: () => void
  release: () => void
  /** Back on the first card starts its time again; without a clock there is nothing to restart. */
  canBack: boolean
  back: () => void
  /** Next on the last card ends the tour. */
  next: () => void
}

/** What runs a card's time: `Animated.timing`, or a test's stand-in. */
export type TourTiming = (
  value: Animated.Value,
  config: Animated.TimingAnimationConfig,
) => Pick<Animated.CompositeAnimation, 'start' | 'stop'>

/** The clock of the tour (#931): which card shows, how far its time has run, pause and hold. */
export function useTour(o: {
  count: number
  cardMs: number
  autoAdvance: boolean
  onEnd?: (() => void) | undefined
  timing?: TourTiming
}): Tour {
  const { count, cardMs, timing = Animated.timing } = o
  const selfTurning = useSelfTurning(o.autoAdvance)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // The last card's time has run out: the clock has nothing more to do.
  const [ended, setEnded] = useState(false)
  const progress = useRef(new Animated.Value(0)).current
  const at = useRef(0)
  const clock = useRef<ReturnType<TourTiming> | null>(null)
  const running = selfTurning && !paused && !ended

  useEffect(() => {
    const id = progress.addListener(({ value }) => (at.current = value))
    return () => progress.removeListener(id)
  }, [progress])

  const stop = useCallback(() => {
    clock.current?.stop()
    clock.current = null
  }, [])

  const run = useCallback(() => {
    stop()
    clock.current = timing(progress, {
      toValue: 1,
      duration: cardMs * (1 - at.current),
      easing: Easing.linear,
      useNativeDriver: false,
    })
    clock.current.start(({ finished }) => {
      if (!finished) return
      clock.current = null
      // The last card stays: the person leaves it by a button, not by the clock.
      setIndex((i) => {
        if (i === count - 1) setEnded(true)
        return Math.min(i + 1, count - 1)
      })
    })
  }, [stop, timing, progress, cardMs, count])

  const set = useCallback(
    (value: number) => {
      stop()
      at.current = value
      progress.setValue(value)
    },
    [stop, progress],
  )

  // A card starts from nothing when it comes up, and when the clock comes on under it.
  const shown = useRef({ index: -1, selfTurning: false })
  useEffect(() => {
    if (!selfTurning) set(1)
    else if (shown.current.index !== index || !shown.current.selfTurning) set(0)
    shown.current = { index, selfTurning }
    if (running) run()
    return stop
  }, [index, selfTurning, running, run, set, stop])

  const go = (to: number) => {
    setEnded(false)
    setIndex(to)
  }
  return {
    index,
    progress,
    selfTurning,
    pausable: selfTurning && !ended,
    paused,
    togglePause: () => setPaused((p) => !p),
    hold: stop,
    release: () => {
      if (running) run()
    },
    canBack: index > 0 || selfTurning,
    back: () => {
      if (index > 0) return go(index - 1)
      if (!selfTurning) return
      set(0)
      if (running) run()
    },
    next: () => (index < count - 1 ? go(index + 1) : o.onEnd?.()),
  }
}
