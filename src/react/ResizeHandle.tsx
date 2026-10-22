/** @jsxRuntime automatic */
import { useRef } from 'react'
import type { HTMLAttributes, KeyboardEvent, PointerEvent } from 'react'
import { cx } from './cx.ts'

export interface ResizeHandleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onResize'> {
  /** The axis the pane grows along: `horizontal` resizes a width, `vertical` a height. */
  direction: 'horizontal' | 'vertical'
  /** Which edge of the pane the handle sits on. Default: `end` (a left sidebar's right edge). */
  edge?: 'start' | 'end'
  /** The pane's current size in px — the handle is controlled. */
  size: number
  min: number
  max: number
  onResize: (size: number) => void
  /** The drag or the key press is over: the moment to persist the size. */
  onResizeEnd?: (size: number) => void
  /** px per arrow key press; Shift moves four times as far. */
  step?: number
  /** Released while dragged below this size, the pane collapses (onCollapse); so does Enter. */
  collapseBelow?: number
  onCollapse?: () => void
  'aria-label': string
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/**
 * How far the pane grows for a pointer travel of `delta` px along the axis: a handle on the
 * pane's end edge grows it as it moves forward, one on the start edge as it moves back. In a
 * right-to-left layout "forward" on the horizontal axis is to the left.
 */
export function growth(delta: number, edge: 'start' | 'end', rtl = false): number {
  return (edge === 'end') !== rtl ? delta : -delta
}

/**
 * A draggable divider between two panes (the WAI-ARIA window splitter): a focusable separator
 * that carries the pane's size as its value. Drag it, or focus it and use the arrow keys, Home
 * (min) and End (max). Position it on the pane's edge yourself.
 */
export function ResizeHandle({
  direction,
  edge = 'end',
  size,
  min,
  max,
  onResize,
  onResizeEnd,
  step = 16,
  collapseBelow,
  onCollapse,
  className,
  onPointerDown,
  onKeyDown,
  ...props
}: ResizeHandleProps) {
  const drag = useRef<{ from: number; size: number; rtl: boolean; raw: number } | null>(null)
  const horizontal = direction === 'horizontal'
  const along = (e: PointerEvent) => (horizontal ? e.clientX : e.clientY)

  const start = (e: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e)
    if (e.button !== 0 || e.defaultPrevented) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const rtl = horizontal && getComputedStyle(e.currentTarget).direction === 'rtl'
    drag.current = { from: along(e), size, rtl, raw: size }
    e.currentTarget.dataset.dragging = ''
    document.body.style.userSelect = 'none'
    document.body.style.cursor = horizontal ? 'col-resize' : 'row-resize'
  }

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    d.raw = d.size + growth(along(e) - d.from, edge, d.rtl)
    onResize(clamp(d.raw, min, max))
  }

  const end = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    drag.current = null
    delete e.currentTarget.dataset.dragging
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    if (onCollapse && collapseBelow !== undefined && d.raw < collapseBelow) onCollapse()
    else onResizeEnd?.(clamp(d.raw, min, max))
  }

  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const rtl = horizontal && getComputedStyle(e.currentTarget).direction === 'rtl'
    const amount = e.shiftKey ? step * 4 : step
    const forward = horizontal ? 'ArrowRight' : 'ArrowDown'
    const back = horizontal ? 'ArrowLeft' : 'ArrowUp'
    let next: number | undefined
    if (e.key === forward) next = size + growth(amount, edge, rtl)
    else if (e.key === back) next = size - growth(amount, edge, rtl)
    else if (e.key === 'Home') next = min
    else if (e.key === 'End') next = max
    else if (e.key === 'Enter' && onCollapse) {
      e.preventDefault()
      onCollapse()
      return
    }
    if (next === undefined) return
    e.preventDefault()
    const clamped = clamp(next, min, max)
    onResize(clamped)
    onResizeEnd?.(clamped)
  }

  return (
    <div
      {...props}
      role="separator"
      tabIndex={0}
      aria-orientation={horizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(size)}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cx('ui-resize-handle', className)}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={key}
    />
  )
}
