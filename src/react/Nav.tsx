/** @jsxRuntime automatic */
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cx } from './cx.ts'

/** Side navigation. `onCard`: the menu sits on a card (a settings dialog), not on the rail. */
export function Nav({
  label,
  onCard = false,
  className,
  children,
}: {
  label?: string
  onCard?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <nav aria-label={label} className={cx('ui-nav', onCard && 'ui-nav--on-card', className)}>
      {children}
    </nav>
  )
}

/** A heading over a group of navigation items. */
export function NavGroup({ children }: { children: ReactNode }) {
  return <p className="ui-nav__group">{children}</p>
}

export interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon
  /** The section shown now: lifted off the rail, its icon in the brand colour. */
  current?: boolean
  /** Shown at the row's end — a count, a badge. */
  end?: ReactNode
  /** Render the single child (a router link) with the item's look. */
  asChild?: boolean
}

/** One row of the side navigation. */
export function NavItem({
  icon: Icon,
  current = false,
  end,
  asChild = false,
  className,
  children,
  ...props
}: NavItemProps) {
  const classes = cx('ui-nav-item', className)
  const ariaCurrent = current ? ('page' as const) : undefined
  if (asChild) {
    return (
      <Slot className={classes} aria-current={ariaCurrent} {...props}>
        {children}
      </Slot>
    )
  }
  return (
    <button type="button" className={classes} aria-current={ariaCurrent} {...props}>
      {Icon && <Icon aria-hidden />}
      <span className="ui-nav-item__label">{children}</span>
      {end}
    </button>
  )
}

/**
 * A free-standing choice: an icon tile, a title and a line under it. `trailing` sits at the end
 * (a badge, a status); `chevron` puts the "goes somewhere" arrow there when nothing else does.
 * `asChild` renders the single child — an `<a>` or a router link, given without content — as the
 * row: it navigates, and the icon, the text and the end are put inside it.
 */
export function ActionRow({
  icon,
  title,
  hint,
  trailing,
  chevron = false,
  asChild = false,
  className,
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> & {
  icon?: ReactNode
  title: ReactNode
  hint?: ReactNode
  /** At the row's end, after the text. */
  trailing?: ReactNode
  /** A chevron at the end when there is no `trailing`. Off by default. */
  chevron?: boolean
  /** Render the single child (a link) as the row. */
  asChild?: boolean
  /** With `asChild`: the element to render as the row. */
  children?: ReactElement
}) {
  const end = trailing ?? (chevron && <ChevronRight aria-hidden />)
  const content = (
    <>
      {icon}
      <span className="ui-action__text">
        <span className="ui-action__title">{title}</span>
        {hint && <span className="ui-action__hint">{hint}</span>}
      </span>
      {end && <span className="ui-action__trailing">{end}</span>}
    </>
  )
  if (asChild)
    return (
      <Slot className={cx('ui-action', className)} {...props}>
        <Slottable child={children}>{() => content}</Slottable>
      </Slot>
    )
  return (
    <button type="button" className={cx('ui-action', className)} {...props}>
      {content}
    </button>
  )
}
