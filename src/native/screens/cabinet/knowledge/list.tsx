/** @jsxRuntime automatic */
/*
  The knowledge base (#629): active / archive, a search, the filter chips, the AI pass card
  and the entries — each with its badges and its actions.
*/
import { View } from 'react-native'
import { IconButton } from '../../../Button.tsx'
import { EmptyState } from '../../../Feedback.tsx'
import { Input, Segmented } from '../../../Field.tsx'
import { Chip, ChipRow } from '../../../Chip.tsx'
import type { InstallStatus, LoadFailure } from '../../../model.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import type { ProjectRef, ShellProps } from '../model.ts'
import { inProject, ListSkeleton, LoadError, MoreButton } from '../parts.tsx'
import { PromptLoadLine, type PromptLoad } from './load.tsx'
import { CabinetShell } from '../shell.tsx'
import {
  KNOWLEDGE_TYPES,
  type KnowledgeEntry,
  type KnowledgeFilter,
  type KnowledgePass,
} from './model.ts'
import { KnowledgePassCard } from './pass.tsx'
import { KnowledgeRow, typeLabel } from './row.tsx'

export function KnowledgeListScreen({
  shell,
  status,
  entries,
  projects = [],
  view = 'active',
  query = '',
  filters = [],
  pass,
  lastManual,
  loading = false,
  error = false,
  canAdd = true,
  canEdit = true,
  canRefresh = false,
  onView,
  onFilter,
  onAdd,
  onOpen,
  onEdit,
  onTogglePin,
  onReviewed,
  onArchive,
  onRestore,
  onRefresh,
  onRetry,
  onShowMore,
  loadingMore = false,
  onQuery,
  onPause,
  onResume,
  reloading,
  onReload,
  project,
  load,
}: {
  shell: ShellProps
  status: InstallStatus
  entries: KnowledgeEntry[]
  projects?: string[]
  view?: 'active' | 'archive'
  query?: string
  filters?: KnowledgeFilter[]
  pass?: KnowledgePass
  lastManual?: string
  loading?: boolean
  error?: LoadFailure
  canAdd?: boolean
  canEdit?: boolean
  canRefresh?: boolean
  onView?: (v: 'active' | 'archive') => void
  onFilter?: (f: KnowledgeFilter) => void
  onAdd?: () => void
  onOpen?: (id: string) => void
  onEdit?: (id: string) => void
  onTogglePin?: (id: string) => void
  onReviewed?: (id: string) => void
  onArchive?: (id: string) => void
  onRestore?: (id: string) => void
  onRefresh?: () => void
  onRetry?: () => void
  /** Reads the next page (#739); absent on the last one. */
  onShowMore?: () => void
  loadingMore?: boolean
  onQuery?: (text: string) => void
  onPause?: () => void
  onResume?: () => void
  /** Pull to refresh the list (`onRefresh` starts a knowledge pass). */
  reloading?: boolean
  onReload?: () => void
  project?: ProjectRef
  /** What the base adds to every run of the project. */
  load?: PromptLoad
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const active = entries.filter((e) => !e.archived)
  const archived = entries.filter((e) => e.archived)
  const shown = view === 'active' ? active : archived
  const chips: { id: KnowledgeFilter; label: string }[] = [
    { id: 'org', label: t('kb.org') },
    ...projects.map((p) => ({ id: `project:${p}` as KnowledgeFilter, label: p })),
    ...KNOWLEDGE_TYPES.map((k) => ({ id: `type:${k}` as KnowledgeFilter, label: typeLabel(t, k) })),
    { id: 'human', label: t('kb.byHuman') },
    { id: 'ai', label: t('kb.byAi') },
    { id: 'pinned', label: t('kb.pinned') },
    { id: 'review', label: t('kb.needsReview') },
    { id: 'task', label: t('kb.taskEntries') },
  ]
  return (
    <CabinetShell
      shell={shell}
      section="knowledge"
      subtitle={inProject(project)}
      refreshing={reloading}
      onRefresh={onReload}
      actions={
        <IconButton icon="plus" label={t('kb.add')} onPress={onAdd} disabled={!live || !canAdd} />
      }
    >
      <InstallBanner status={status} />
      <View
        style={{
          paddingHorizontal: theme.space(4),
          paddingTop: theme.space(2),
          gap: theme.space(3),
        }}
      >
        <KnowledgePassCard
          pass={pass}
          canRefresh={canRefresh}
          lastManual={lastManual}
          disabled={!live}
          onRefresh={onRefresh}
          onPause={onPause}
          onResume={onResume}
        />
        {load && load.total > 0 && <PromptLoadLine load={load} />}
        <Segmented
          value={view}
          onChange={(id) => onView?.(id as 'active' | 'archive')}
          options={[
            { id: 'active', label: `${t('kb.active')} ${active.length}` },
            { id: 'archive', label: `${t('kb.archive')} ${archived.length}` },
          ]}
        />
        <Input value={query} placeholder={t('kb.search')} icon="search" onChangeText={onQuery} />
      </View>
      <ChipRow>
        {chips.map((c) => (
          <Chip key={c.id} selected={filters.includes(c.id)} onPress={() => onFilter?.(c.id)}>
            {c.label}
          </Chip>
        ))}
      </ChipRow>
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError error={error} onRetry={onRetry} />
      ) : shown.length === 0 ? (
        filters.length > 0 || query ? (
          <Text tone="muted" align="center" style={{ padding: theme.space(6) }}>
            {t('kb.filteredEmpty')}
          </Text>
        ) : (
          <EmptyState
            icon="bookOpen"
            title={view === 'active' ? t('kb.emptyTitle') : t('kb.archiveEmpty')}
            text={view === 'active' ? t('kb.emptyText') : t('kb.archiveEmptyText')}
            action={
              view === 'active' && live && canAdd
                ? { label: t('kb.add'), icon: 'plus', onPress: onAdd }
                : undefined
            }
          />
        )
      ) : (
        <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
          {shown.map((e) => (
            <KnowledgeRow
              key={e.id}
              entry={e}
              canEdit={canEdit}
              disabled={!live}
              onOpen={() => onOpen?.(e.id)}
              onEdit={() => onEdit?.(e.id)}
              onTogglePin={() => onTogglePin?.(e.id)}
              onReviewed={() => onReviewed?.(e.id)}
              onArchive={() => onArchive?.(e.id)}
              onRestore={() => onRestore?.(e.id)}
            />
          ))}
          {onShowMore && <MoreButton onPress={onShowMore} loading={loadingMore} />}
        </View>
      )}
    </CabinetShell>
  )
}
