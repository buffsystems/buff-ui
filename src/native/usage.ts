// A pair's daily traffic in words (#916): «340 МБ из 2 ГБ», «Трафик за сутки: … сброс в 03:00».
import { byteParts, usedPercent } from '../shared/bytes.ts'
import type { Locale, Translate } from './i18n.ts'
import type { PairUsageView } from './model.ts'

export function sizeText(t: Translate, locale: Locale, bytes: number): string {
  const { n, unit } = byteParts(bytes)
  return t(`size.${unit}`, { n: n.toLocaleString(locale === 'en' ? 'en-US' : 'ru-RU') })
}

/** «Трафик за сутки: N из M, сброс в HH:MM», or «исчерпан до HH:MM» once it ran out. */
export function usageLine(t: Translate, locale: Locale, u: PairUsageView): string {
  if (u.exhausted) return t('usage.exhausted', { time: u.resets })
  return t('usage.line', {
    used: sizeText(t, locale, u.bytes),
    limit: sizeText(t, locale, u.limit),
    time: u.resets,
  })
}

export const usagePercent = (u: PairUsageView): number => usedPercent(u.bytes, u.limit)
