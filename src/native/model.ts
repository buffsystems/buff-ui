/*
  The shared data shapes the native screens are drawn from (#629). Presentational: these are
  what the app hands to a screen, never how it fetched them. Each area keeps its own richer
  types next to its screens; only what several areas share lives here.
*/

/** What a paired peer is: a SaaS organisation, a Community/Enterprise install, a Buff Code machine. */
export type InstallKind = 'saas' | 'ce' | 'ee' | 'machine'

/**
 * The connection state the Home list and every screen banner show.
 * - `online`: live. - `offline`: the cached state is shown read-only, actions are disabled;
 *   `reason` says why when known — the phone cannot reach the gateway, or the install is silent.
 * - `repair`: the pairing was revoked, the person must pair again.
 * - `blockedOrg` / `blockedEe`: the organisation / the Enterprise admin forbade phones.
 * - `incompatible`: the install speaks a protocol version the app does not.
 * - `serviceDown`: a Buff Code machine whose service is not running.
 * - `connecting`: the link dropped a moment ago and is coming back (#695) — the app back from
 *   the background; not live, but too soon to call it «no connection».
 */
export type InstallStatus =
  | { kind: 'online' }
  | { kind: 'connecting' }
  | { kind: 'offline'; since: string; reason?: 'network' | 'install' }
  | { kind: 'repair' }
  | { kind: 'blockedOrg' }
  | { kind: 'blockedEe' }
  | { kind: 'incompatible'; version: string }
  | { kind: 'serviceDown' }

export interface Install {
  id: string
  kind: InstallKind
  /** The organisation / install name, or the machine's host name. */
  name: string
  /** Where it lives: a domain, or «без входа» / the home install for a machine. */
  detail?: string
  status: InstallStatus
  /** How many items of this install wait for the person. */
  attention: number
  /** A Buff Code machine signed into an install: that install's name (its policy applies). */
  homeInstall?: string
}

/** One line of the attention feed: something that waits for the person, from any install. */
export type AttentionKind =
  'gate' | 'question' | 'permission' | 'bcQuestion' | 'review' | 'research' | 'audit'

export interface AttentionItem {
  id: string
  installId: string
  installName: string
  kind: AttentionKind
  title: string
  subtitle?: string
  /** A relative time label: «5 мин назад». */
  when: string
  /** From the cache of an unavailable install: shown dimmed, the action disabled. */
  stale?: boolean
}

/** A person as the cabinet shows them. */
export interface Person {
  name: string
}

export interface Attachment {
  id: string
  name: string
  /** Bytes, for the size label. */
  size: number
  kind: 'image' | 'file'
  /** A transfer in progress, 0..1. */
  progress?: number
  /** The picture itself (a data: or file: URI), once the host has it: shown, not just named (#27). */
  preview?: string
}

/** Whether a dialog's model sees pictures (#27): the camera and the gallery only where it does. */
export interface PicturePolicy {
  images: boolean
  /** The model, to name in the refusal; null — not known. */
  model: string | null
}

/** Why a screen's read failed: a flag, or the reason the install gave (#739) — shown as is. */
export type LoadFailure = boolean | string
