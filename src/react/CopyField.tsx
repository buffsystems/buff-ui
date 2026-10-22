/** @jsxRuntime automatic */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, InputHTMLAttributes, Ref, TextareaHTMLAttributes } from 'react'
import { Check, Copy } from 'lucide-react'
import { cx } from './cx.ts'
import { Tooltip } from './Tooltip.tsx'

export interface CopyFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'readOnly' | 'type' | 'onChange'
> {
  /** The text shown and copied. */
  value: string
  /** The button's name and tooltip. */
  copyLabel?: string
  /** Its name for two seconds after a copy, also announced. */
  copiedLabel?: string
  /** Code, a key, a confirmation code: the monospace face. */
  mono?: boolean
  /** 28px — inside a table row or a dense toolbar. */
  compact?: boolean
  /**
   * A long value (a key, a fingerprint) shown whole: it wraps onto as many lines as it needs,
   * breaking anywhere, and the copy button stays at the top end. The control is then a read-only
   * <textarea>; the native attributes and handlers given here reach it.
   */
  multiline?: boolean
  /** The app's own clipboard (a desktop bridge); by default the browser's, then a selection copy. */
  copy?: (text: string) => Promise<boolean> | boolean
  /** After a successful copy. */
  onCopied?: (text: string) => void
  /** The <input> (the <textarea> when `multiline`). */
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>
}

type Control = HTMLInputElement | HTMLTextAreaElement

async function browserCopy(text: string, input: Control | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // No clipboard API or no permission: copy the field's own selection.
    input?.select()
    return document.execCommand('copy')
  }
}

/**
 * A read-only value with a copy button at its end: a confirmation code, a token, a URL. The
 * button turns into a check and says «copied» for two seconds. Focusing the field selects the
 * value, so it can be copied by hand too. Name it with a Field label or aria-label.
 */
export function CopyField({
  value,
  copyLabel = 'Копировать',
  copiedLabel = 'Скопировано',
  mono = false,
  compact = false,
  multiline = false,
  copy,
  onCopied,
  onFocus,
  className,
  ref,
  ...props
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false)
  const input = useRef<Control | null>(null)
  const setInput = useCallback(
    (node: Control | null) => {
      input.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const run = async () => {
    const done = copy ? await copy(value) : await browserCopy(value, input.current)
    if (!done) return
    setCopied(true)
    onCopied?.(value)
  }

  const focus = (e: FocusEvent<Control>) => {
    e.currentTarget.select()
    onFocus?.(e as FocusEvent<HTMLInputElement>)
  }

  const label = copied ? copiedLabel : copyLabel
  return (
    <div className={cx('ui-copy-field', multiline && 'ui-copy-field--multiline', className)}>
      {multiline ? (
        <textarea
          ref={setInput}
          readOnly
          rows={1}
          value={value}
          onFocus={focus}
          className={cx(
            'ui-textarea',
            'ui-copy-field__input',
            'ui-copy-field__input--multiline',
            mono && 'ui-copy-field__input--mono',
          )}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={setInput}
          type="text"
          readOnly
          value={value}
          onFocus={focus}
          className={cx(
            'ui-input',
            compact && 'ui-input--sm',
            'ui-copy-field__input',
            mono && 'ui-copy-field__input--mono',
          )}
          {...props}
        />
      )}
      <Tooltip content={label}>
        <button
          type="button"
          aria-label={label}
          data-copied={copied || undefined}
          disabled={props.disabled}
          onClick={() => void run()}
          className="ui-btn ui-btn--icon ui-btn--ghost ui-btn--xs ui-copy-field__button"
        >
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        </button>
      </Tooltip>
      <span role="status" className="ui-copy-field__status">
        {copied ? copiedLabel : ''}
      </span>
    </div>
  )
}
