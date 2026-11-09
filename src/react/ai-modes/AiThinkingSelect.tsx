/** @jsxRuntime automatic */
import { SelectMenu, type SelectMenuOption } from '../SelectMenu.tsx'
import { useLocale } from '../locale.tsx'
import { AI_THINKING_LEVELS, aiThinkingWords } from '../../shared/ai-modes.ts'

const INHERIT = '__inherit'

export interface AiThinkingSelectProps {
  /** The level, or `null` — inherit (shown only with `inherited`). */
  value: string | null
  onChange: (level: string | null) => void
  /** The level the layer above sets; offers «as above (High)» as the first choice. */
  inherited?: string | null
  /** The words for «as above»: «как у установки», «как у организации», «по умолчанию». */
  inheritedFrom?: string
  /** Levels the model accepts (#783): the others are listed but disabled, with a note. */
  available?: readonly string[] | null
  /** Shown when `value` is null and nothing is inherited — a bulk row over cells that differ. */
  placeholder?: string
  compact?: boolean
  disabled?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

/**
 * The thinking level (BuffVariant words, #759): every level with a line on what it changes.
 * A layered setting offers «as above» first and names what that is, so an untouched cell never
 * reads as empty.
 */
export function AiThinkingSelect({
  value,
  onChange,
  inherited,
  inheritedFrom,
  available,
  placeholder,
  ...rest
}: AiThinkingSelectProps) {
  const locale = useLocale()
  const words = (id: string) => aiThinkingWords(id, locale)
  const options: SelectMenuOption[] = AI_THINKING_LEVELS.map((id) => {
    const unavailable = Boolean(available && id !== 'default' && !available.includes(id))
    const w = words(id)
    return {
      value: id,
      label: w.label,
      description: unavailable
        ? locale === 'ru'
          ? 'Модель не принимает этот уровень'
          : 'The model does not take this level'
        : w.hint,
      disabled: unavailable,
    }
  })
  if (inherited !== undefined) {
    // Named after its source («Как у установки (Высокие)»); with no source it simply IS the default.
    const level = words(inherited ?? 'default')
    const label = inheritedFrom
      ? `${inheritedFrom.charAt(0).toUpperCase()}${inheritedFrom.slice(1)} (${level.label})`
      : level.label
    options.unshift({ value: INHERIT, label, description: level.hint })
  }
  const selected = value ?? (inherited !== undefined ? INHERIT : undefined)
  return (
    <SelectMenu
      {...rest}
      options={options}
      value={selected}
      placeholder={placeholder}
      onValueChange={(next) => onChange(next === INHERIT ? null : next)}
    />
  )
}
