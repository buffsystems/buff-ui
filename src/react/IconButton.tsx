/** @jsxRuntime automatic */
import { isValidElement } from 'react'
import type { ButtonHTMLAttributes, ReactElement, Ref } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from './cx.ts'
import type { ButtonSize } from './Button.tsx'

export type IconButtonSize = 'xs' | Exclude<ButtonSize, 'inline'>

export type IconButtonVariant = 'ghost' | 'outline' | 'primary' | 'danger'

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label'
> {
  /** A lucide icon, or a ready element (a progress ring, a provider glyph) of the same size. */
  icon: LucideIcon | ReactElement
  /** Required: an icon alone names nothing. */
  'aria-label': string
  variant?: IconButtonVariant
  /** `xs` is the quiet 28px square of a toolbar or a footer. */
  size?: IconButtonSize
  ref?: Ref<HTMLButtonElement>
}

/** A square button holding one icon. `danger` is a ghost tinted for removing things. */
export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const look = variant === 'danger' ? 'ui-btn--ghost ui-btn--danger' : `ui-btn--${variant}`
  return (
    <button className={cx('ui-btn ui-btn--icon', look, `ui-btn--${size}`, className)} {...props}>
      {isValidElement(Icon) ? Icon : <Icon aria-hidden />}
    </button>
  )
}
