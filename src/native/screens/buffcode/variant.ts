import type { Translate } from '../../i18n.ts'

/**
 * The model's thinking mode (#759) — its variant: how long it thinks before answering. The
 * service names the ids (none, low, high, max, …); the words follow the window's (BuffVariant).
 */
const cap = (id: string) => id.charAt(0).toUpperCase() + id.slice(1)

const KNOWN = new Set([
  'default',
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
  'thinking',
])

/** The variant's label; an unknown id shows as it is. */
export function variantLabel(t: Translate, id: string): string {
  return KNOWN.has(id) ? t(`buffcode.variant${cap(id)}`) : id
}

/** What the variant changes, in a line; none for an unknown id. */
export function variantHint(t: Translate, id: string): string {
  return KNOWN.has(id) ? t(`buffcode.variantHint${cap(id)}`) : ''
}
