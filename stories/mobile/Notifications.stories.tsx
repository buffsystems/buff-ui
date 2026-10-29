import type { Meta, StoryObj } from '@storybook/react-vite'
import { View } from 'react-native'
import {
  ALL_TYPES,
  buildGroups,
  NotificationSettingsScreen,
  NotificationsScreen,
  PushNotificationMock,
  PushPreview,
} from '../../src/native/screens/notifications/index.ts'
import { installs } from './fixtures.ts'
import { machine, notifications, offline } from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Уведомления: список из потока записей и локальной истории; типы по установке; системный пуш. */
const meta = {
  title: 'Mobile/Notifications',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const
const groups = buildGroups([...ALL_TYPES, 'custom_future_type'])
const enabled = new Set([
  'clarify_question',
  'gate_ready',
  'merge_conflict',
  'review_needed',
  'ask_answer',
  'research_done',
  'bc_permission',
  'bc_question',
])
const push = {
  installName: 'MacBook Pro',
  title: 'bun run migrate — разрешить?',
  body: 'billing-service · Экспорт отчётов в PDF. Агент ждёт решения.',
  target: 'сессия «Экспорт отчётов в PDF»',
}

export const List: Story = { render: () => <NotificationsScreen entries={notifications} /> }
export const Unread: Story = {
  render: () => <NotificationsScreen entries={notifications} filter="unread" />,
}
export const Empty: Story = { render: () => <NotificationsScreen entries={[]} /> }
export const Loading: Story = { render: () => <NotificationsScreen entries={[]} loading /> }
export const Settings: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={installs[0]}
      status={status}
      groups={groups}
      enabled={enabled}
    />
  ),
}
/** A demo install (#666): the types are shown, the switches do not move. */
export const SettingsReadOnly: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={installs[0]}
      status={status}
      groups={groups}
      enabled={enabled}
      canEdit={false}
    />
  ),
}
export const SettingsMachine: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={machine}
      status={status}
      groups={buildGroups(['bc_turn_complete', 'bc_permission', 'bc_question', 'bc_error'])}
      enabled={enabled}
    />
  ),
}
export const SettingsPushOff: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={installs[0]}
      status={status}
      groups={groups}
      enabled={enabled}
      pushAllowed={false}
    />
  ),
}
export const SettingsLoading: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={installs[0]}
      status={status}
      groups={[]}
      enabled={enabled}
      loading
    />
  ),
}
export const SettingsFailed: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={installs[0]}
      status={status}
      groups={[]}
      enabled={enabled}
      error="Установка не отдала настройки уведомлений — возможно, её пора обновить."
      onRetry={() => undefined}
    />
  ),
}
export const SettingsOffline: Story = {
  render: () => (
    <NotificationSettingsScreen
      install={installs[2]}
      status={offline}
      groups={groups}
      enabled={enabled}
    />
  ),
}
/** The push as the lock screen shows it, light and dark at once. */
export const Push: Story = { render: () => <PushPreview {...push} /> }
/** The push following the theme toolbar, on the app's own background. */
export const PushInApp: Story = {
  render: () => (
    <View style={{ flex: 1, justifyContent: 'center', padding: 12, gap: 12 }}>
      <PushNotificationMock {...push} when="2 мин" />
      <PushNotificationMock
        installName="Acme"
        title="#142 Экспорт отчётов в PDF"
        body="Формулировка готова к согласованию"
      />
    </View>
  ),
}
