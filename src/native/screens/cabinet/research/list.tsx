import type { LoadFailure } from '../../../model.ts'
/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Callout, EmptyState } from '../../../Feedback.tsx'
import { Input } from '../../../Field.tsx'
import type { Attachment, InstallStatus } from '../../../model.ts'
import { RowGroup } from '../../../Row.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { ConfirmSheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ThreadRow } from '../ask/list.tsx'
import { AttachmentRow } from '../attachments.tsx'
import type { ProjectRef, ShellProps } from '../model.ts'
import {
  CreateButton,
  inProject,
  ListHeader,
  ListSkeleton,
  LoadError,
  MoreButton,
} from '../parts.tsx'
import { CabinetShell } from '../shell.tsx'
import type { ResearchRow } from './model.ts'

/** Deep research: every research of the project, newest first. */
export function ResearchListScreen({
  shell,
  status,
  items,
  loading = false,
  error = false,
  canCreate = true,
  canManage = () => true,
  onOpen,
  onActions,
  onNew,
  onRetry,
  onShowMore,
  loadingMore = false,
  mine,
  onMine,
  project,
  refreshing,
  onRefresh,
}: {
  shell: ShellProps
  status: InstallStatus
  items: ResearchRow[]
  loading?: boolean
  error?: LoadFailure
  canCreate?: boolean
  /** May rename or delete this one (#666): its author or a member with the right. */
  canManage?: (thread: ResearchRow) => boolean
  onOpen?: (id: string) => void
  onActions?: (id: string) => void
  onNew?: () => void
  onRetry?: () => void
  /** Reads the next page (#739); absent on the last one. */
  onShowMore?: () => void
  loadingMore?: boolean
  mine?: boolean
  onMine?: (mine: boolean) => void
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
      section="research"
      subtitle={inProject(project, t('research.list'))}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <InstallBanner status={status} />
      <ListHeader mine={mine} onMine={onMine} />
      {canCreate && onNew && (
        <CreateButton label={t('research.new')} onPress={onNew} disabled={!live} />
      )}
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError error={error} text={t('research.listError')} onRetry={onRetry} />
      ) : items.length === 0 ? (
        <EmptyState icon="microscope" title={t('research.empty')} text={t('research.emptyText')} />
      ) : (
        <View style={{ paddingHorizontal: theme.space(4) }}>
          <RowGroup>
            {items.map((r) => (
              <ThreadRow
                key={r.id}
                thread={{ ...r, status: r.status === 'researching' ? 'answering' : r.status }}
                fallbackTitle={t('research.fallbackTitle')}
                onPress={() => onOpen?.(r.id)}
                onActions={live && onActions && canManage(r) ? () => onActions(r.id) : undefined}
              />
            ))}
          </RowGroup>
          {onShowMore && <MoreButton onPress={onShowMore} loading={loadingMore} />}
        </View>
      )}
    </CabinetShell>
  )
}

/** «New research»: the question, five rows tall. */
export function NewResearchScreen({
  status,
  place,
  space = false,
  text = '',
  canCreate = true,
  demo = false,
  busy = false,
  error,
  staged = [],
  onBack,
  onStart,
  onText,
  onAttach,
  onRemoveStaged,
}: {
  status: InstallStatus
  place: string
  /** The author's files for the question (#27), and how to add and drop one. */
  staged?: Attachment[]
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  /** A space (documents) rather than a project (code). */
  space?: boolean
  text?: string
  canCreate?: boolean
  demo?: boolean
  busy?: boolean
  error?: string
  onBack?: () => void
  onStart?: () => void
  /** The question as typed. */
  onText?: (text: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const disabled = status.kind !== 'online' || busy || !canCreate
  const k = space ? 'Space' : 'Project'
  return (
    <>
      <TopBar title={t('research.new')} subtitle={place} onBack={onBack} />
      <Screen
        padded
        footer={
          <View style={{ padding: theme.space(3) }}>
            <Button
              variant="primary"
              leadingIcon="microscope"
              block
              loading={busy}
              disabled={disabled || (text.trim() === '' && staged.length === 0)}
              onPress={onStart}
            >
              {t('research.start')}
            </Button>
          </View>
        }
      >
        <InstallBanner status={status} />
        {!canCreate && (
          <Callout tone="neutral">
            {demo ? t('research.noCreateDemo') : t('research.noCreateRight')}
          </Callout>
        )}
        <Text variant="title">{t('research.titleNew')}</Text>
        <Text tone="fg2">{t(`research.intro${k}`)}</Text>
        <Input
          value={text}
          placeholder={t(`research.placeholder${k}`)}
          rows={5}
          editable={!disabled}
          invalid={!!error}
          onChangeText={onText}
        />
        {error && (
          <Text variant="caption" tone="destructive">
            {error}
          </Text>
        )}
        {staged.length > 0 && (
          <RowGroup title={t('cabinet.attachments')}>
            {staged.map((a) => (
              <AttachmentRow
                key={a.id}
                attachment={a}
                onRemove={() => onRemoveStaged?.(a.id)}
                disabled={disabled}
              />
            ))}
          </RowGroup>
        )}
        {onAttach && (
          <Button
            variant="ghost"
            leadingIcon="paperclip"
            onPress={onAttach}
            disabled={disabled || staged.length >= 3}
            style={{ alignSelf: 'flex-start' }}
          >
            {t('cabinet.attach')}
          </Button>
        )}
      </Screen>
    </>
  )
}

export function DeleteResearchSheet({
  onConfirm,
  onClose,
}: {
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('research.deleteTitle')}
      text={t('research.deleteText')}
      confirmLabel={t('common.delete')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
