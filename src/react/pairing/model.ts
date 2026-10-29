/*
  The shapes the pairing screens on the install side are drawn from (#630): what a cabinet,
  the Enterprise admin panel and Buff Code show while a phone pairs and afterwards. Pure data
  in, callbacks out — the apps wire the gateway.
*/
export type { Locale } from '../../shared/locale.ts'

/** Where the pairing stands. The panel draws one state at a time. */
export type PairingPhase =
  /** The QR / link + code is shown and counts down. */
  | { kind: 'offer'; offer: PairingOffer; secondsLeft: number }
  /** A phone claimed the offer: both sides show the SAS, the person confirms here. */
  | { kind: 'claimed'; sas: string; device: PhoneInfo }
  /** Confirmed: the phone is paired. */
  | { kind: 'paired'; device: PhoneInfo }
  /** The offer ran out before a phone claimed it. */
  | { kind: 'expired' }
  /** Pairing is not possible here, for a reason the panel explains. */
  | { kind: 'blocked'; reason: BlockReason }

export type BlockReason = 'org' | 'ee' | 'serviceDown' | 'disabled'

export interface PairingOffer {
  /** The link the phone opens (the QR carries the same plus the secret). */
  link: string
  /** The 8-character code of the link + code path. */
  code: string
  /** The whole lifetime, to draw the countdown. */
  ttlSeconds: number
}

export interface PhoneInfo {
  name: string
  model: string
}

export type DeviceStatus = 'online' | 'offline' | 'revoked'

export interface PairedDevice {
  id: string
  name: string
  model: string
  /** Shown in the organisation-wide and admin lists. */
  user?: string
  pairedAt: string
  lastSeen: string
  status: DeviceStatus
}

/** A phone asking to pair, when the policy wants a person to confirm first. */
export interface PairingRequest {
  device: PhoneInfo
  user: string
  requestedAt: string
}

export type PairingPolicy = 'all' | 'roles' | 'forbidden'
export type PushMode = 'off' | 'gateway'

/** The Enterprise admin's settings of the mobile app. */
export interface MobilePolicy {
  enabled: boolean
  pairing: PairingPolicy
  /** The roles allowed when `pairing === 'roles'`. */
  roles: string[]
  push: PushMode
  /** The one outbound address push and relay use; shown for air-gapped installs. */
  gatewayAddress: string
}

/** A Buff Code machine signed into this install: the policy applies to it too. */
export interface AffectedMachine {
  host: string
  user: string
  phones: number
  lastSeen: string
}

export interface AuditEntry {
  when: string
  who: string
  what: string
}

/** How Buff Code on this machine relates to an install. */
export type BuffCodeHome =
  { kind: 'standalone' } | { kind: 'signedIn'; install: string; policyForbids: boolean }

export type ServiceState = 'running' | 'stopped'
