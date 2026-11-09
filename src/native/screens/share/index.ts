/*
  Public links (#821, epic #769): the share sheet and Settings → Public links. Importing this
  module registers the area's strings.
*/
import '../../strings/share.ts'

export { ShareSheet, EXPIRY_KEY } from './sheet.tsx'
export { PublicLinksScreen } from './links.tsx'
export { EXPIRY_PRESETS, expiresAtFor, linkState } from './model.ts'
export type {
  ExpiryPreset,
  LinkKind,
  LinkPatch,
  LinkState,
  MadeLink,
  MessagePreview,
  PublicLinkRow,
  ShareForm,
} from './model.ts'
