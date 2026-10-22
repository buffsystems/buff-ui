/** @jsxRuntime automatic */
import type { HTMLAttributes } from 'react'
import { cx } from './cx.ts'

/**
 * Text with a light sweeping across it while work goes on: «Думаю…», «Запускаю команду».
 * `active={false}` stops it in place (the same text, the same colour) so a finished line does
 * not jump. With reduced motion it stays still. It is ordinary text to assistive tech.
 */
export function TextShimmer({
  active = true,
  as: Tag = 'span',
  className,
  ...props
}: HTMLAttributes<HTMLElement> & { active?: boolean; as?: 'span' | 'p' | 'div' }) {
  return (
    <Tag data-active={active || undefined} className={cx('ui-shimmer', className)} {...props} />
  )
}
