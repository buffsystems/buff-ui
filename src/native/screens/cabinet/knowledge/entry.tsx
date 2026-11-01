/** @jsxRuntime automatic */
/*
  One knowledge entry (#629): its badges, the review note, the body, who wrote and changed
  it; «Edit» for those allowed. And the archive sheet with its reason.
*/
import { View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button, IconButton } from '../../../Button.tsx'
import { Callout } from '../../../Feedback.tsx'
import { Field, Input } from '../../../Field.tsx'
import type { InstallStatus, LoadFailure } from '../../../model.ts'
import { Prose } from '../../../Prose.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Sheet } from '../../../Sheet.tsx'
import { Spinner } from '../../../Spinner.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import { entryBadges } from './row.tsx'
import type { KnowledgeEntry } from './model.ts'

export function KnowledgeEntryScreen({
  status,
  entry,
  loading = false,
  error = false,
  canEdit = true,
  onBack,
  onEdit,
  onRetry,
  onOpenTask,
}: {
  status: InstallStatus
  entry?: KnowledgeEntry
  loading?: boolean
  error?: LoadFailure
  canEdit?: boolean
  onBack?: () => void
  onEdit?: () => void
  onRetry?: () => void
  /** The task an entry is held on. */
  onOpenTask?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const meta = entry
    ? [
        t('kb.wroteBy', { by: entry.authorAi ? `${entry.author} (${t('kb.ai')})` : entry.author }),
        entry.updatedBy &&
          t('kb.changedBy', {
            by: entry.updatedByAi ? `${entry.updatedBy} (${t('kb.ai')})` : entry.updatedBy,
          }),
        t('kb.changed', { when: entry.updated }),
        t('kb.name', { name: entry.name }),
        entry.archived && t('kb.archivedReason', { reason: entry.archived.reason }),
      ].filter(Boolean)
    : []
  return (
    <>
      <TopBar
        title={entry?.title ?? t('cabinet.knowledgeFull')}
        onBack={onBack}
        actions={
          entry && canEdit && !entry.archived ? (
            <IconButton icon="pencil" label={t('kb.edit')} onPress={onEdit} disabled={!live} />
          ) : undefined
        }
      />
      <Screen>
        <InstallBanner status={status} />
        {loading ? (
          <ListSkeleton rows={4} />
        ) : error || !entry ? (
          <LoadError error={error} onRetry={onRetry} />
        ) : (
          <View
            style={{
              paddingHorizontal: theme.space(4),
              paddingTop: theme.space(2),
              gap: theme.space(3),
            }}
          >
            <Text variant="title">{entry.title}</Text>
            <Text tone="fg2">{entry.description}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {entryBadges(t, entry).map((b) => (
                <Badge key={b.label} tone={b.warn ? 'warn' : 'neutral'}>
                  {b.label}
                </Badge>
              ))}
            </View>
            {entry.task && onOpenTask && (
              <Button variant="ghost" leadingIcon="workflow" onPress={onOpenTask}>
                {t('kb.badgeTask', { n: entry.task })}
              </Button>
            )}
            {entry.needsReview && entry.reviewNote && (
              <Callout tone="warn">{entry.reviewNote}</Callout>
            )}
            {entry.body === undefined ? <Spinner /> : <Prose markdown={entry.body} />}
            <View
              style={{
                gap: 2,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                paddingTop: theme.space(3),
              }}
            >
              {meta.map((line) => (
                <Text key={String(line)} variant="caption" tone="muted">
                  {String(line)}
                </Text>
              ))}
            </View>
            {canEdit && !entry.archived && (
              <Button leadingIcon="pencil" block disabled={!live} onPress={onEdit}>
                {t('kb.edit')}
              </Button>
            )}
          </View>
        )}
      </Screen>
    </>
  )
}

/** «Archive the knowledge»: it stops reaching the model, with a reason. */
export function ArchiveSheet({
  reason = '',
  onReason,
  onConfirm,
  onClose,
}: {
  reason?: string
  onReason?: (text: string) => void
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet
      title={t('kb.archiveTitle')}
      onClose={onClose}
      footer={
        <>
          <Button variant="primary" leadingIcon="archive" block onPress={onConfirm}>
            {t('kb.archiveConfirm')}
          </Button>
          <Button variant="secondary" block onPress={onClose}>
            {t('common.cancel')}
          </Button>
        </>
      }
    >
      <Text tone="fg2">{t('kb.archiveText')}</Text>
      <Field label={t('kb.archiveReason')}>
        <Input
          value={reason}
          placeholder={t('kb.archiveReasonPlaceholder')}
          onChangeText={onReason}
        />
      </Field>
    </Sheet>
  )
}
