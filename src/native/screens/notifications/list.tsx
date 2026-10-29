/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Avatar } from '../../Avatar.tsx'
import { IconButton } from '../../Button.tsx'
import { Chip, ChipRow } from '../../Chip.tsx'
import { EmptyState } from '../../Feedback.tsx'
import type { IconName } from '../../icons.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Screen, TopBar } from '../../Screen.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { Gutter, skeletonRows } from '../buffcode/shell.tsx'
import { typeLabel, type NotificationEntry } from './model.ts'

const TYPE_ICON: Record<string, IconName> = {
  task: 'listChecks',
  review: 'gitPullRequest',
  atom: 'cpu',
  ask: 'circleHelp',
  research: 'microscope',
  bc: 'terminal',
  flow: 'alertTriangle',
}

function iconFor(type: string): IconName {
  const [head] = type.split('_')
  return TYPE_ICON[head] ?? 'bell'
}

/** One notification: unread dot, the title, the install and type, when. */
export function NotificationRow({
  entry,
  onPress,
}: {
  entry: NotificationEntry
  onPress?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Row
      leading={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: entry.read ? 'transparent' : theme.colors.primary,
            }}
          />
          <Avatar name={entry.installName} icon={iconFor(entry.type)} size={32} />
        </View>
      }
      title={entry.title}
      subtitle={`${entry.installName} · ${typeLabel(t, entry.type)}`}
      trailing={
        <Text variant="caption" tone="muted">
          {entry.when}
        </Text>
      }
      chevron
      onPress={onPress}
      lines={2}
    />
  )
}

/** The notifications list: from every install's record stream plus the local history. */
export function NotificationsScreen({
  entries,
  filter = 'all',
  loading = false,
  onFilter,
  onOpen,
  onMarkAllRead,
  onSettings,
  onBack,
}: {
  entries: NotificationEntry[]
  filter?: 'all' | 'unread'
  loading?: boolean
  onFilter?: (filter: 'all' | 'unread') => void
  onOpen?: (id: string) => void
  onMarkAllRead?: () => void
  onSettings?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const unread = entries.filter((e) => !e.read)
  const shown = filter === 'unread' ? unread : entries
  const empty = !loading && shown.length === 0
  return (
    <>
      <TopBar
        title={t('notif.title')}
        onBack={onBack}
        leading={onBack ? undefined : <View style={{ width: 8 }} />}
        actions={
          <>
            <IconButton
              icon="checkCircle"
              label={t('notif.markAllRead')}
              onPress={onMarkAllRead}
              disabled={unread.length === 0}
            />
            <IconButton icon="settings" label={t('notif.settings')} onPress={onSettings} />
          </>
        }
      />
      <Screen scroll={!empty}>
        <View
          style={{ paddingTop: theme.space(3), gap: theme.space(3), flex: empty ? 1 : undefined }}
        >
          <ChipRow>
            <Chip
              selected={filter === 'all'}
              count={entries.length}
              onPress={() => onFilter?.('all')}
            >
              {t('common.all')}
            </Chip>
            <Chip
              selected={filter === 'unread'}
              count={unread.length}
              onPress={() => onFilter?.('unread')}
            >
              {t('notif.unread')}
            </Chip>
          </ChipRow>
          {loading ? (
            skeletonRows(theme, 5)
          ) : empty ? (
            <EmptyState
              icon="bellOff"
              title={filter === 'unread' ? t('notif.noUnread') : t('notif.empty')}
              text={filter === 'unread' ? undefined : t('notif.emptyText')}
            />
          ) : (
            <Gutter>
              <RowGroup>
                {shown.map((entry) => (
                  <NotificationRow
                    key={entry.id}
                    entry={entry}
                    onPress={() => onOpen?.(entry.id)}
                  />
                ))}
              </RowGroup>
            </Gutter>
          )}
        </View>
      </Screen>
    </>
  )
}
