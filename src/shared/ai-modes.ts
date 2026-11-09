/*
  Режимы ИИ (#832, эпик #783): уровень мышления и окно контекста — одни слова для окна Buff Code,
  телефона и кабинета. Уровни — словарь вариантов Buff Code (BuffVariant, #759); окно — три
  пресета в токенах, «максимум модели» (0) и «свой» (любое другое число). Без привязки к
  платформе: React и React Native берут отсюда одни и те же подписи.
*/
import type { Locale } from './locale.ts'

export const AI_THINKING_LEVELS = [
  'default',
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
] as const
export type AiThinkingLevel = (typeof AI_THINKING_LEVELS)[number]

export function isAiThinkingLevel(value: unknown): value is AiThinkingLevel {
  return typeof value === 'string' && (AI_THINKING_LEVELS as readonly string[]).includes(value)
}

type Words = { label: string; hint: string }

const THINKING: Record<AiThinkingLevel, Record<Locale, Words>> = {
  default: {
    ru: { label: 'По умолчанию', hint: 'Как настроены модель и провайдер' },
    en: { label: 'Default', hint: 'As the model and its provider are set up' },
  },
  none: {
    ru: { label: 'Выключены', hint: 'Отвечает без размышлений — быстрее всего' },
    en: { label: 'Off', hint: 'Answers without thinking: the fastest' },
  },
  minimal: {
    ru: { label: 'Минимальные', hint: 'Почти не думает — быстрые ответы' },
    en: { label: 'Minimal', hint: 'Barely thinks: quick answers' },
  },
  low: {
    ru: { label: 'Низкие', hint: 'Думает недолго — быстрее и дешевле' },
    en: { label: 'Low', hint: 'Thinks briefly: faster and cheaper' },
  },
  medium: {
    ru: { label: 'Средние', hint: 'Думает умеренно — баланс скорости и качества' },
    en: { label: 'Medium', hint: 'Thinks moderately: a balance of speed and quality' },
  },
  high: {
    ru: { label: 'Высокие', hint: 'Думает дольше — лучше на сложных задачах, медленнее' },
    en: { label: 'High', hint: 'Thinks longer: better on hard tasks, slower' },
  },
  xhigh: {
    ru: { label: 'Очень высокие', hint: 'Думает ещё дольше — для очень сложных задач' },
    en: { label: 'Very high', hint: 'Thinks even longer: for very hard tasks' },
  },
  max: {
    ru: { label: 'Максимальные', hint: 'Думает сколько может — медленнее и дороже всего' },
    en: { label: 'Maximum', hint: 'Thinks as long as it can: the slowest and costliest' },
  },
}

/** The level's label and hint; an unknown id shows as it is, without a hint. */
export function aiThinkingWords(id: string, locale: Locale): Words {
  return isAiThinkingLevel(id) ? THINKING[id][locale] : { label: id, hint: '' }
}

export const AI_CONTEXT_PRESETS = { compact: 64_000, medium: 200_000, large: 500_000 } as const
export type AiContextPreset = keyof typeof AI_CONTEXT_PRESETS | 'max' | 'custom'

const PRESET_WORDS: Record<AiContextPreset, Record<Locale, Words>> = {
  max: {
    ru: { label: 'Максимум модели', hint: 'Всё окно, которое отдаёт модель' },
    en: { label: 'Model maximum', hint: 'The whole window the model serves' },
  },
  compact: {
    ru: { label: 'Компактный', hint: 'Быстро и дёшево; для коротких вопросов и правок' },
    en: { label: 'Compact', hint: 'Fast and cheap; for short questions and edits' },
  },
  medium: {
    ru: { label: 'Средний', hint: 'Обычная работа: сжатие раньше, расход меньше' },
    en: { label: 'Medium', hint: 'Everyday work: compaction sooner, spend lower' },
  },
  large: {
    ru: { label: 'Большой', hint: 'Длинные исследования и большие кодовые базы' },
    en: { label: 'Large', hint: 'Long research and large code bases' },
  },
  custom: {
    ru: { label: 'Свой', hint: 'Число токенов вручную' },
    en: { label: 'Custom', hint: 'A number of tokens by hand' },
  },
}

/** Thousands of tokens the way Buff Code prints a window: 200k. Below a thousand — the number. */
export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) {
    const m = Math.round(tokens / 100_000) / 10
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`
  }
  return tokens >= 1000 ? `${Math.round(tokens / 1000)}k` : String(tokens)
}

/** The window in force (#839): the model's window cut by the session's cap, whichever is known; a zero cap is none. */
export function aiContextEffective(
  modelWindow: number | undefined | null,
  cap: number | undefined | null,
): number | undefined {
  const limit = cap || undefined
  if (!modelWindow) return limit
  if (limit === undefined) return modelWindow
  return Math.min(modelWindow, limit)
}

/** The smallest custom window that makes sense. */
export const AI_CONTEXT_MIN_CUSTOM = 1_000

/** A size typed by hand (#839) — «150000», «150 000», «150k», «1.5M» — as tokens within the model window; junk is nothing. */
export function aiContextParse(
  text: string,
  modelWindow: number | undefined | null,
): number | undefined {
  const match = /^(\d+(?:\.\d+)?)([kKmM]?)$/.exec(text.replace(/\s+/g, ''))
  if (!match) return undefined
  const unit = match[2]?.toLowerCase()
  const value = Math.round(Number(match[1]) * (unit === 'k' ? 1_000 : unit === 'm' ? 1_000_000 : 1))
  if (!Number.isInteger(value) || value < AI_CONTEXT_MIN_CUSTOM) return undefined
  if (modelWindow && value > modelWindow) return undefined
  return value
}

/** The preset a number of tokens is; 0 — the model maximum, an unlisted number — custom. */
export function aiContextPreset(tokens: number): AiContextPreset {
  if (tokens === 0) return 'max'
  const found = (Object.keys(AI_CONTEXT_PRESETS) as (keyof typeof AI_CONTEXT_PRESETS)[]).find(
    (k) => AI_CONTEXT_PRESETS[k] === tokens,
  )
  return found ?? 'custom'
}

export function aiContextPresetWords(preset: AiContextPreset, locale: Locale): Words {
  return PRESET_WORDS[preset][locale]
}

/**
 * The window in words: the preset's name and its size; the maximum names the model's window
 * when it is known; a request above the window shows what will really apply («500k → 128k»).
 */
export function aiContextWords(
  tokens: number,
  locale: Locale,
  modelWindow?: number | null,
): { label: string; detail: string } {
  const preset = aiContextPreset(tokens)
  const label = PRESET_WORDS[preset][locale].label
  if (preset === 'max') return { label, detail: modelWindow ? formatTokens(modelWindow) : '' }
  const clipped = modelWindow && modelWindow > 0 && tokens > modelWindow
  return {
    label,
    detail: clipped
      ? `${formatTokens(tokens)} → ${formatTokens(modelWindow)}`
      : formatTokens(tokens),
  }
}

export interface AiContextOption {
  /** The tokens as a string ('0' — model maximum) or 'custom'. */
  value: string
  label: string
  description: string
  disabled?: boolean
}

/** Options of a window select: the maximum, the presets by size, then «custom». A preset above
 *  the model's window is listed but disabled — it would only be cut to the window anyway. */
export function aiContextOptions(locale: Locale, modelWindow?: number | null): AiContextOption[] {
  const presets = (Object.keys(AI_CONTEXT_PRESETS) as (keyof typeof AI_CONTEXT_PRESETS)[]).map(
    (k) => {
      const tokens = AI_CONTEXT_PRESETS[k]
      const words = PRESET_WORDS[k][locale]
      return {
        value: String(tokens),
        label: words.label,
        description: `${formatTokens(tokens)} · ${words.hint}`,
        disabled: Boolean(modelWindow && modelWindow > 0 && tokens > modelWindow),
      }
    },
  )
  const max = PRESET_WORDS.max[locale]
  const custom = PRESET_WORDS.custom[locale]
  return [
    {
      value: '0',
      label: max.label,
      description: modelWindow ? `${formatTokens(modelWindow)} · ${max.hint}` : max.hint,
    },
    ...presets,
    { value: 'custom', label: custom.label, description: custom.hint },
  ]
}

/** The limit as one line for a row (#839): «Средний · 200k», «Максимум модели · 400k» (the model window when known). */
export function aiContextLabel(
  tokens: number,
  locale: Locale,
  modelWindow?: number | null,
): string {
  const words = aiContextWords(tokens, locale, modelWindow)
  return words.detail ? `${words.label} · ${words.detail}` : words.label
}

export interface AiContextPickerItem {
  /** Tokens as a string ('0' — the model maximum) or 'custom'. */
  id: string
  title: string
  subtitle: string
}

/**
 * A picker's items (#839): the maximum, the presets that fit the model's window (all when it is
 * unknown), the current size when it is no preset, then a custom one.
 */
export function aiContextPickerItems(
  locale: Locale,
  modelWindow: number | undefined | null,
  current: number,
): AiContextPickerItem[] {
  const listed = aiContextOptions(locale, modelWindow).filter((o) => !o.disabled)
  const sizes = listed
    .filter((o) => o.value !== 'custom')
    .map((o) => ({ id: o.value, title: o.label, subtitle: o.description }))
  if (current && !sizes.some((o) => o.id === String(current))) {
    const words = aiContextWords(current, locale, modelWindow)
    sizes.push({ id: String(current), title: words.label, subtitle: words.detail })
  }
  sizes.sort((a, b) => (a.id === '0' ? -1 : Number(a.id)) - (b.id === '0' ? -1 : Number(b.id)))
  const custom = listed.find((o) => o.value === 'custom')
  return custom
    ? [...sizes, { id: 'custom', title: custom.label, subtitle: custom.description }]
    : sizes
}

const DEFAULT_WORD: Record<Locale, string> = { ru: 'По умолчанию', en: 'Default' }

/** A picker's items for a session's thinking level (#840): «default (inherited)» first, then the levels the model has (all when unknown). */
export function aiThinkingPickerItems(
  locale: Locale,
  inherited: string,
  available?: readonly string[] | null,
): AiContextPickerItem[] {
  const levels = (
    available && available.length ? available : AI_THINKING_LEVELS.filter((l) => l !== 'default')
  ) as readonly string[]
  const words = aiThinkingWords(inherited, locale)
  return [
    { id: 'default', title: `${DEFAULT_WORD[locale]} (${words.label})`, subtitle: words.hint },
    ...levels.map((id) => {
      const w = aiThinkingWords(id, locale)
      return { id, title: w.label, subtitle: w.hint }
    }),
  ]
}

/** A picker's items for a session's context cap (#840): «default (inherited)» first, then the maximum, the sizes that fit and a custom one. */
export function aiContextChoiceItems(
  locale: Locale,
  inherited: number,
  modelWindow?: number | null,
): AiContextPickerItem[] {
  return [
    {
      id: 'default',
      title: `${DEFAULT_WORD[locale]} (${aiContextLabel(inherited, locale, modelWindow)})`,
      subtitle: aiContextWords(inherited, locale, modelWindow).label,
    },
    ...aiContextPickerItems(locale, modelWindow, 0),
  ]
}

/** One line for a chip or a card summary: «Размышления: высокие · Контекст: средний, 200k». */
export function aiModeSummary(
  mode: { thinking: string; contextTokens: number },
  locale: Locale,
  modelWindow?: number | null,
): string {
  const thinking = aiThinkingWords(mode.thinking, locale).label.toLowerCase()
  const context = aiContextWords(mode.contextTokens, locale, modelWindow)
  const window = context.detail
    ? `${context.label.toLowerCase()}, ${context.detail}`
    : context.label.toLowerCase()
  return locale === 'ru'
    ? `Размышления: ${thinking} · Контекст: ${window}`
    : `Thinking: ${thinking} · Context: ${window}`
}
