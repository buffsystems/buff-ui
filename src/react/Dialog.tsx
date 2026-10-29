/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cx } from './cx.ts'
import { IconButton } from './IconButton.tsx'
import { useWords } from './words.ts'

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl'

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  size?: DialogSize
  /** While busy, Escape, the backdrop and the close button do nothing. */
  busy?: boolean
  /** Hide the × in the corner (a dialog that must be answered by its actions). */
  hideClose?: boolean
  closeLabel?: string
  className?: string
  children?: ReactNode
}

/**
 * A modal dialog: focus is trapped inside, Escape and the backdrop close it, the page under
 * it is inert. Compose the inside from DialogBody and DialogFooter.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  busy = false,
  hideClose = false,
  closeLabel: closeLabelProp,
  className,
  children,
}: DialogProps) {
  const words = useWords()
  const closeLabel = closeLabelProp ?? words.close
  const change = (next: boolean) => {
    if (!busy || next) onOpenChange(next)
  }
  return (
    <DialogPrimitive.Root open={open} onOpenChange={change}>
      <DialogPrimitive.Portal>
        {/* The overlay centres the dialog (no transform on the dialog itself), so a fixed-position
            menu inside it — a combobox list — is placed against the viewport. */}
        <DialogPrimitive.Overlay className="ui-dialog-overlay">
          <DialogPrimitive.Content
            className={cx('ui-dialog', `ui-dialog--${size}`, className)}
            // No description: tell Radix there is none rather than point at a missing node.
            {...(description ? {} : { 'aria-describedby': undefined })}
          >
            <div className={cx('ui-dialog__header', !hideClose && 'ui-dialog__header--closable')}>
              <div className="ui-dialog__heading">
                <DialogPrimitive.Title className="ui-dialog__title">{title}</DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="ui-dialog__description">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
            </div>
            {children}
            {/* Last in the DOM, so opening focuses the first field rather than the ×. */}
            {!hideClose && (
              <DialogPrimitive.Close asChild>
                <IconButton
                  icon={X}
                  aria-label={closeLabel}
                  size="sm"
                  disabled={busy}
                  className="ui-dialog__close"
                />
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/** The scrollable content of a dialog. */
export function DialogBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('ui-dialog__body', className)}>{children}</div>
}

/** The actions row. `stack` puts many actions in a column on a phone, the primary on top. */
export function DialogFooter({
  stack = false,
  className,
  children,
}: {
  stack?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cx('ui-dialog__footer', stack && 'ui-dialog__footer--stack', className)}>
      {children}
    </div>
  )
}
