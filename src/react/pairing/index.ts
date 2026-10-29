/*
  Pairing screens on the install side (#630): the cabinet's «Настройки → Телефон», the
  Enterprise admin's mobile policy, Buff Code's phone settings and console dialog, and the
  banner over a session a phone started. Presentational: data in, callbacks out.
*/
export type {
  AffectedMachine,
  AuditEntry,
  BlockReason,
  BuffCodeHome,
  DeviceStatus,
  Locale as PairingLocale,
  MobilePolicy,
  PairedDevice,
  PairingOffer,
  PairingPhase,
  PairingPolicy,
  PairingRequest,
  PhoneInfo,
  PushMode,
  ServiceState,
} from './model.ts'
export { formatSeconds, tr as pairingStrings } from './strings.ts'
export type { StringKey as PairingStringKey } from './strings.ts'
export { QrCode } from './QrCode.tsx'
export { PairingPanel } from './PairingPanel.tsx'
export type { PairingMode } from './PairingPanel.tsx'
export { PairedDevices } from './PairedDevices.tsx'
export { OrgPhonePolicy, PairingRequestCard } from './OrgPhonePolicy.tsx'
export { AffectedMachines, MobileAuditLog, MobilePolicyForm } from './MobilePolicyPanel.tsx'
export {
  BuffCodeHomeNote,
  ConsolePhoneDialog,
  PhoneOriginBadge,
  PhoneSessionBanner,
} from './BuffCodePhone.tsx'
