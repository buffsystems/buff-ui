/** @jsxRuntime automatic */
import type { ComponentProps, ReactNode } from 'react'
import * as ScrollPrimitive from '@radix-ui/react-scroll-area'
import { cx } from './cx.ts'

function Bar({ orientation }: { orientation: 'vertical' | 'horizontal' }) {
  return (
    <ScrollPrimitive.Scrollbar orientation={orientation} className="ui-scroll-area__bar">
      <ScrollPrimitive.Thumb className="ui-scroll-area__thumb" />
    </ScrollPrimitive.Scrollbar>
  )
}

/**
 * A pane that scrolls under thin overlay bars, the same on every OS. Scrolling stays native
 * (wheel, touch, keys once focused). Give the root a height or a max-height; reach the
 * scrolling element through `viewportProps` (ref, onScroll, tabIndex).
 */
export function ScrollArea({
  orientation = 'vertical',
  type = 'hover',
  viewportProps,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof ScrollPrimitive.Root>, 'children'> & {
  /** Which bars it draws; `both` adds the corner where they meet. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  viewportProps?: ComponentProps<typeof ScrollPrimitive.Viewport>
  children?: ReactNode
}) {
  return (
    <ScrollPrimitive.Root type={type} className={cx('ui-scroll-area', className)} {...props}>
      <ScrollPrimitive.Viewport
        {...viewportProps}
        className={cx('ui-scroll-area__viewport', viewportProps?.className)}
      >
        {children}
      </ScrollPrimitive.Viewport>
      {orientation !== 'horizontal' && <Bar orientation="vertical" />}
      {orientation !== 'vertical' && <Bar orientation="horizontal" />}
      {orientation === 'both' && <ScrollPrimitive.Corner className="ui-scroll-area__corner" />}
    </ScrollPrimitive.Root>
  )
}
