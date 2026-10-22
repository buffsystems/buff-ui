/** @jsxRuntime automatic */
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from './cx.ts'

/**
 * The bordered card surface a screen groups content in — no inner layout of its own. `info`
 * tints it for a panel that asks for action; `inset` is a box inside a panel.
 */
export function Panel({
  tone,
  inset = false,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: 'info'; inset?: boolean }) {
  return (
    <div
      className={cx('ui-panel', tone && `ui-panel--${tone}`, inset && 'ui-panel--inset', className)}
      {...props}
    />
  )
}

/** An icon on a tinted square: the mark of an empty state, a way to start, a check. */
export function IconTile({
  icon: Icon,
  tone,
  size = 'md',
  className,
}: {
  icon: LucideIcon
  tone?: 'info' | 'ok' | 'warn' | 'crit'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cx(
        'ui-icon-tile',
        tone && `ui-icon-tile--${tone}`,
        size !== 'md' && `ui-icon-tile--${size}`,
        className,
      )}
    >
      <Icon />
    </span>
  )
}

/** «Nothing here yet»: a dashed box. `inline` is the compact left-aligned note in a list. */
export function EmptyState({
  inline = false,
  className,
  children,
}: {
  inline?: boolean
  className?: string
  children: ReactNode
}) {
  return <div className={cx('ui-empty', inline && 'ui-empty--inline', className)}>{children}</div>
}

/**
 * A native checkbox in the brand colour. With `label` (and an optional `hint`) it is the whole
 * clickable row; without one, name it with aria-label or a wrapping <Label>.
 */
export function Checkbox({
  label,
  hint,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: ReactNode; hint?: ReactNode }) {
  const bare = !label && !hint
  const box = <input type="checkbox" className={cx('ui-checkbox', bare && className)} {...props} />
  if (bare) return box
  return (
    <label className={cx('ui-check', props.disabled && 'ui-check--disabled', className)}>
      {box}
      <span className="ui-check__text">
        {label && <span>{label}</span>}
        {hint && <span className="ui-field__hint">{hint}</span>}
      </span>
    </label>
  )
}

/** The round count on a tab, a bell or a nav item. `primary` / `warn` fill it. */
export function Count({
  tone = 'muted',
  className,
  children,
}: {
  tone?: 'muted' | 'primary' | 'warn'
  className?: string
  children: ReactNode
}) {
  return (
    <span className={cx('ui-count', tone !== 'muted' && `ui-count--${tone}`, className)}>
      {children}
    </span>
  )
}
