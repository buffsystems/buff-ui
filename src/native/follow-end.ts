import { useRef, useState, type ComponentRef } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

/** How close to the bottom still counts as «at the latest». */
const SLACK = 24

/**
 * A live chat's scroller (#703): it opens at the latest message and keeps up with what arrives
 * while the reader is at the bottom; a reader who scrolled up stays put until they come back
 * (or press «to the latest»).
 */
export function useFollowEnd(start: 'end' | 'top' = 'end') {
  const ref = useRef<ComponentRef<typeof ScrollView>>(null)
  const following = useRef(start === 'end')
  const [atEnd, setAtEnd] = useState(start === 'end')
  // Not animated: an animation's own scroll events would read as the reader leaving the bottom.
  const onContentSizeChange = () => {
    if (following.current) ref.current?.scrollToEnd({ animated: false })
  }
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    const end = contentOffset.y + layoutMeasurement.height >= contentSize.height - SLACK
    following.current = end
    setAtEnd(end)
  }
  const toEnd = () => {
    following.current = true
    ref.current?.scrollToEnd({ animated: true })
  }
  return { ref, atEnd, onScroll, onContentSizeChange, toEnd }
}
