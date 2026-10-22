/** @jsxRuntime automatic */
import { Fragment, type ReactNode } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cx } from './cx.ts'
import { useFieldControl } from './Field.tsx'

export interface SelectMenuOption {
  value: string
  label: string
  /** A second line under the label, shown in the list only (never in the closed field). */
  description?: ReactNode
  /** Options sharing a group are listed under its title, in the order the groups first appear. */
  group?: string
  disabled?: boolean
}

export interface SelectMenuProps {
  options: SelectMenuOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called as the pointer or the keyboard moves over an option — a live preview (a theme). */
  onHighlight?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  /** `field` is the bordered form control; `ghost` is the borderless one of a toolbar. */
  variant?: 'field' | 'ghost'
  /** 28px — a toolbar, a composer footer, a table row. */
  compact?: boolean
  disabled?: boolean
  invalid?: boolean
  name?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  contentClassName?: string
}

function groupsOf(options: SelectMenuOption[]): { title?: string; options: SelectMenuOption[] }[] {
  const groups = new Map<string | undefined, SelectMenuOption[]>()
  for (const option of options)
    groups.set(option.group, [...(groups.get(option.group) ?? []), option])
  return [...groups].map(([title, members]) => ({ title, options: members }))
}

/**
 * A styled dropdown select: the list is a menu in the system's look, with groups and a second
 * line per option. Keyboard and typeahead come from Radix. On a phone-first form prefer the
 * native `Select` (the platform picker).
 */
export function SelectMenu({
  options,
  onHighlight,
  placeholder,
  variant = 'field',
  compact = false,
  invalid = false,
  className,
  contentClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...root
}: SelectMenuProps) {
  const groups = groupsOf(options)
  const aria = useFieldControl({ 'aria-invalid': invalid || undefined })
  return (
    <SelectPrimitive.Root {...root}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...aria}
        className={cx(
          'ui-select-menu',
          variant === 'ghost' && 'ui-select-menu--ghost',
          compact && 'ui-select-menu--sm',
          className,
        )}
      >
        <span className="ui-select-menu__value">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden className="ui-select-menu__chevron" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className={cx('ui-menu ui-select-menu__content', contentClassName)}
        >
          <SelectPrimitive.Viewport>
            {groups.map((group, index) => (
              <Fragment key={group.title ?? ''}>
                {index > 0 && <SelectPrimitive.Separator className="ui-menu__separator" />}
                <SelectPrimitive.Group>
                  {group.title && (
                    <SelectPrimitive.Label className="ui-menu__label">
                      {group.title}
                    </SelectPrimitive.Label>
                  )}
                  {group.options.map((option) => (
                    <SelectPrimitive.Item
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onFocus={() => onHighlight?.(option.value)}
                      className="ui-menu__item ui-select-menu__item"
                    >
                      <span className="ui-menu__text">
                        <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                        {option.description && (
                          <span className="ui-select-menu__description">{option.description}</span>
                        )}
                      </span>
                      <SelectPrimitive.ItemIndicator className="ui-menu__check">
                        <Check aria-hidden />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Group>
              </Fragment>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
