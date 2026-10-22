/** @jsxRuntime automatic */
import type { CSSProperties } from 'react'
import { cx } from './cx.ts'

export type StatusTone = 'neutral' | 'info' | 'ok' | 'warn' | 'crit'

const TONES: readonly string[] = ['neutral', 'info', 'ok', 'warn', 'crit']

/**
 * A coloured dot for a state; `pulse` adds the in-progress halo. Decorative: pair it with text.
 * A tone it does not know (a state straight from a server) draws the neutral dot, never breaks.
 */
export function StatusDot({
  tone,
  pulse = false,
  size,
  className,
}: {
  tone?: StatusTone | (string & {}) | null
  pulse?: boolean
  size?: number
  className?: string
}) {
  const known = tone && TONES.includes(tone) ? tone : 'neutral'
  const style = size ? ({ '--ui-dot-size': `${size}px` } as CSSProperties) : undefined
  return (
    <span
      aria-hidden
      style={style}
      className={cx('ui-dot', `ui-dot--${known}`, pulse && 'ui-dot--pulse', className)}
    />
  )
}
