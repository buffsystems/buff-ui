/** @jsxRuntime automatic */
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useWords } from './words.ts'

export interface ComboboxOption {
  value: string
  label?: string
  hint?: string
}

const MENU_MAX = 208

interface MenuPlace {
  left: number
  width: number
  room: number
  top?: number
  bottom?: number
}

/** Where the menu goes: under the field, or above it when there is no room below. */
function placeMenu(field: DOMRect): MenuPlace {
  const below = window.innerHeight - field.bottom
  // The menu may grow wider than a narrow field, up to the room left to the right edge.
  const room = Math.max(field.width, window.innerWidth - field.left - 8)
  const base = { left: field.left, width: field.width, room }
  return below < MENU_MAX && field.top > below
    ? { ...base, bottom: window.innerHeight - field.top }
    : { ...base, top: field.bottom }
}

function matching(options: ComboboxOption[], value: string): ComboboxOption[] {
  const q = value.trim().toLowerCase()
  // A value that IS an option is a choice, not a search: keep the whole list one click away.
  if (!q || options.some((o) => o.value.toLowerCase() === q)) return options
  return options.filter(
    (o) => o.value.toLowerCase().includes(q) || (o.label ?? '').toLowerCase().includes(q),
  )
}

/**
 * A text field with suggestions: the typed text IS the value, the options only help. Keyboard:
 * ↑/↓ move, Enter picks, Escape closes. The menu is a fixed-position portal, so a scrolling
 * dialog body never clips it.
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  onOpen,
  toggleLabel: toggleLabelProp,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  disabled?: boolean
  /** Called each time the menu opens — the hook for loading options on demand. */
  onOpen?: () => void
  toggleLabel?: string
  'aria-label'?: string
}) {
  const words = useWords()
  const toggleLabel = toggleLabelProp ?? words.showOptions
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [place, setPlace] = useState<MenuPlace>({ left: 0, width: 0, room: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const filtered = matching(options, value)

  const openMenu = () => {
    if (open) return
    setActive(
      Math.max(
        0,
        filtered.findIndex((o) => o.value === value),
      ),
    )
    setOpen(true)
    onOpen?.()
  }

  const reposition = () => {
    if (rootRef.current) setPlace(placeMenu(rootRef.current.getBoundingClientRect()))
  }

  useLayoutEffect(() => {
    if (open) reposition()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (!rootRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    // Follow the field while a dialog body scrolls or the window resizes.
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) openMenu()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && open && filtered[active]) {
      e.preventDefault()
      pick(filtered[active].value)
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="ui-combobox">
      <div className="ui-combobox__control">
        <input
          value={value}
          disabled={disabled}
          aria-label={ariaLabel}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          onChange={(e) => {
            onChange(e.target.value)
            openMenu()
            setActive(0)
          }}
          onFocus={openMenu}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="ui-combobox__input"
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={toggleLabel}
          onClick={() => (open ? setOpen(false) : openMenu())}
          className="ui-combobox__toggle"
        >
          <ChevronsUpDown aria-hidden />
        </button>
      </div>
      {open &&
        filtered.length > 0 &&
        createPortal(
          <ul
            ref={listRef}
            role="listbox"
            className="ui-listbox"
            style={{
              position: 'fixed',
              left: place.left,
              top: place.top,
              bottom: place.bottom,
              minWidth: place.width,
              maxWidth: place.room,
              maxHeight: MENU_MAX,
            }}
          >
            {filtered.map((o, i) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(o.value)}
                  className="ui-listbox__option"
                >
                  <Check aria-hidden className="ui-listbox__check" />
                  <span className="ui-listbox__label">{o.label ?? o.value}</span>
                  {o.hint && <span className="ui-listbox__hint">{o.hint}</span>}
                </button>
              </li>
            ))}
          </ul>,
          // Inside a modal dialog everything outside it is inert: open the list in the dialog.
          rootRef.current?.closest<HTMLElement>('[role="dialog"]') ?? document.body,
        )}
    </div>
  )
}
