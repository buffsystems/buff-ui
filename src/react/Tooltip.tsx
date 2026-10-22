/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cx } from './cx.ts'

/**
 * A short hint on hover or focus. The trigger is the single child (a button, an icon); a
 * tooltip never carries information found nowhere else. `popover` is the quiet bordered look
 * for a longer note beside a dense list. Opens at once, with no app-level provider needed.
 * `open`/`onOpenChange` control it (a «Copied» confirmation held open after a click).
 */
export function Tooltip({
  content,
  side = 'top',
  variant = 'primary',
  open,
  onOpenChange,
  className,
  children,
}: {
  content: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  variant?: 'primary' | 'popover'
  className?: string
  children: ReactNode
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={4}
            className={cx('ui-tooltip', variant === 'popover' && 'ui-tooltip--popover', className)}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
