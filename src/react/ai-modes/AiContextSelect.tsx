/** @jsxRuntime automatic */
import { useEffect, useState } from 'react'
import { SelectMenu, type SelectMenuOption } from '../SelectMenu.tsx'
import { Input } from '../Field.tsx'
import { useLocale } from '../locale.tsx'
import { cx } from '../cx.ts'
import {
  aiContextOptions,
  aiContextPreset,
  aiContextWords,
  formatTokens,
} from '../../shared/ai-modes.ts'

const INHERIT = '__inherit'

export interface AiContextSelectProps {
  /** Tokens (0 — the model maximum), or `null` — inherit (shown only with `inherited`). */
  value: number | null
  onChange: (tokens: number | null) => void
  inherited?: number | null
  inheritedFrom?: string
  /** The model's window, when known: presets above it are disabled, and the line under the
   *  field says what will really apply. */
  modelWindow?: number | null
  /** Shown when `value` is null and nothing is inherited — a bulk row over cells that differ. */
  placeholder?: string
  compact?: boolean
  disabled?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

/**
 * The context window: the model maximum, three presets with their size, or «custom» — then a
 * field for thousands of tokens appears beside. Above the model's window a request is shown
 * as it will be applied («500k → 128k»): the run never gets more than the model serves.
 */
export function AiContextSelect({
  value,
  onChange,
  inherited,
  inheritedFrom,
  modelWindow,
  compact,
  className,
  placeholder,
  ...rest
}: AiContextSelectProps) {
  const locale = useLocale()
  const preset = value == null ? null : aiContextPreset(value)
  const [custom, setCustom] = useState(preset === 'custom')
  // The thousands field keeps its own draft: a controlled number would snap back on every
  // keystroke while the caller is still deciding whether the value is complete.
  const [draft, setDraft] = useState(value ? String(Math.round(value / 1000)) : '')
  useEffect(() => {
    const shown = value ? String(Math.round(value / 1000)) : ''
    if (Number(draft) * 1000 !== value && shown !== draft) setDraft(shown)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from the prop only
  }, [value])
  const options: SelectMenuOption[] = aiContextOptions(locale, modelWindow).map((o) => ({ ...o }))
  if (inherited !== undefined) {
    // Named after its source («Как у установки (Средний, 200k)»); with no source it is the default itself.
    const words = aiContextWords(inherited ?? 0, locale, modelWindow)
    const level = `${words.label}${words.detail ? `, ${words.detail}` : ''}`
    const label = inheritedFrom
      ? `${inheritedFrom.charAt(0).toUpperCase()}${inheritedFrom.slice(1)} (${level})`
      : level
    options.unshift({ value: INHERIT, label })
  }
  const selected =
    value == null
      ? inherited !== undefined
        ? INHERIT
        : undefined
      : custom || preset === 'custom'
        ? 'custom'
        : String(value)
  const clipped = value != null && modelWindow && modelWindow > 0 && value > modelWindow
  const note = clipped ? aiContextWords(value, locale, modelWindow).detail : null
  return (
    <div className={cx('ui-ai-context', className)}>
      <div className="ui-ai-context__row">
        <SelectMenu
          {...rest}
          compact={compact}
          options={options}
          value={selected}
          placeholder={placeholder}
          onValueChange={(next) => {
            if (next === INHERIT) {
              setCustom(false)
              onChange(null)
              return
            }
            if (next === 'custom') {
              setCustom(true)
              if (value == null || aiContextPreset(value) !== 'custom')
                onChange(value && value > 0 ? value : 100_000)
              return
            }
            setCustom(false)
            onChange(Number(next))
          }}
        />
        {(custom || preset === 'custom') && value != null && (
          <label className="ui-ai-context__custom">
            <Input
              type="number"
              min={1}
              step={1}
              compact={compact}
              aria-label={locale === 'ru' ? 'Тысяч токенов' : 'Thousands of tokens'}
              value={draft}
              onChange={(e) => {
                const text = e.currentTarget.value
                setDraft(text)
                const k = Number(text)
                if (text !== '' && Number.isFinite(k) && k > 0) onChange(Math.round(k) * 1000)
              }}
            />
            <span className="ui-ai-context__unit">k</span>
          </label>
        )}
      </div>
      {note && (
        <span className="ui-ai-context__note">
          {locale === 'ru' ? 'Будет применено' : 'Will apply'}: {note}
          {modelWindow
            ? ` (${locale === 'ru' ? 'окно модели' : 'model window'} ${formatTokens(modelWindow)})`
            : ''}
        </span>
      )}
    </div>
  )
}
