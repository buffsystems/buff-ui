/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Button } from './Button.tsx'
import { Dialog, DialogBody, DialogFooter } from './Dialog.tsx'
import { useWords } from './words.ts'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** A third way out that is neither confirm nor cancel («Уйти без сохранения»). Shown only
   *  together with onSecondary; Escape and the backdrop still mean cancel. */
  secondaryLabel?: string
  /** The action destroys something: the confirm button turns destructive. */
  danger?: boolean
  busy?: boolean
  /** An info/error dialog with a single acknowledge action. */
  hideCancel?: boolean
  onConfirm: () => void
  onCancel: () => void
  onSecondary?: () => void
  /** Content the action needs between the message and the actions (a reason, a comment). */
  children?: ReactNode
}

/** Asks before an irreversible or important action. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  secondaryLabel,
  danger = false,
  busy = false,
  hideCancel = false,
  onConfirm,
  onCancel,
  onSecondary,
  children,
}: ConfirmDialogProps) {
  const words = useWords()
  const confirmLabel = confirmLabelProp ?? words.confirm
  const cancelLabel = cancelLabelProp ?? words.cancel
  const secondary = Boolean(secondaryLabel && onSecondary)
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && onCancel()}
      title={title}
      description={message}
      size={secondary ? 'md' : 'sm'}
      busy={busy}
      hideClose
    >
      {children && <DialogBody>{children}</DialogBody>}
      <DialogFooter stack={secondary}>
        {!hideCancel && (
          <Button variant="ghost" size="sm" disabled={busy} onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        {secondary && (
          <Button variant="outline" size="sm" disabled={busy} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        )}
        <Button
          variant={danger ? 'destructive' : 'primary'}
          size="sm"
          loading={busy}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
