/** @jsxRuntime automatic */
/*
  Search across the install (#644): the cabinet's search palette as a screen — one query, the
  kinds it looks in, the hits; a hit opens where it lives.
*/
import { View } from 'react-native'
import { Chip, ChipRow } from '../../../Chip.tsx'
import { EmptyState } from '../../../Feedback.tsx'
import { Input } from '../../../Field.tsx'
import type { IconName } from '../../../icons.ts'
import type { InstallStatus } from '../../../model.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'

export type SearchKind = 'task' | 'review' | 'audit' | 'research' | 'ask' | 'repo' | 'test'
export const SEARCH_KINDS: readonly SearchKind[] = [
  'task',
  'review',
  'audit',
  'research',
  'ask',
  'repo',
  'test',
]

const KIND_ICON: Record<SearchKind, IconName> = {
  task: 'workflow',
  review: 'gitPullRequest',
  audit: 'listChecks',
  research: 'microscope',
  ask: 'circleHelp',
  repo: 'folderGit',
  test: 'check',
}

export interface SearchHitRow {
  id: string
  kind: SearchKind
  title: string
  /** Where it lives: «org / project · #12». */
  subtitle?: string
}

export function SearchScreen({
  status,
  query,
  kinds = [],
  hits,
  loading = false,
  error = false,
  onQuery,
  onToggleKind,
  onOpen,
  onBack,
  onRetry,
}: {
  status: InstallStatus
  query: string
  /** The kinds the person narrowed to; none — every kind. */
  kinds?: SearchKind[]
  hits: SearchHitRow[]
  loading?: boolean
  error?: boolean
  onQuery?: (text: string) => void
  onToggleKind?: (kind: SearchKind) => void
  onOpen?: (id: string) => void
  onBack?: () => void
  onRetry?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const typed = query.trim().length >= 2
  return (
    <>
      <TopBar title={t('search.title')} onBack={onBack} />
      <Screen>
        <InstallBanner status={status} />
        <View style={{ paddingHorizontal: theme.space(4) }}>
          <Input
            icon="search"
            value={query}
            placeholder={t('search.placeholder')}
            autoFocus
            autoCapitalize="none"
            returnKeyType="search"
            onChangeText={onQuery}
          />
        </View>
        <ChipRow>
          {SEARCH_KINDS.map((k) => (
            <Chip key={k} selected={kinds.includes(k)} onPress={() => onToggleKind?.(k)}>
              {t(`search.kind${k[0].toUpperCase()}${k.slice(1)}`)}
            </Chip>
          ))}
        </ChipRow>
        {!typed ? (
          <EmptyState icon="search" title={t('search.hint')} />
        ) : loading ? (
          <ListSkeleton />
        ) : error ? (
          <LoadError text={t('search.error')} onRetry={onRetry} />
        ) : hits.length === 0 ? (
          <EmptyState icon="search" title={t('search.none')} />
        ) : (
          <View style={{ paddingHorizontal: theme.space(4) }}>
            <RowGroup>
              {hits.map((h) => (
                <Row
                  key={h.id}
                  icon={KIND_ICON[h.kind]}
                  title={h.title}
                  subtitle={[
                    t(`search.kind${h.kind[0].toUpperCase()}${h.kind.slice(1)}`),
                    h.subtitle,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  chevron
                  lines={2}
                  onPress={() => onOpen?.(h.id)}
                />
              ))}
            </RowGroup>
          </View>
        )}
      </Screen>
    </>
  )
}
