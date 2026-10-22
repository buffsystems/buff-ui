/** @jsxRuntime automatic */
import type { HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cx } from './cx.ts'

/** The #270 status vocabulary — soft tinted pairs — plus a solid primary and an outline. */
export type BadgeTone = 'neutral' | 'info' | 'ok' | 'warn' | 'crit' | 'primary' | 'outline'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  /** A leading marker, the way a task's state is shown. */
  dot?: boolean
  /** `sm`: a compact tag beside a title or inside a dense row. */
  size?: 'sm' | 'md'
  /** A removable tag: shows a × that calls this. */
  onRemove?: () => void
  /** Name of the × for a screen reader («Убрать main»). */
  removeLabel?: string
  removeDisabled?: boolean
}

/** A status or metadata pill. The word carries the meaning; the tint only reinforces it. */
export function Badge({
  tone = 'neutral',
  dot = false,
  size = 'md',
  onRemove,
  removeLabel = 'Убрать',
  removeDisabled = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx('ui-badge', `ui-badge--${tone}`, size === 'sm' && 'ui-badge--sm', className)}
      {...props}
    >
      {dot && <i aria-hidden className="ui-badge__dot" />}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          title={removeLabel}
          disabled={removeDisabled}
          onClick={onRemove}
          className="ui-badge__remove"
        >
          <X aria-hidden size={12} />
        </button>
      )}
    </span>
  )
}
