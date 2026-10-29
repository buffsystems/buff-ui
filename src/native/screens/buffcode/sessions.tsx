/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Badge, StatusDot } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { ConfirmSheet, Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { BcProject, BcSession } from './model.ts'
import {
  Eyebrow,
  Gutter,
  isLive,
  MachineShell,
  ORIGIN_ICON,
  originLabel,
  skeletonRows,
} from './shell.tsx'

const GROUPS: BcSession['group'][] = ['today', 'yesterday', 'older']
const GROUP_KEY: Record<BcSession['group'], string> = {
  today: 'common.today',
  yesterday: 'common.yesterday',
  older: 'buffcode.older',
}

/** One session: its title, where it was started, when; running and waiting marks. */
export function SessionRow({
  session,
  onPress,
  onMore,
}: {
  session: BcSession
  onPress?: () => void
  onMore?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Row
      leading={
        <Icon name={ORIGIN_ICON[session.origin]} size={20} color={theme.colors.mutedForeground} />
      }
      title={session.title}
      subtitle={`${originLabel(t, session.origin)} · ${session.when}${session.running ? ` · ${t('buffcode.running')}` : ''}`}
      trailing={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {session.attention ? <Badge tone="crit">{session.attention}</Badge> : null}
          {session.running && <StatusDot tone="info" pulse />}
        </View>
      }
      actions={
        onMore && <IconButton icon="ellipsis" label={t('common.more')} onPress={onMore} size="sm" />
      }
      onPress={onPress}
      lines={2}
    />
  )
}

/** The sessions of one project: existing ones continue (from any client), a new one starts. */
export function SessionsScreen({
  install,
  status,
  project,
  sessions,
  loading = false,
  query = '',
  onBack,
  onOpen,
  onMore,
  onNew,
  onQuery,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  project: BcProject
  sessions: BcSession[]
  loading?: boolean
  query?: string
  onBack?: () => void
  onOpen?: (id: string) => void
  onMore?: (id: string) => void
  onNew?: () => void
  onQuery?: (text: string) => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  const empty = !loading && sessions.length === 0
  return (
    <MachineShell
      install={install}
      status={status}
      title={project.name}
      subtitle={project.branch ? `⎇ ${project.branch} · ${install.name}` : install.name}
      onBack={onBack}
      onRepair={onRepair}
      scroll={!empty}
      actions={
        <IconButton icon="plus" label={t('buffcode.newSession')} onPress={onNew} disabled={!live} />
      }
    >
      {empty && !query ? (
        <EmptyState
          icon="messageSquare"
          title={t('buffcode.noSessions')}
          text={t('buffcode.noSessionsText')}
          action={
            live ? { label: t('buffcode.newSession'), icon: 'plus', onPress: onNew } : undefined
          }
        />
      ) : (
        <View style={{ paddingTop: theme.space(3), gap: theme.space(3) }}>
          <Gutter>
            <Input
              icon="search"
              placeholder={t('buffcode.searchSessions')}
              value={query}
              onChangeText={onQuery}
            />
          </Gutter>
          {loading ? (
            skeletonRows(theme, 5)
          ) : empty ? (
            <Text tone="muted" align="center" style={{ padding: theme.space(6) }}>
              {t('buffcode.noResults')}
            </Text>
          ) : (
            GROUPS.map((group) => {
              const items = sessions.filter((s) => s.group === group)
              if (items.length === 0) return null
              return (
                <Gutter key={group} gap={theme.space(2)}>
                  <Eyebrow>{t(GROUP_KEY[group])}</Eyebrow>
                  <RowGroup>
                    {items.map((session) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        onPress={() => onOpen?.(session.id)}
                        onMore={live && onMore ? () => onMore(session.id) : undefined}
                      />
                    ))}
                  </RowGroup>
                </Gutter>
              )
            })
          )}
        </View>
      )}
    </MachineShell>
  )
}

/** The «…» of a session row: rename, export, delete. */
export function SessionActionsSheet({
  session,
  onRename,
  onExport,
  onDelete,
  onClose,
}: {
  session: BcSession
  onRename?: () => void
  onExport?: () => void
  onDelete?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={session.title} onClose={onClose}>
      <RowGroup>
        <Row icon="pencil" title={t('common.rename')} onPress={onRename} />
        <Row icon="download" title={t('buffcode.actExport')} onPress={onExport} />
        <Row icon="trash" title={t('common.delete')} onPress={onDelete} destructive />
      </RowGroup>
    </Sheet>
  )
}

/** «Delete the session?» — it is deleted on the computer, not only hidden on the phone. */
export function DeleteSessionSheet({
  session,
  onConfirm,
  onClose,
}: {
  session: BcSession
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('buffcode.deleteSession')}
      text={t('buffcode.deleteSessionText', { name: session.title })}
      confirmLabel={t('common.delete')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
