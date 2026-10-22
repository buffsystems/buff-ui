/** @jsxRuntime automatic */
import { createContext, useContext, useId } from 'react'
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from './cx.ts'

// What a Field tells the control inside it: the id of its hint or error, and whether it is in
// error. Input, Textarea, Select and SelectMenu read it; their own aria-* props still win.
const FieldContext = createContext<{ describedBy?: string; invalid: boolean } | null>(null)

/** The `aria-describedby` / `aria-invalid` a control gets from its Field, merged with its own. */
export function useFieldControl(own: {
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling'
}): {
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling'
} {
  const field = useContext(FieldContext)
  const describedBy = [own['aria-describedby'], field?.describedBy].filter(Boolean).join(' ')
  return {
    'aria-describedby': describedBy || undefined,
    'aria-invalid': own['aria-invalid'] ?? (field?.invalid || undefined),
  }
}

export function Input({
  compact = false,
  leadingIcon: Icon,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  /** 28px — a field inside a table row or a dense toolbar. */
  compact?: boolean
  /** An icon inside the field's start (a search box). */
  leadingIcon?: LucideIcon
  /** The <input> itself, also with a leading icon — focus or select it from a shortcut. */
  ref?: Ref<HTMLInputElement>
}) {
  const aria = useFieldControl(props)
  const input = (
    <input
      className={cx('ui-input', compact && 'ui-input--sm', !Icon && className)}
      {...props}
      {...aria}
    />
  )
  if (!Icon) return input
  return (
    <div className={cx('ui-input-group', className)}>
      <Icon aria-hidden className="ui-input-group__icon" />
      {input}
    </div>
  )
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  const aria = useFieldControl(props)
  return <textarea className={cx('ui-textarea', className)} {...props} {...aria} />
}

/** A native select (the platform picker on a phone) with the system's look. */
export function Select({
  compact = false,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { compact?: boolean }) {
  return (
    <div className={cx('ui-select', compact && 'ui-select--sm', className)}>
      <select {...props} {...useFieldControl(props)} />
    </div>
  )
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx('ui-label', className)} {...props} />
}

/**
 * A label over its control, with an optional hint or error under it. One control sits inside
 * the <label>; the hint and the error sit outside it, so they describe the control
 * (`aria-describedby`, and `aria-invalid` on an error) instead of joining its name — Input,
 * Textarea, Select and SelectMenu pick that up by themselves, another control through
 * `useFieldControl`. A composite control (choice buttons, several inputs) is a `group` — a
 * <label> would hand its name to the first button only; the group itself is then described.
 */
export function Field({
  label,
  hint,
  error,
  group = false,
  children,
  className,
}: {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  group?: boolean
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const noteId = `${id}-note`
  const hasError = Boolean(error)
  const note = hasError ? (
    <span id={noteId} role="alert" className="ui-field__error">
      {error}
    </span>
  ) : (
    hint && (
      <span id={noteId} className="ui-field__hint">
        {hint}
      </span>
    )
  )
  const describedBy = note ? noteId : undefined
  const title = (
    <span id={id} className="ui-label">
      {label}
    </span>
  )
  if (group) {
    return (
      <div
        role="group"
        aria-labelledby={id}
        aria-describedby={describedBy}
        className={cx('ui-field', className)}
      >
        {title}
        {/* The group is described; a nested control does not repeat it. */}
        <FieldContext value={null}>{children}</FieldContext>
        {note}
      </div>
    )
  }
  return (
    <div className={cx('ui-field', className)}>
      <label className="ui-field__body">
        {title}
        <FieldContext value={{ describedBy, invalid: hasError }}>{children}</FieldContext>
      </label>
      {note}
    </div>
  )
}
