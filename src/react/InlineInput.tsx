/** @jsxRuntime automatic */
import { useRef } from 'react'
import type { FocusEvent, InputHTMLAttributes, KeyboardEvent, Ref } from 'react'
import { cx } from './cx.ts'

export interface InlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Enter, or leaving the field (unless `commitOnBlur` is off): keep the typed value. */
  onCommit?: (value: string) => void
  /** Escape: drop the edit. */
  onCancel?: () => void
  commitOnBlur?: boolean
  /**
   * Text-exact: no edge or inset until focused, so it sits on the line like the words around it
   * (a tab's label, a title in a row); focus draws the ring outside the text.
   */
  bare?: boolean
  /** The input element — focus or select it when «Rename» is picked from a menu. */
  ref?: Ref<HTMLInputElement>
}

/**
 * An input that reads as plain text until hovered or focused: renaming a tab, a session, a
 * project in place. It grows with its text. Enter commits, Escape cancels (never while an IME
 * is composing). Name it with aria-label.
 */
export function InlineInput({
  onCommit,
  onCancel,
  commitOnBlur = true,
  bare = false,
  className,
  onKeyDown,
  onBlur,
  onFocus,
  ...props
}: InlineInputProps) {
  // Enter or Escape already settled this edit: the blur that follows must not commit again.
  const settled = useRef(false)

  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || e.nativeEvent.isComposing) return
    if (e.key === 'Enter' && onCommit) {
      e.preventDefault()
      settled.current = true
      onCommit(e.currentTarget.value)
    } else if (e.key === 'Escape' && onCancel) {
      e.preventDefault()
      e.stopPropagation()
      settled.current = true
      onCancel()
    }
  }

  const blur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    if (!settled.current && commitOnBlur) onCommit?.(e.currentTarget.value)
  }

  const focus = (e: FocusEvent<HTMLInputElement>) => {
    settled.current = false
    onFocus?.(e)
  }

  return (
    <input
      type="text"
      className={cx('ui-inline-input', bare && 'ui-inline-input--bare', className)}
      onKeyDown={key}
      onBlur={blur}
      onFocus={focus}
      {...props}
    />
  )
}
