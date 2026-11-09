import { useEffect, useRef } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

/**
 * A chat's history loads further back as the reader comes within about a screen of its top
 * (#766). Only after the reader's own drag: the screen opening and laying out is not a request.
 * `onTop` is absent while a page is on its way; when it comes back and the reader is still near
 * the top (a short page, no scroll event since), the next page is asked at once.
 */
export function useNearTop(onTop?: () => void) {
  const dragged = useRef(false)
  const near = useRef(false)
  const ask = useRef(onTop)
  ask.current = onTop
  const ready = onTop !== undefined
  useEffect(() => {
    if (ready && dragged.current && near.current) ask.current?.()
  }, [ready])
  const onScrollBeginDrag = () => {
    dragged.current = true
  }
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent
    near.current = contentOffset.y <= layoutMeasurement.height
    if (onTop && dragged.current && near.current) onTop()
  }
  return { onScroll, onScrollBeginDrag }
}
