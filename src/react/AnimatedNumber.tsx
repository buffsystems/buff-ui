/** @jsxRuntime automatic */
import { useEffect, useRef, useState } from 'react'
import { cx } from './cx.ts'

/** Where a tween from `from` to `to` stands at progress `t` (0–1), easing out. */
export function tweenAt(from: number, to: number, t: number): number {
  const p = Math.min(1, Math.max(0, t))
  return from + (to - from) * (1 - (1 - p) ** 3)
}

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * A figure that counts to its new value instead of jumping: tokens spent, tool calls, files
 * changed. With reduced motion it changes at once. Assistive tech reads only the final value.
 */
export function AnimatedNumber({
  value,
  duration = 600,
  format = (n) => String(Math.round(n)),
  className,
}: {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}) {
  const [shown, setShown] = useState(value)
  const shownRef = useRef(value)

  useEffect(() => {
    const from = shownRef.current
    const show = (n: number) => {
      shownRef.current = n
      setShown(n)
    }
    if (from === value || duration <= 0 || prefersReducedMotion()) {
      show(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const step = () => {
      const t = (performance.now() - start) / duration
      show(tweenAt(from, value, t))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return (
    <span className={cx('ui-animated-number', className)}>
      <span aria-hidden>{format(shown)}</span>
      <span className="ui-animated-number__label">{format(value)}</span>
    </span>
  )
}
