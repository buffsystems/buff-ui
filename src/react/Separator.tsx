/** @jsxRuntime automatic */
import { cx } from './cx.ts'

/** A hairline between groups. Decorative by default; `decorative={false}` exposes it. */
export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
}: {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  className?: string
}) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      className={cx('ui-separator', className)}
    />
  )
}
