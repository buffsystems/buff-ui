/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { cx } from './cx.ts'

/**
 * The top of a screen: an eyebrow naming the context, an id, the title, one line of facts and
 * a status row under it, the screen's actions on the right (under the title on a phone).
 */
export function PageHeader({
  eyebrow,
  id,
  title,
  subtitle,
  status,
  actions,
  className,
}: {
  eyebrow?: ReactNode
  id?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  status?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('ui-page-header', className)}>
      <div className="ui-page-header__main">
        {eyebrow && <p className="ui-eyebrow">{eyebrow}</p>}
        {id && <p className="ui-page-header__id">{id}</p>}
        <h1 className="ui-page-header__title">{title}</h1>
        {subtitle && <p className="ui-page-header__subtitle">{subtitle}</p>}
        {status && <div className="ui-page-header__status">{status}</div>}
      </div>
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </div>
  )
}

/** A section title inside a screen: an h2, a muted fact beside it, an action at the edge. */
export function SectionHeader({
  title,
  note,
  action,
  className,
}: {
  title: ReactNode
  note?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('ui-section-header', className)}>
      <h2 className="ui-section-header__title">{title}</h2>
      {note && <span className="ui-section-header__note">{note}</span>}
      {action && <span className="ui-section-header__action">{action}</span>}
    </div>
  )
}
