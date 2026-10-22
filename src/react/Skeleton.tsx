/** @jsxRuntime automatic */
import type { CSSProperties, ReactNode } from 'react'
import { cx } from './cx.ts'

/** A placeholder in the shape of content still loading. Size it to what will land there, so
 *  nothing jumps when the data arrives. A block-level span, valid inside a paragraph too. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden className={cx('ui-skeleton', className)} style={style} />
}

/** The region skeletons stand in for: announced as busy, named by what is loading. */
export function SkeletonBlock({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div role="status" aria-busy aria-label={label} data-skeleton className={className}>
      {children}
    </div>
  )
}
