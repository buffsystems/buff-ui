/** @jsxRuntime automatic */
import { Check, Languages } from 'lucide-react'
import type { LanguageChoice } from '../shared/locale.ts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu.tsx'
import { IconButton } from './IconButton.tsx'
import { useWords } from './words.ts'

// A language is named in itself, so it is found whatever the current one is.
const OPTIONS: { value: LanguageChoice; name?: string }[] = [
  { value: 'ru', name: 'Русский' },
  { value: 'en', name: 'English' },
  { value: 'system' },
]

/**
 * The ru / en / system switch (#713). The app owns the choice (`useLanguage`) and hands it in;
 * the menu marks it.
 */
export function LanguageToggle({
  choice,
  onChange,
  label: labelProp,
  className,
}: {
  choice: LanguageChoice
  onChange: (choice: LanguageChoice) => void
  label?: string
  className?: string
}) {
  const words = useWords()
  const label = labelProp ?? words.language
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          icon={Languages}
          aria-label={label}
          title={label}
          size="xs"
          className={className}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, name }) => (
          <DropdownMenuItem key={value} onSelect={() => onChange(value)}>
            <span className="ui-menu__text" lang={value === 'system' ? undefined : value}>
              {name ?? words.languageSystem}
            </span>
            {choice === value && <Check aria-hidden className="ui-menu__check" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
