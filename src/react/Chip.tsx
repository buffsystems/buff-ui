/** @jsxRuntime automatic */
import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
import { cx } from './cx.ts'

export interface ChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'aria-pressed' | 'type'
> {
  /** A filter's state. Left out, the chip is a plain action button: no `aria-pressed`. */
  pressed?: boolean
  count?: number
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  /** `sm`: a 24px chip for dense filter rows. */
  size?: 'sm' | 'md'
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}

/**
 * A filter chip: a pressed one inverts so the active filter is unmistakable. Without `pressed`
 * it is a plain action in the chip's look (a suggestion, an update) that never reads as a toggle.
 * Any other button attribute (`data-*`, `title`, `id`, handlers) reaches the <button>.
 */
export function Chip({ pressed, count, size = 'md', children, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx('ui-chip', size === 'sm' && 'ui-chip--sm', className)}
      {...props}
    >
      {children}
      {count !== undefined && <span className="ui-chip__count">{count}</span>}
    </button>
  )
}

/** A row of chips — one `role=group`, so a screen reader names the filter once. */
export function ChipRow({
  label,
  children,
  className,
}: {
  /** Accessible name; leave out inside a Field group, which already names it. */
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cx('ui-chip-row', className)}>
      {children}
    </div>
  )
}

export interface SegmentedOption<T extends string> {
  id: T
  label: ReactNode
  count?: number
  disabled?: boolean
}

/** A segmented control: equal cells that read as one object. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
}: {
  /** `null`: nothing chosen yet. */
  value: T | null
  options: SegmentedOption<T>[]
  onChange: (id: T) => void
  /** Accessible name; leave out inside a Field group, which already names it. */
  label?: string
  disabled?: boolean
  /** `sm`: every option on one 28px row, sized by its text. */
  size?: 'sm' | 'md'
  className?: string
}) {
  const columns = Math.min(Math.max(options.length, 2), 4)
  return (
    <div
      role="group"
      aria-label={label}
      className={cx(
        'ui-segmented',
        size === 'sm' ? 'ui-segmented--sm' : `ui-segmented--${columns}`,
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === value}
          disabled={disabled || o.disabled}
          onClick={() => onChange(o.id)}
          className="ui-segmented__item"
        >
          {o.label}
          {o.count !== undefined && <span className="ui-segmented__count">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}
