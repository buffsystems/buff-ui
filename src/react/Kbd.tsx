/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { cx } from './cx.ts'

/** A single keyboard key cap. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cx('ui-kbd', className)}>{children}</kbd>
}
