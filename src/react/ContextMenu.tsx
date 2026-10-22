/** @jsxRuntime automatic */
import type { ComponentProps, ReactNode } from 'react'
import * as MenuPrimitive from '@radix-ui/react-context-menu'
import { Check, ChevronRight } from 'lucide-react'
import { cx } from './cx.ts'

/**
 * A menu at the pointer: a right click on the trigger, the ContextMenu key or Shift+F10 while
 * it has focus, a long press on touch. The trigger wraps the target (a tab, a file row, a
 * message) — give it `asChild` and make the target focusable so the keyboard can reach it.
 * Items share the dropdown's look (`ui-menu`).
 */
export const ContextMenu = MenuPrimitive.Root
export const ContextMenuTrigger = MenuPrimitive.Trigger
export const ContextMenuGroup = MenuPrimitive.Group
export const ContextMenuSub = MenuPrimitive.Sub
export const ContextMenuRadioGroup = MenuPrimitive.RadioGroup

export function ContextMenuContent({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content className={cx('ui-menu', className)} {...props} />
    </MenuPrimitive.Portal>
  )
}

function Shortcut({ children }: { children?: ReactNode }) {
  return children ? <span className="ui-menu__shortcut">{children}</span> : null
}

export function ContextMenuItem({
  className,
  destructive = false,
  shortcut,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & { destructive?: boolean; shortcut?: ReactNode }) {
  return (
    <MenuPrimitive.Item
      className={cx('ui-menu__item', destructive && 'ui-menu__item--destructive', className)}
      {...props}
    >
      {children}
      <Shortcut>{shortcut}</Shortcut>
    </MenuPrimitive.Item>
  )
}

export function ContextMenuCheckboxItem({
  className,
  shortcut,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem> & { shortcut?: ReactNode }) {
  return (
    <MenuPrimitive.CheckboxItem
      className={cx('ui-menu__item ui-menu__item--choice', className)}
      {...props}
    >
      <span className="ui-menu__indicator">
        <MenuPrimitive.ItemIndicator>
          <Check aria-hidden />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
      <Shortcut>{shortcut}</Shortcut>
    </MenuPrimitive.CheckboxItem>
  )
}

export function ContextMenuRadioItem({
  className,
  shortcut,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem> & { shortcut?: ReactNode }) {
  return (
    <MenuPrimitive.RadioItem
      className={cx('ui-menu__item ui-menu__item--choice', className)}
      {...props}
    >
      <span className="ui-menu__indicator">
        <MenuPrimitive.ItemIndicator>
          <span aria-hidden className="ui-menu__dot" />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
      <Shortcut>{shortcut}</Shortcut>
    </MenuPrimitive.RadioItem>
  )
}

export function ContextMenuSubTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return (
    <MenuPrimitive.SubTrigger className={cx('ui-menu__item ui-menu__sub', className)} {...props}>
      {children}
      <ChevronRight aria-hidden className="ui-menu__chevron" />
    </MenuPrimitive.SubTrigger>
  )
}

export function ContextMenuSubContent({
  className,
  sideOffset = 2,
  ...props
}: ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent
        sideOffset={sideOffset}
        className={cx('ui-menu', className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

export function ContextMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cx('ui-menu__label', className)} {...props} />
}

export function ContextMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cx('ui-menu__separator', className)} {...props} />
}
