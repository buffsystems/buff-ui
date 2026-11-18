/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Avatar } from '../../Avatar.tsx'
import { Badge } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { SectionHeader } from '../../Card.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Segmented } from '../../Field.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { BcProject, BcSession } from './model.ts'
import { ProjectSortButton, ProjectSortSheet, type ProjectSort } from './project-sort.tsx'
import { Recents } from './recents.tsx'
import { Gutter, isLive, MachineShell, skeletonRows } from './shell.tsx'

/** One project the service knows: its directory, branch and how many sessions it has. */
export function ProjectRow({
  project,
  disabled = false,
  onPress,
}: {
  project: BcProject
  disabled?: boolean
  onPress?: () => void
}) {
  const t = useT()
  const branch = project.branch ? `⎇ ${project.branch} · ` : ''
  return (
    <Row
      leading={<Avatar name={project.name} icon="folderGit" />}
      title={project.name}
      subtitle={`${branch}${t('buffcode.sessionsCount', { n: project.sessions })}${project.lastActive ? ` · ${project.lastActive}` : ''}`}
      trailing={project.lastActive ? undefined : <Badge tone="neutral">{t('common.empty')}</Badge>}
      chevron
      onPress={onPress}
      disabled={disabled}
    />
  )
}

export type { ProjectSort }

/** What the machine's main screen lists (#938): recent sessions of all projects, or the projects. */
export type ProjectsView = 'recent' | 'projects'

/**
 * The main screen of a Buff Code machine. With `onView` (#938) it has two views: «Recent» — the
 * sessions of all the projects in one list with a search, the ones that wait for the person and
 * the running ones first, — and «Projects», in the order the person picked. Without it — the
 * projects alone, as the service reports them.
 */
export function ProjectsScreen({
  install,
  status,
  projects,
  loading = false,
  view: asked = 'projects',
  onView,
  sort = 'recent',
  onSort,
  recents = [],
  recentsLoading = false,
  query = '',
  onQuery,
  onOpen,
  onOpenSession,
  onMoreRecents,
  onNewSession,
  onMenu,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  /** The projects, already in the picked order. */
  projects: BcProject[]
  loading?: boolean
  view?: ProjectsView
  onView?: (view: ProjectsView) => void
  sort?: ProjectSort
  onSort?: (sort: ProjectSort) => void
  /** The recent sessions that match the search, the latest first; each names its project. */
  recents?: BcSession[]
  recentsLoading?: boolean
  query?: string
  onQuery?: (text: string) => void
  onOpen?: (id: string) => void
  onOpenSession?: (projectId: string, id: string) => void
  /** More recent sessions match than `recents` holds: «Show more» asks for the next ones. */
  onMoreRecents?: () => void
  onNewSession?: () => void
  onMenu?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [sorting, setSorting] = useState(false)
  const live = isLive(status)
  const empty = !loading && projects.length === 0
  const view = onView ? asked : 'projects'
  return (
    <>
      <MachineShell
        install={install}
        status={status}
        title={t(view === 'recent' ? 'buffcode.recent' : 'buffcode.projects')}
        onMenu={onMenu}
        onRepair={onRepair}
        scroll={!empty}
        actions={
          <IconButton
            icon="plus"
            label={t('buffcode.newSession')}
            onPress={onNewSession}
            disabled={!live || empty}
          />
        }
      >
        {empty ? (
          <EmptyState
            icon="folderOpen"
            title={t('buffcode.noProjects')}
            text={t('buffcode.noProjectsText')}
          />
        ) : (
          <>
            {onView && (
              <View
                accessibilityLabel={t('buffcode.view')}
                style={{ paddingHorizontal: theme.space(4), paddingTop: theme.space(3) }}
              >
                <Segmented
                  options={[
                    { id: 'recent', label: t('buffcode.recent') },
                    { id: 'projects', label: t('buffcode.projects') },
                  ]}
                  value={view}
                  onChange={(id) => onView(id as ProjectsView)}
                />
              </View>
            )}
            {view === 'recent' ? (
              <Recents
                sessions={recents}
                loading={loading || recentsLoading}
                query={query}
                onQuery={onQuery}
                onOpen={onOpenSession}
                onMore={onMoreRecents}
                onNew={live ? onNewSession : undefined}
              />
            ) : loading ? (
              <View style={{ paddingTop: theme.space(4) }}>{skeletonRows(theme, 4)}</View>
            ) : (
              <>
                <SectionHeader
                  title={t('buffcode.projects')}
                  count={projects.length}
                  action={
                    onSort && <ProjectSortButton sort={sort} onPress={() => setSorting(true)} />
                  }
                />
                <Gutter>
                  <RowGroup>
                    {projects.map((project) => (
                      <ProjectRow
                        key={project.id}
                        project={project}
                        onPress={() => onOpen?.(project.id)}
                      />
                    ))}
                  </RowGroup>
                  <Text variant="caption" tone="muted">
                    {t('buffcode.noProjectsText')}
                  </Text>
                </Gutter>
              </>
            )}
          </>
        )}
      </MachineShell>
      {sorting && (
        <ProjectSortSheet sort={sort} onSort={onSort} onClose={() => setSorting(false)} />
      )}
    </>
  )
}
