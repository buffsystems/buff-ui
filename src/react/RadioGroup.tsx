/** @jsxRuntime automatic */
import type { ComponentProps, ReactNode } from 'react'
import * as RadioPrimitive from '@radix-ui/react-radio-group'
import { cx } from './cx.ts'

/**
 * One choice out of a few, all visible at once. Arrow keys move and pick (Radix). Name the set
 * with aria-label, aria-labelledby or a <Field group>.
 */
export function RadioGroup({
  orientation = 'vertical',
  className,
  ...props
}: ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      orientation={orientation}
      className={cx(
        'ui-radio-group',
        orientation === 'horizontal' && 'ui-radio-group--horizontal',
        className,
      )}
      {...props}
    />
  )
}

/** A radio with its label (and an optional hint under it) as one clickable row. */
export function RadioItem({
  label,
  hint,
  className,
  ...props
}: Omit<ComponentProps<typeof RadioPrimitive.Item>, 'children'> & {
  label: ReactNode
  hint?: ReactNode
}) {
  return (
    <label className={cx('ui-radio', props.disabled && 'ui-radio--disabled', className)}>
      <RadioPrimitive.Item className="ui-radio__control" {...props}>
        <RadioPrimitive.Indicator className="ui-radio__dot" />
      </RadioPrimitive.Item>
      <span className="ui-radio__text">
        <span>{label}</span>
        {hint && <span className="ui-field__hint">{hint}</span>}
      </span>
    </label>
  )
}
