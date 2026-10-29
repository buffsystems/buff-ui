/*
  Notifications (#629): the list from every install, the per-install type settings, the push
  as the system shows it. Importing this module registers the area's strings.
*/
import '../../strings/notifications.ts'

export type { NotificationEntry, NotificationGroup, NotificationSource, TriState } from './model.ts'
export {
  ALL_TYPES,
  buildGroups,
  groupKey,
  groupState,
  typeKey,
  typeLabel as notificationTypeLabel,
} from './model.ts'
export { Toggle } from './toggle.tsx'
export { NotificationRow, NotificationsScreen } from './list.tsx'
export { NotificationSettingsScreen } from './settings.tsx'
export { PushNotificationMock, PushPreview } from './push.tsx'
