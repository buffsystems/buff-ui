/** @jsxRuntime automatic */
import type { ButtonHTMLAttributes, Ref } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'
import { cx } from './cx.ts'
import { Spinner } from './Spinner.tsx'

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
/** `inline`: a `link` inside running text — no height or padding, the text's own size. */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'inline'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ONE primary per screen, outline for the rest, ghost for low-weight actions. */
  variant?: ButtonVariant
  /** `inline` pairs with `link`: an action set in a sentence, sized and aligned by the text. */
  size?: ButtonSize
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon
  /** Busy: a spinner replaces the leading icon and the button is disabled. */
  loading?: boolean
  /** Full width of its container. */
  block?: boolean
  /** Render the single child (a link) with the button's look instead of a <button>. */
  asChild?: boolean
  /** The <button> (or the `asChild` element) — focus it, measure it, anchor a popover to it. */
  ref?: Ref<HTMLButtonElement>
}

/** The button look for another element (a router link): `<a className={buttonClass()}>`. */
export function buttonClass({
  variant = 'outline',
  size = 'md',
  block = false,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean } = {}): string {
  return cx('ui-btn', `ui-btn--${variant}`, `ui-btn--${size}`, block && 'ui-btn--block')
}

export function Button({
  variant = 'outline',
  size = 'md',
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  loading = false,
  block = false,
  asChild = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cx(buttonClass({ variant, size, block }), className)
  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    )
  }
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? <Spinner /> : LeadingIcon && <LeadingIcon aria-hidden />}
      {children}
      {TrailingIcon && !loading && <TrailingIcon aria-hidden />}
    </button>
  )
}
