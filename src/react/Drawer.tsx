/** @jsxRuntime automatic */
import type { HTMLAttributes, ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cx } from './cx.ts'
import { IconButton } from './IconButton.tsx'

export type DrawerSide = 'bottom' | 'left' | 'right'
export type DrawerSize = 'sm' | 'md' | 'lg'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  /** `bottom` is the phone's sheet; `left`/`right` slide in a full-height panel (an inspector). */
  side?: DrawerSide
  /** The width of a side panel (20, 24, 32rem); a bottom sheet takes the screen's width. */
  size?: DrawerSize
  /** Hide the × in the corner. */
  hideClose?: boolean
  /** Keep the title for screen readers only (a sheet whose content names itself). */
  hideTitle?: boolean
  /** Extra attributes (data-*, handlers) for the backdrop, the sheet and the bottom handle. */
  overlayProps?: HTMLAttributes<HTMLDivElement>
  contentProps?: HTMLAttributes<HTMLDivElement>
  handleProps?: HTMLAttributes<HTMLDivElement>
  closeLabel?: string
  className?: string
  children?: ReactNode
}

/**
 * A modal sheet at an edge of the screen: the phone's tab sheet, an inspector. Like Dialog it
 * traps focus, makes the page under it inert, and closes on Escape and the backdrop. Compose the
 * inside from DrawerBody (scrolls) and DrawerFooter.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  side = 'bottom',
  size = 'md',
  hideClose = false,
  hideTitle = false,
  overlayProps,
  contentProps,
  handleProps,
  closeLabel = 'Закрыть',
  className,
  children,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          {...overlayProps}
          className={cx('ui-drawer-overlay', overlayProps?.className)}
        />
        <DialogPrimitive.Content
          {...contentProps}
          className={cx(
            'ui-drawer',
            `ui-drawer--${side}`,
            side !== 'bottom' && `ui-drawer--${size}`,
            className,
            contentProps?.className,
          )}
          {...(description ? {} : { 'aria-describedby': undefined })}
        >
          {side === 'bottom' && (
            <div
              aria-hidden
              {...handleProps}
              className={cx('ui-drawer__handle', handleProps?.className)}
            />
          )}
          <div
            className={cx(
              'ui-drawer__header',
              !hideClose && 'ui-drawer__header--closable',
              hideTitle && 'ui-sr-only',
            )}
          >
            <DialogPrimitive.Title className="ui-drawer__title">{title}</DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="ui-drawer__description">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {children}
          {/* Last in the DOM, so opening focuses the first control rather than the ×. */}
          {!hideClose && (
            <DialogPrimitive.Close asChild>
              <IconButton icon={X} aria-label={closeLabel} size="sm" className="ui-drawer__close" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/** The scrollable content of a drawer. */
export function DrawerBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('ui-drawer__body', className)}>{children}</div>
}

/** The actions row, pinned to the drawer's end. */
export function DrawerFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('ui-drawer__footer', className)}>{children}</div>
}
