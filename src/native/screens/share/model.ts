/*
  Public links (#821, epic #769): what the share sheet collects and what the links screen draws.
  Pure — the host app sends and fetches; the screens render.
*/

/** A message as the sheet lists it for picking: who said it and its first words. */
export interface MessagePreview {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export type ExpiryPreset = 'none' | '1h' | '1d' | '7d' | '30d'

export const EXPIRY_PRESETS: ReadonlyArray<{ id: ExpiryPreset; ms: number | null }> = [
  { id: 'none', ms: null },
  { id: '1h', ms: 60 * 60 * 1000 },
  { id: '1d', ms: 24 * 60 * 60 * 1000 },
  { id: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
  { id: '30d', ms: 30 * 24 * 60 * 60 * 1000 },
]

/** When a link made now with this preset ends; null — never. */
export function expiresAtFor(preset: ExpiryPreset, nowMs: number): number | null {
  const found = EXPIRY_PRESETS.find((p) => p.id === preset)
  return found?.ms == null ? null : nowMs + found.ms
}

/** What the sheet hands the host when the person taps «Create». */
export interface ShareForm {
  /** Picked message ids; undefined — the whole dialog. */
  messages?: string[]
  title: string
  pass?: string
  expiresAt: number | null
  tools: boolean
  live: boolean
}

/** What the sheet shows once the link exists. */
export interface MadeLink {
  link: string
  hasPass: boolean
}

export type LinkState = 'on' | 'off' | 'expired' | 'pending'
export type LinkKind = 'session' | 'messages' | 'ask' | 'research'

/** A link as the settings screen lists it — from a machine or an install. */
export interface PublicLinkRow {
  id: string
  /** The install or machine that holds it, and its name on this phone. */
  installId: string
  installName: string
  kind: LinkKind
  title: string
  link: string
  /** The source's title now; null — it is gone. */
  sourceTitle: string | null
  hasPass: boolean
  expiresAt: number | null
  tools: boolean
  live: boolean
  enabled: boolean
  published: boolean
  created: number
}

/** Switched off wins; then expired; then waiting for the gateway; else on. */
export function linkState(
  row: Pick<PublicLinkRow, 'enabled' | 'expiresAt' | 'published'>,
  nowMs: number,
): LinkState {
  if (!row.enabled) return 'off'
  if (row.expiresAt !== null && row.expiresAt <= nowMs) return 'expired'
  if (!row.published) return 'pending'
  return 'on'
}

/** What the edit sheet hands the host. */
export interface LinkPatch {
  title?: string
  /** A new password; null — remove it. */
  pass?: string | null
  expiresAt?: number | null
  tools?: boolean
  live?: boolean
}
