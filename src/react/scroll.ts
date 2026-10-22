/** A horizontal scroller's extent, as an element reports it. */
export interface ScrollBox {
  scrollLeft: number
  clientWidth: number
  scrollWidth: number
}

/** Which edges of a horizontal scroller still hide content (1px slack for fractions). */
export function hiddenSides({ scrollLeft, clientWidth, scrollWidth }: ScrollBox): {
  start: boolean
  end: boolean
} {
  return { start: scrollLeft > 1, end: scrollWidth - clientWidth - scrollLeft > 1 }
}

/**
 * The scrollLeft that brings an item (`left` measured in the scroller's content) fully into
 * view, `clear` px away from either edge — or the current one when it is already there.
 */
export function revealScrollLeft(
  box: ScrollBox,
  item: { left: number; width: number },
  clear: number,
): number {
  const max = Math.max(0, box.scrollWidth - box.clientWidth)
  const clamp = (x: number) => Math.min(max, Math.max(0, x))
  if (item.left - clear < box.scrollLeft) return clamp(item.left - clear)
  const right = item.left + item.width + clear
  if (right > box.scrollLeft + box.clientWidth) return clamp(right - box.clientWidth)
  return box.scrollLeft
}
