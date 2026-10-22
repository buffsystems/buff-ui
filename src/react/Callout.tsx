/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from 'lucide-react'
import { cx } from './cx.ts'

export type CalloutTone = 'neutral' | 'info' | 'ok' | 'warn' | 'crit'

const ICON: Record<CalloutTone, LucideIcon> = {
  neutral: Info,
  info: Info,
  ok: CheckCircle2,
  warn: AlertTriangle,
  crit: AlertTriangle,
}

/** A tinted band with an icon, a sentence and at most one action. */
export function Callout({
  tone = 'neutral',
  icon,
  title,
  children,
  action,
  role,
  banner = false,
  compact = false,
  className,
}: {
  tone?: CalloutTone
  /** Another icon, or `null` for none. */
  icon?: LucideIcon | null
  title?: ReactNode
  children?: ReactNode
  action?: ReactNode
  role?: 'status' | 'alert'
  /** A full-width notice band at the top of a page (square corners). */
  banner?: boolean
  /** A quiet one-line status beside content: small type, tight padding. */
  compact?: boolean
  className?: string
}) {
  const Icon = icon === null ? null : (icon ?? ICON[tone])
  return (
    <div
      role={role}
      className={cx(
        'ui-callout',
        `ui-callout--${tone}`,
        banner && 'ui-callout--banner',
        compact && 'ui-callout--compact',
        className,
      )}
    >
      {Icon && <Icon aria-hidden className="ui-callout__icon" />}
      <div className="ui-callout__text">
        {title && <b className="ui-callout__title">{title}</b>}
        {title && children ? ' — ' : null}
        {children}
      </div>
      {action && <div className="ui-callout__action">{action}</div>}
    </div>
  )
}
