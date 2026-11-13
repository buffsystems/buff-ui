import { useRef, useState, type ComponentRef } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

/** How close to the bottom still counts as «at the latest». */
const SLACK = 24
/** How many growths a returning scroller is given to reach the reader's place (#896). */
const RETURN_TRIES = 30

/**
 * A live chat's scroller (#703): it opens at the latest message and keeps up with what arrives
 * while the reader is at the bottom; a reader who scrolled up stays put until they come back
 * (or press «to the latest») — also across the scroller leaving the screen and returning (#896).
 */
export function useFollowEnd(start: 'end' | 'top' = 'end') {
  const ref = useRef<ComponentRef<typeof ScrollView>>(null)
  const following = useRef(start === 'end')
  const [atEnd, setAtEnd] = useState(start === 'end')
  // #896: the scroller may leave the screen and come back as a new one (the timeline gives way to
  // a file's view). `placed` is the scroller the reader's place was last set on; `offset` — where
  // the reader was, `viewport` — how tall the scroller is. A new scroller starts short and at its
  // top and grows as its rows are drawn: until it is tall enough to hold the reader's place
  // (`returning`), its own events are not the reader — a short list always reads as «at the end».
  const placed = useRef<unknown>(null)
  const offset = useRef(0)
  const viewport = useRef(0)
  const returning = useRef(0)
  // Not animated: an animation's own scroll events would read as the reader leaving the bottom.
  const onContentSizeChange = (_width?: number, height?: number) => {
    if (
      placed.current !== null &&
      placed.current !== ref.current &&
      !following.current &&
      offset.current > 0
    )
      returning.current = RETURN_TRIES
    placed.current = ref.current
    if (following.current) return void ref.current?.scrollToEnd({ animated: false })
    if (!returning.current) return
    ref.current?.scrollTo({ y: offset.current, animated: false })
    // Tall enough for the place (or the height is not told) — the reader is back; a list that never
    // grows that tall stops waiting after a few tries.
    const tall = height === undefined || height >= offset.current + viewport.current
    returning.current = tall ? 0 : returning.current - 1
  }
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if ((placed.current !== null && placed.current !== ref.current) || returning.current) return
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    const end = contentOffset.y + layoutMeasurement.height >= contentSize.height - SLACK
    following.current = end
    offset.current = contentOffset.y
    viewport.current = layoutMeasurement.height
    setAtEnd(end)
  }
  const toEnd = () => {
    following.current = true
    ref.current?.scrollToEnd({ animated: true })
  }
  return { ref, atEnd, onScroll, onContentSizeChange, toEnd }
}
