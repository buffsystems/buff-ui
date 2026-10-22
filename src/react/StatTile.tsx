/** @jsxRuntime automatic */
import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from './cx.ts'

/** A row of figures about one thing. `columns` is the desktop count; a phone shows two. */
export function StatGrid({
  columns = 4,
  label,
  children,
  className,
}: {
  /** Desktop columns; any count (a row of 5 or 7 figures) — a phone shows two. */
  columns?: number
  /** Accessible name — the grid is a list of facts. */
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="list"
      aria-label={label}
      className={cx(
        'ui-stat-grid',
        columns >= 2 && columns <= 4 ? `ui-stat-grid--${columns}` : 'ui-stat-grid--n',
        className,
      )}
      style={
        columns < 2 || columns > 4 ? ({ '--ui-stat-cols': columns } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  )
}

/** One figure with the line that explains it. Becomes a button when it opens a detail. */
export function StatTile({
  icon: Icon,
  label,
  value,
  unit,
  tone,
  note,
  action,
  onClick,
  className,
}: {
  icon?: LucideIcon
  label: ReactNode
  value: ReactNode
  unit?: ReactNode
  tone?: 'ok' | 'warn' | 'crit'
  note?: ReactNode
  /** A link-styled follow-up under the note. */
  action?: ReactNode
  onClick?: () => void
  className?: string
}) {
  const body = (
    <>
      <div className="ui-stat__label">
        {Icon && <Icon aria-hidden />}
        <span className="ui-stat__label-text">{label}</span>
      </div>
      <div className={cx('ui-stat__value', tone && `ui-stat__value--${tone}`)}>
        {value}
        {unit && <span className="ui-stat__unit">{unit}</span>}
      </div>
      {note && <div className="ui-stat__note">{note}</div>}
      {action && <div className="ui-stat__action">{action}</div>}
    </>
  )
  // The list item stays a plain element; a clickable tile nests a real button inside it.
  return (
    <div role="listitem" className={cx('ui-stat', className)}>
      {onClick ? (
        <button type="button" onClick={onClick} className="ui-stat__button">
          {body}
        </button>
      ) : (
        <div className="ui-stat__body">{body}</div>
      )}
    </div>
  )
}
