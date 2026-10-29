/** @jsxRuntime automatic */
/*
  Where a section's list stands and how to change it (#695): the project, repository or
  knowledge space as a field over the list, and the sheet that picks another — searched by
  name and grouped by kind, an organisation may hold dozens.
*/
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { Row, RowGroup, SectionTitle } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { ProjectKind, ProjectRef } from './model.ts'
import { ListSkeleton } from './parts.tsx'

const KINDS: ProjectKind[] = ['dev', 'git', 'space']
export const KIND_ICON: Record<ProjectKind, IconName> = {
  dev: 'folderGit',
  git: 'gitBranch',
  space: 'bookOpen',
}
export const KIND_LABEL = {
  dev: 'cabinet.kindDev',
  git: 'cabinet.kindGit',
  space: 'cabinet.kindSpace',
} as const
const GROUP_LABEL = {
  dev: 'cabinet.groupDev',
  git: 'cabinet.groupGit',
  space: 'cabinet.groupSpace',
} as const
/** Up to this many the list is short enough to scan; past it a search field leads the sheet. */
const SEARCH_FROM = 8

/** Only the projects whose name holds the query, case aside. */
export function matchProjects(projects: ProjectRef[], query: string): ProjectRef[] {
  const q = query.trim().toLowerCase()
  return q ? projects.filter((p) => p.name.toLowerCase().includes(q)) : projects
}

/** The list's context as a field (#695): its kind, its name and a chevron — «you are here, tap
 *  to change»; a blue word alone was not read as either. */
export function ProjectLink({ project, onPress }: { project: ProjectRef; onPress?: () => void }) {
  const t = useT()
  const theme = useTheme()
  const kind = project.kind ?? 'dev'
  return (
    <View style={{ paddingHorizontal: theme.space(4) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('cabinet.contextIs', {
          kind: t(KIND_LABEL[kind]),
          name: project.name,
        })}
        onPress={onPress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(3),
          minHeight: theme.touch + 8,
          paddingHorizontal: theme.space(3),
          paddingVertical: theme.space(2),
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
          backgroundColor: pressed ? theme.colors.muted : theme.colors.card,
        })}
      >
        <Icon name={KIND_ICON[kind]} size={20} color={theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text variant="caption" tone="muted">
            {t(KIND_LABEL[kind])}
          </Text>
          <Text
            variant="label"
            style={{ fontSize: 15, lineHeight: 20, fontWeight: '600' }}
            numberOfLines={1}
          >
            {project.name}
          </Text>
        </View>
        <Icon name="chevronDown" size={18} color={theme.colors.mutedForeground} />
      </Pressable>
    </View>
  )
}

/** The install's projects to pick from (#644): searched by name, grouped by kind (#695). */
export function ProjectPickerSheet({
  projects,
  currentId,
  onSelect,
  onAdd,
  loading = false,
  onClose,
}: {
  projects: ProjectRef[]
  /** The install's projects are on their way (#696). */
  loading?: boolean
  currentId?: string
  onSelect?: (id: string) => void
  /** «New project», where the person may make one. */
  onAdd?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const shown = matchProjects(projects, query)
  const groups = KINDS.map((kind) => ({
    kind,
    items: shown.filter((p) => (p.kind ?? 'dev') === kind),
  })).filter((g) => g.items.length > 0)
  const titled = groups.length > 1
  return (
    <Sheet
      title={t('cabinet.pickProject')}
      onClose={onClose}
      footer={
        onAdd ? (
          <Button leadingIcon="plus" block onPress={onAdd}>
            {t('cabinet.newProject')}
          </Button>
        ) : undefined
      }
    >
      {projects.length > SEARCH_FROM && (
        <Input
          icon="search"
          value={query}
          onChangeText={setQuery}
          placeholder={t('cabinet.findProject')}
          autoCorrect={false}
          autoCapitalize="none"
        />
      )}
      {projects.length === 0 && loading && <ListSkeleton rows={3} />}
      {projects.length > 0 && shown.length === 0 && (
        <Text tone="muted" align="center" style={{ padding: theme.space(4) }}>
          {t('cabinet.noProjectMatch')}
        </Text>
      )}
      {groups.map((g) => (
        <View key={g.kind} style={{ gap: theme.space(2) }}>
          {titled && <SectionTitle>{t(GROUP_LABEL[g.kind])}</SectionTitle>}
          <RowGroup>
            {g.items.map((p) => (
              <Row
                key={p.id}
                icon={KIND_ICON[g.kind]}
                title={p.name}
                trailing={
                  p.id === currentId ? (
                    <Icon name="check" size={18} color={theme.colors.primary} />
                  ) : undefined
                }
                onPress={() => onSelect?.(p.id)}
              />
            ))}
          </RowGroup>
        </View>
      ))}
    </Sheet>
  )
}
