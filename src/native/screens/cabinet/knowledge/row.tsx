/** @jsxRuntime automatic */
/*
  One knowledge entry in the list (#629): its badges, description, meta line and actions.
*/
import { Pressable, View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import type { Translate } from '../../../i18n.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { KnowledgeEntry } from './model.ts'

export function typeLabel(t: Translate, type: KnowledgeEntry['type']): string {
  return t(`kb.type${type[0].toUpperCase()}${type.slice(1)}`)
}

/** The badges of an entry, in the web's order. */
export function entryBadges(t: Translate, e: KnowledgeEntry): { label: string; warn?: boolean }[] {
  return [
    { label: typeLabel(t, e.type) },
    { label: e.project ?? t('kb.org') },
    ...(e.task ? [{ label: t('kb.badgeTask', { n: e.task }) }] : []),
    ...(e.pinned ? [{ label: t('kb.badgePinned') }] : []),
    ...(e.permanent ? [{ label: t('kb.badgePermanent') }] : []),
    ...(e.needsReview ? [{ label: t('kb.badgeReview'), warn: true }] : []),
    ...(e.archived ? [{ label: t('kb.badgeArchived') }] : []),
  ]
}

export function KnowledgeRow({
  entry,
  canEdit = false,
  disabled = false,
  onOpen,
  onEdit,
  onTogglePin,
  onReviewed,
  onArchive,
  onRestore,
}: {
  entry: KnowledgeEntry
  canEdit?: boolean
  disabled?: boolean
  onOpen?: () => void
  onEdit?: () => void
  onTogglePin?: () => void
  onReviewed?: () => void
  onArchive?: () => void
  onRestore?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const author = entry.authorAi ? `${t('kb.ai')} · ${entry.author}` : entry.author
  // The list shows the kind, where it applies and what needs a look; the entry shows the rest.
  const badges = entryBadges(t, entry).filter((b, i) => i < 2 || b.warn)
  // The entry opens from its body; its buttons sit under it, never inside the press (#692).
  return (
    <Card padded={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={entry.title}
        onPress={onOpen}
        style={({ pressed }) => ({
          gap: theme.space(2),
          padding: theme.space(4),
          paddingBottom: canEdit ? theme.space(2) : theme.space(4),
          backgroundColor: pressed ? theme.colors.muted : 'transparent',
        })}
      >
        <Text variant="label" style={{ fontSize: 15, lineHeight: 20 }}>
          {entry.title}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {badges.map((b) => (
            <Badge key={b.label} tone={b.warn ? 'warn' : 'neutral'}>
              {b.label}
            </Badge>
          ))}
        </View>
        <Text variant="caption" tone="fg2" numberOfLines={2}>
          {entry.description}
        </Text>
        {entry.needsReview && entry.reviewNote && (
          <Text variant="caption" tone="warning">
            {entry.reviewNote}
          </Text>
        )}
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {entry.archived
            ? t('kb.archivedLine', {
                by: entry.archived.by,
                when: entry.archived.when,
                reason: entry.archived.reason,
              })
            : `${author} · ${entry.name} · ${t('kb.changed', { when: entry.updated })}`}
        </Text>
      </Pressable>
      {canEdit && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: theme.space(2),
            paddingBottom: 4,
          }}
        >
          {entry.archived ? (
            <Button size="sm" leadingIcon="refreshCw" disabled={disabled} onPress={onRestore}>
              {t('kb.restore')}
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                leadingIcon={entry.pinned ? 'bellOff' : 'bell'}
                disabled={disabled}
                onPress={onTogglePin}
              >
                {entry.pinned ? t('kb.hideNow') : t('kb.showNow')}
              </Button>
              {entry.needsReview && (
                <Button
                  size="sm"
                  variant="ghost"
                  leadingIcon="check"
                  disabled={disabled}
                  onPress={onReviewed}
                >
                  {t('kb.reviewed')}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                leadingIcon="pencil"
                disabled={disabled}
                onPress={onEdit}
              >
                {t('kb.edit')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leadingIcon="archive"
                disabled={disabled}
                onPress={onArchive}
              >
                {t('kb.toArchive')}
              </Button>
            </>
          )}
        </View>
      )}
    </Card>
  )
}
