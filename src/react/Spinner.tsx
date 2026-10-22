/** @jsxRuntime automatic */
import { LoaderCircle } from 'lucide-react'
import { cx } from './cx.ts'

/** Indeterminate loading indicator. Sized by its context (a button) or by `size`. */
export function Spinner({
  size,
  label = 'Loading',
  className,
}: {
  size?: number
  label?: string
  className?: string
}) {
  return (
    <LoaderCircle
      role="status"
      aria-label={label}
      size={size}
      className={cx('ui-spinner', className)}
    />
  )
}
