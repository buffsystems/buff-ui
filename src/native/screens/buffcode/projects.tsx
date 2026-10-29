/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Avatar } from '../../Avatar.tsx'
import { Badge } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { SectionHeader } from '../../Card.tsx'
import { EmptyState } from '../../Feedback.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { BcProject } from './model.ts'
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

/** The projects of a Buff Code machine — what its service reports. */
export function ProjectsScreen({
  install,
  status,
  projects,
  loading = false,
  onOpen,
  onNewSession,
  onMenu,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  projects: BcProject[]
  loading?: boolean
  onOpen?: (id: string) => void
  onNewSession?: () => void
  onMenu?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  const empty = !loading && projects.length === 0
  return (
    <MachineShell
      install={install}
      status={status}
      title={t('buffcode.projects')}
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
      ) : loading ? (
        <View style={{ paddingTop: theme.space(4) }}>{skeletonRows(theme, 4)}</View>
      ) : (
        <>
          <SectionHeader title={t('buffcode.projects')} count={projects.length} />
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
    </MachineShell>
  )
}
