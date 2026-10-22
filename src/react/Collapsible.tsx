/** @jsxRuntime automatic */
import type { ComponentProps } from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { ChevronRight } from 'lucide-react'
import { cx } from './cx.ts'

/**
 * A section that folds open and shut: a tool call, a step, «more settings». `bordered` puts it
 * in a box of its own; without it the trigger is a quiet row in the flow.
 */
export function Collapsible({
  bordered = false,
  className,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Root> & { bordered?: boolean }) {
  return (
    <CollapsiblePrimitive.Root
      className={cx('ui-collapsible', bordered && 'ui-collapsible--bordered', className)}
      {...props}
    />
  )
}

/** The row that toggles it, with a chevron at its start. `asChild` renders your own element. */
export function CollapsibleTrigger({
  asChild = false,
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  return (
    <CollapsiblePrimitive.Trigger
      asChild={asChild}
      className={cx('ui-collapsible__trigger', className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <ChevronRight aria-hidden className="ui-collapsible__chevron" />
          {children}
        </>
      )}
    </CollapsiblePrimitive.Trigger>
  )
}

export function CollapsibleContent({
  className,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content className={cx('ui-collapsible__content', className)} {...props} />
  )
}
