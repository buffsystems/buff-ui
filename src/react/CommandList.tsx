/** @jsxRuntime automatic */
import { useEffect, useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Check, Search } from 'lucide-react'
import { cx } from './cx.ts'
import { useWords } from './words.ts'

export interface CommandItem {
  /** Unique: what onSelect, current and the active row are keyed by. */
  value: string
  label: string
  description?: string
  /** Items sharing a group are listed under its title, in the order the groups first appear. */
  group?: string
  /** More words the filter matches (an alias, a provider's name). */
  keywords?: string[]
  /** A leading mark: an icon, an avatar. */
  icon?: ReactNode
  /** Trailing: a shortcut (<Kbd>), a tag (<Badge>). */
  hint?: ReactNode
  disabled?: boolean
}

export interface CommandListProps {
  items: CommandItem[]
  onSelect: (item: CommandItem) => void
  /** Names the search field and the list for assistive tech. */
  label: string
  placeholder?: string
  /** Controlled search text; leave out to let the list keep its own. */
  query?: string
  onQueryChange?: (query: string) => void
  /** Which items a query keeps. `false`: the caller filters (an async search) and passes the result. */
  filter?: ((item: CommandItem, query: string) => boolean) | false
  /** The current choice (a model picker): checked, and active when the list opens. */
  current?: string
  /** The keyboard or the pointer moved to another row — a live preview. */
  onActiveChange?: (item: CommandItem | undefined) => void
  emptyText?: ReactNode
  loading?: boolean
  loadingText?: ReactNode
  autoFocus?: boolean
  className?: string
}

/** Every word of the query appears in the item's label, description, group or keywords. */
export function matchesCommand(item: CommandItem, query: string): boolean {
  const haystack = [item.label, item.description, item.group, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

function groupsOf(items: CommandItem[]): { title?: string; items: CommandItem[] }[] {
  const groups = new Map<string | undefined, CommandItem[]>()
  for (const item of items) groups.set(item.group, [...(groups.get(item.group) ?? []), item])
  return [...groups].map(([title, members]) => ({ title, items: members }))
}

/**
 * A keyboard-filterable list: a search field over grouped options — the command palette, a
 * model picker. Focus stays in the field; ↑/↓ move through the enabled rows (wrapping), Enter
 * picks. Put it in a Dialog for a palette or a popover for a picker.
 */
export function CommandList({
  items,
  onSelect,
  label,
  placeholder,
  query: controlledQuery,
  onQueryChange,
  filter = matchesCommand,
  current,
  onActiveChange,
  emptyText: emptyTextProp,
  loading = false,
  loadingText: loadingTextProp,
  autoFocus,
  className,
}: CommandListProps) {
  const words = useWords()
  const emptyText = emptyTextProp ?? words.nothingFound
  const loadingText = loadingTextProp ?? words.loading
  const id = useId()
  const [ownQuery, setOwnQuery] = useState('')
  const query = controlledQuery ?? ownQuery
  const [activeValue, setActiveValue] = useState(current)

  const q = query.trim()
  const visible = filter && q ? items.filter((item) => filter(item, q)) : items
  const groups = groupsOf(visible)
  // Rows in screen order (grouping may reorder the incoming list).
  const rows = groups.flatMap((group) => group.items)
  const enabled = rows.filter((item) => !item.disabled)
  const active = enabled.find((item) => item.value === activeValue) ?? enabled[0]
  const optionId = (item: CommandItem) => `${id}-${rows.indexOf(item)}`

  useEffect(() => {
    onActiveChange?.(active)
    // Only a different row is news; a new callback identity is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.value])

  const changeQuery = (next: string) => {
    if (controlledQuery === undefined) setOwnQuery(next)
    onQueryChange?.(next)
    setActiveValue(undefined)
  }

  const move = (delta: 1 | -1) => {
    if (!enabled.length) return
    const index = active ? enabled.indexOf(active) : -1
    const next = enabled[(index + delta + enabled.length) % enabled.length]
    setActiveValue(next.value)
    document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      move(e.key === 'ArrowDown' ? 1 : -1)
    } else if (e.key === 'Enter' && active) {
      e.preventDefault()
      onSelect(active)
    }
  }

  return (
    <div className={cx('ui-command', className)}>
      <div className="ui-command__search">
        <Search aria-hidden className="ui-command__search-icon" />
        <input
          role="combobox"
          aria-label={label}
          aria-expanded
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={(e) => changeQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="ui-command__input"
        />
      </div>
      <div id={`${id}-list`} role="listbox" aria-label={label} className="ui-command__list">
        {groups.map((group, g) => (
          <div
            key={group.title ?? ''}
            role="group"
            aria-labelledby={group.title ? `${id}-g${g}` : undefined}
            className="ui-command__group"
          >
            {group.title && (
              <div id={`${id}-g${g}`} className="ui-command__group-label">
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <div
                key={item.value}
                id={optionId(item)}
                role="option"
                aria-selected={item === active}
                aria-disabled={item.disabled || undefined}
                aria-current={item.value === current || undefined}
                data-active={item === active || undefined}
                onMouseMove={(e) => {
                  // A still pointer under rows the keyboard scrolls is not a choice.
                  if (e.movementX === 0 && e.movementY === 0) return
                  if (!item.disabled) setActiveValue(item.value)
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => !item.disabled && onSelect(item)}
                className="ui-command__item"
              >
                {item.icon && <span className="ui-command__icon">{item.icon}</span>}
                <span className="ui-command__text">
                  <span className="ui-command__label">{item.label}</span>
                  {item.description && (
                    <span className="ui-command__description">{item.description}</span>
                  )}
                </span>
                {item.hint && <span className="ui-command__hint">{item.hint}</span>}
                {current !== undefined && <Check aria-hidden className="ui-command__check" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      {rows.length === 0 && (
        <div role="status" className="ui-command__empty">
          {loading ? loadingText : emptyText}
        </div>
      )}
    </div>
  )
}
