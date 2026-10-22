/** @jsxRuntime automatic */
import type { ComponentProps } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cx } from './cx.ts'

/** An on/off toggle that applies at once. Name it with aria-label or a <Label htmlFor>. */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root className={cx('ui-switch', className)} {...props}>
      <SwitchPrimitive.Thumb className="ui-switch__thumb" />
    </SwitchPrimitive.Root>
  )
}
