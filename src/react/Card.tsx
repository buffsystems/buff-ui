/** @jsxRuntime automatic */
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx.ts'

type DivProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: DivProps) {
  return <div className={cx('ui-card', className)} {...props} />
}

export interface CardHeaderProps extends DivProps {
  /**
   * Controls for the whole card (a button or a few, a menu). They sit on the right of the title
   * and description and wrap under them when the card is too narrow for both.
   */
  action?: ReactNode
}

export function CardHeader({ action, className, children, ...props }: CardHeaderProps) {
  if (action === undefined || action === null || action === false) {
    return (
      <div className={cx('ui-card__header', className)} {...props}>
        {children}
      </div>
    )
  }
  return (
    <div className={cx('ui-card__header ui-card__header--action', className)} {...props}>
      <div className="ui-card__heading">{children}</div>
      <div className="ui-card__action">{action}</div>
    </div>
  )
}

export function CardTitle({ className, ...props }: DivProps) {
  return <div className={cx('ui-card__title', className)} {...props} />
}

export function CardDescription({ className, ...props }: DivProps) {
  return <div className={cx('ui-card__description', className)} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cx('ui-card__content', className)} {...props} />
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cx('ui-card__footer', className)} {...props} />
}
