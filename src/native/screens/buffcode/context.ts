import type { Locale } from '../../i18n.ts'
import {
  aiContextLabel,
  aiContextPickerItems,
  type AiContextPickerItem,
} from '../../../shared/ai-modes.ts'

/**
 * The session's context window on the phone (#839): the cap in words beside the thinking mode.
 * The words are the cabinet's (shared/ai-modes), so a limit reads the same everywhere; the
 * screens take the locale first, as their other helpers do.
 */

export type ContextOption = AiContextPickerItem

/** The limit as one line: «Средний · 200k», «Максимум модели · 400k» (the model window when known). */
export function contextLabel(
  locale: Locale,
  tokens: number,
  modelWindow: number | undefined,
): string {
  return aiContextLabel(tokens, locale, modelWindow)
}

/** The picker's items: the maximum, the presets that fit the model, the current size, then a custom one. */
export function contextOptions(
  locale: Locale,
  modelWindow: number | undefined,
  current: number,
): ContextOption[] {
  return aiContextPickerItems(locale, modelWindow, current)
}
