/** @jsxRuntime automatic */
import type { ComponentProps, ReactNode } from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight } from 'lucide-react'
import { cx } from './cx.ts'

export const DropdownMenu = MenuPrimitive.Root
export const DropdownMenuTrigger = MenuPrimitive.Trigger
export const DropdownMenuGroup = MenuPrimitive.Group
export const DropdownMenuSub = MenuPrimitive.Sub
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

export interface DropdownMenuContentProps extends ComponentProps<typeof MenuPrimitive.Content> {
  /**
   * The menu is about to take focus on open; preventDefault keeps it where it was (a menu that
   * opens under a text field). Radix handles it but leaves it out of the content's type.
   */
  onOpenAutoFocus?: (event: Event) => void
}

/** The menu's surface. Every Radix content prop passes through (onCloseAutoFocus, align…). */
export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        className={cx('ui-menu', className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

/** A key hint at the end of an item row («⌘K»); it only shows the key, the app binds it. */
function Shortcut({ children }: { children?: ReactNode }) {
  return children ? <span className="ui-menu__shortcut">{children}</span> : null
}

export function DropdownMenuItem({
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

/** An on/off option: the check sits in a leading slot, kept empty while off. */
export function DropdownMenuCheckboxItem({
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

/** One choice of a DropdownMenuRadioGroup: a dot marks the current one. */
export function DropdownMenuRadioItem({
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

/** The row that opens a submenu (hover, → or Enter); a chevron points at it. */
export function DropdownMenuSubTrigger({
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

export function DropdownMenuSubContent({
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

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cx('ui-menu__label', className)} {...props} />
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cx('ui-menu__separator', className)} {...props} />
}
