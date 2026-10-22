/** @jsxRuntime automatic */
import type { ComponentProps } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cx } from './cx.ts'

/**
 * A small panel beside a control that holds more than a hint: a model's details, a filter, a
 * usage breakdown — buttons and fields allowed. Escape and an outside click close it and focus
 * returns to the trigger. Compose: Popover > PopoverTrigger + PopoverContent (PopoverTitle,
 * PopoverDescription, any content, PopoverClose). PopoverAnchor places it against another node.
 */
export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor
export const PopoverClose = PopoverPrimitive.Close

export interface PopoverContentProps extends ComponentProps<typeof PopoverPrimitive.Content> {
  /** A small arrow pointing at the trigger. */
  arrow?: boolean
}

export function PopoverContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  collisionPadding = 8,
  arrow = false,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cx('ui-popover', className)}
        {...props}
      >
        {children}
        {arrow && (
          // Our own shape: two strokes in the border colour over the surface fill, nudged 1px
          // into the panel so its edge does not cut the arrow off.
          <PopoverPrimitive.Arrow asChild width={12} height={6}>
            <svg viewBox="0 0 12 6" className="ui-popover__arrow" aria-hidden>
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </PopoverPrimitive.Arrow>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export function PopoverTitle({
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Title>) {
  return <PopoverPrimitive.Title className={cx('ui-popover__title', className)} {...props} />
}

export function PopoverDescription({
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Description>) {
  return (
    <PopoverPrimitive.Description className={cx('ui-popover__description', className)} {...props} />
  )
}
