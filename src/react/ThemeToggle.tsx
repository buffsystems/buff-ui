/** @jsxRuntime automatic */
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu.tsx'
import { IconButton } from './IconButton.tsx'
import { useTheme, type Theme } from './theme.ts'
import { useWords } from './words.ts'

const OPTIONS: { value: Theme; icon: LucideIcon }[] = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
]

/**
 * The light / dark / system switch. The trigger shows the mode actually painted; the menu
 * marks the choice. `onChange` lets an app record the choice (usage tracking). `label` and
 * `labels` translate the trigger and the menu items.
 */
export function ThemeToggle({
  onChange,
  label: labelProp,
  labels,
  className,
}: {
  onChange?: (theme: Theme) => void
  label?: string
  labels?: Partial<Record<Theme, string>>
  className?: string
}) {
  const { theme, effective, setTheme } = useTheme()
  const words = useWords()
  const label = labelProp ?? words.theme
  const names: Record<Theme, string> = {
    light: words.themeLight,
    dark: words.themeDark,
    system: words.themeSystem,
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          icon={effective === 'dark' ? Moon : Sun}
          aria-label={label}
          title={label}
          size="xs"
          className={className}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => {
              setTheme(value)
              onChange?.(value)
            }}
          >
            <Icon aria-hidden />
            <span className="ui-menu__text">{labels?.[value] ?? names[value]}</span>
            {theme === value && <Check aria-hidden className="ui-menu__check" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
