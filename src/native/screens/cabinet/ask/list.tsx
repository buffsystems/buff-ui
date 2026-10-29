/** @jsxRuntime automatic */
import type { ProjectRef } from '../model.ts'
import { View } from 'react-native'
import { IconButton } from '../../../Button.tsx'
import { EmptyState, Spinner } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { ConfirmSheet, Sheet } from '../../../Sheet.tsx'
import { Input } from '../../../Field.tsx'
import { Button } from '../../../Button.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import type { ShellProps } from '../model.ts'
import { CreateButton, inProject, ListHeader, ListSkeleton, LoadError } from '../parts.tsx'
import { CabinetShell } from '../shell.tsx'
import type { AskThreadRow } from './model.ts'

/** One thread of the list: a spinner while busy, a warning mark while it waits for you. */
export function ThreadRow({
  thread,
  fallbackTitle,
  onPress,
  onActions,
}: {
  thread: AskThreadRow
  fallbackTitle: string
  onPress?: () => void
  onActions?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const busy = thread.status === 'running' || thread.status === 'answering'
  const waiting = thread.status === 'waiting'
  const prefix = waiting ? `${t('ask.waitingYou')} · ` : busy ? `${t('ask.busy')} · ` : ''
  return (
    <Row
      leading={
        busy ? (
          <Spinner />
        ) : (
          <Icon
            name={waiting ? 'circleHelp' : 'fileText'}
            size={20}
            color={waiting ? theme.colors.warning : theme.colors.mutedForeground}
          />
        )
      }
      title={thread.title ?? fallbackTitle}
      subtitle={`${prefix}${thread.author} · ${thread.updated}`}
      actions={
        onActions && (
          <IconButton icon="ellipsis" label={t('devd.actions')} size="sm" onPress={onActions} />
        )
      }
      chevron
      onPress={onPress}
      lines={2}
    />
  )
}

/** Ask: every thread of the project, newest first. */
export function AskListScreen({
  shell,
  status,
  threads,
  loading = false,
  error = false,
  canCreate = true,
  canManage = () => true,
  onOpen,
  onActions,
  onNew,
  onRetry,
  mine,
  onMine,
  project,
  refreshing,
  onRefresh,
}: {
  shell: ShellProps
  status: InstallStatus
  threads: AskThreadRow[]
  loading?: boolean
  error?: boolean
  canCreate?: boolean
  /** May rename or delete this one (#666): its author or a member with the right. */
  canManage?: (thread: AskThreadRow) => boolean
  onOpen?: (id: string) => void
  onActions?: (id: string) => void
  onNew?: () => void
  onRetry?: () => void
  /** «Only mine» (the cabinet's Все / Мои); the switch shows when it can be changed. */
  mine?: boolean
  onMine?: (mine: boolean) => void
  /** The project the threads belong to: its name heads the screen; it is picked in the drawer. */
  project?: ProjectRef
  refreshing?: boolean
  onRefresh?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  return (
    <CabinetShell
      shell={shell}
      section="ask"
      subtitle={inProject(project, t('ask.threads'))}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <InstallBanner status={status} />
      <ListHeader mine={mine} onMine={onMine} />
      {canCreate && onNew && <CreateButton label={t('ask.new')} onPress={onNew} disabled={!live} />}
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError text={t('ask.listError')} onRetry={onRetry} />
      ) : threads.length === 0 ? (
        <EmptyState icon="circleHelp" title={t('ask.empty')} text={t('ask.emptyText')} />
      ) : (
        <View style={{ paddingHorizontal: theme.space(4) }}>
          <RowGroup>
            {threads.map((th) => (
              <ThreadRow
                key={th.id}
                thread={th}
                fallbackTitle={t('ask.fallbackTitle')}
                onPress={() => onOpen?.(th.id)}
                onActions={live && onActions && canManage(th) ? () => onActions(th.id) : undefined}
              />
            ))}
          </RowGroup>
        </View>
      )}
    </CabinetShell>
  )
}

/** The «⋯» of a thread: rename, delete. */
export function ThreadActionsSheet({
  onRename,
  onDelete,
  onClose,
}: {
  onRename?: () => void
  onDelete?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('devd.actions')} onClose={onClose}>
      <RowGroup>
        <Row icon="pencil" title={t('common.rename')} onPress={onRename} />
        <Row icon="trash" title={t('common.delete')} destructive onPress={onDelete} />
      </RowGroup>
    </Sheet>
  )
}

export function RenameSheet({
  value = '',
  onValue,
  onSave,
  onClose,
}: {
  value?: string
  onValue?: (text: string) => void
  onSave?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet
      title={t('common.rename')}
      onClose={onClose}
      footer={
        <Button variant="primary" block disabled={value.trim() === ''} onPress={onSave}>
          {t('common.save')}
        </Button>
      }
    >
      <Input
        value={value}
        placeholder={t('ask.renamePlaceholder')}
        autoFocus
        onChangeText={onValue}
      />
    </Sheet>
  )
}

export function DeleteThreadSheet({
  onConfirm,
  onClose,
}: {
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('ask.deleteTitle')}
      text={t('ask.deleteText')}
      confirmLabel={t('common.delete')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
