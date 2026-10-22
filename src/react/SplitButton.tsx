/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { cx } from './cx.ts'
import { Button, buttonClass } from './Button.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './DropdownMenu.tsx'

export interface SplitButtonProps {
  /** The main action's label. */
  children: ReactNode
  onClick?: () => void
  /** The alternatives: DropdownMenuItem elements (a label and separators allowed). */
  menu: ReactNode
  /** Names the chevron that opens the alternatives. */
  menuLabel: string
  variant?: 'primary' | 'outline' | 'secondary'
  size?: 'sm' | 'md'
  leadingIcon?: LucideIcon
  /** Busy: a spinner on the main action; both halves are disabled. */
  loading?: boolean
  disabled?: boolean
  className?: string
}

/**
 * A main action with a menu of alternatives beside it: «Open in VS Code ▾ (Cursor, Finder…)»,
 * «Commit ▾ (and push)». The two halves read as one button.
 */
export function SplitButton({
  children,
  onClick,
  menu,
  menuLabel,
  variant = 'outline',
  size = 'md',
  leadingIcon,
  loading = false,
  disabled = false,
  className,
}: SplitButtonProps) {
  return (
    <div className={cx('ui-split-btn', className)}>
      <Button
        variant={variant}
        size={size}
        leadingIcon={leadingIcon}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        className="ui-split-btn__action"
      >
        {children}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={menuLabel}
          disabled={disabled || loading}
          className={cx(buttonClass({ variant, size }), 'ui-split-btn__toggle')}
        >
          <ChevronDown aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
