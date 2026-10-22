/** @jsxRuntime automatic */
import { cx } from './cx.ts'

export interface ProgressCircleProps {
  /** Percent done, 0–100 (clamped). */
  value: number
  /** Outer size in px. */
  size?: number
  strokeWidth?: number
  /** Colours the arc: context nearly full (warn), over the limit (crit), done (ok). */
  tone?: 'ok' | 'warn' | 'crit'
  /** Names the progress bar. Without it the ring is decorative — show the figure beside it. */
  label?: string
  className?: string
}

/** A determinate ring: an upload, the share of the context window used. */
export function ProgressCircle({
  value,
  size = 16,
  strokeWidth = 2,
  tone,
  label,
  className,
}: ProgressCircleProps) {
  const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const centre = size / 2
  const a11y = label
    ? {
        role: 'progressbar',
        'aria-label': label,
        'aria-valuenow': Math.round(percent),
        'aria-valuemin': 0,
        'aria-valuemax': 100,
      }
    : { 'aria-hidden': true }
  return (
    <svg
      {...a11y}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={cx('ui-progress-ring', tone && `ui-progress-ring--${tone}`, className)}
    >
      <circle
        className="ui-progress-ring__track"
        cx={centre}
        cy={centre}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className="ui-progress-ring__value"
        cx={centre}
        cy={centre}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
      />
    </svg>
  )
}
