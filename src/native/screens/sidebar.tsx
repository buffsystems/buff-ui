/** @jsxRuntime automatic */
/*
  The navigation drawer (#629, owner's review): the sidebar of the app, opened from the
  hamburger in every top bar. Installs with their status, then what the current install
  offers — the cabinet's sections or the machine's projects and recent sessions — and the
  app-level rows at the bottom. The bottom tab bar stays for quick switching inside an install.
*/
import '../strings/sidebar.ts'
import { Pressable, ScrollView, View, type ViewStyle } from 'react-native'
import { Avatar } from '../Avatar.tsx'
import { Badge, StatusDot } from '../Badge.tsx'
import { Button, IconButton } from '../Button.tsx'
import { Icon } from '../Icon.tsx'
import type { IconName } from '../icons.ts'
import type { Install, InstallKind } from '../model.ts'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'
import { KIND_ICON as PROJECT_ICON, KIND_LABEL as PROJECT_LABEL } from './cabinet/project-pick.tsx'
import type { ProjectRef } from './cabinet/model.ts'
import { statusLabel, statusTone } from './status.tsx'

const KIND_ICON: Record<InstallKind, IconName> = {
  saas: 'globe',
  ce: 'server',
  ee: 'shieldCheck',
  machine: 'cpu',
}

export interface SidebarSection {
  id: string
  label: string
  icon: IconName
  badge?: number
}

export interface SidebarSession {
  id: string
  title: string
  running?: boolean
  attention?: boolean
}

export interface SidebarProject {
  id: string
  name: string
  sessions: SidebarSession[]
}

/** What the drawer lists under the current install. */
export type SidebarContent =
  | {
      kind: 'cabinet'
      sections: SidebarSection[]
      selected?: string
      /** The open section's project (#696): picked here, not on the page. */
      project?: ProjectRef
    }
  | {
      kind: 'machine'
      projects: SidebarProject[]
      selectedSession?: string
      totalSessions: number
      /** The machine's places (#654): projects, automations, workflows; `place` is the open one. */
      place?: 'projects' | 'automations' | 'workflows'
    }

/** One row of the drawer: an icon or avatar, a label, a badge or mark; `active` is the current place. */
function DrawerRow({
  leading,
  icon,
  label,
  trailing,
  active = false,
  indent = false,
  onPress,
}: {
  leading?: React.ReactNode
  icon?: IconName
  label: string
  trailing?: React.ReactNode
  active?: boolean
  indent?: boolean
  /** Without it the row is a plain label: a heading row whose `trailing` may hold a button. */
  onPress?: () => void
}) {
  const theme = useTheme()
  const c = theme.colors
  const frame = (pressed: boolean): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space(3),
    minHeight: theme.touch,
    paddingLeft: indent ? theme.space(10) : theme.space(4),
    paddingRight: theme.space(3),
    borderRadius: theme.radius.md,
    backgroundColor: active ? c.accent : pressed ? c.muted : 'transparent',
  })
  const body = (
    <>
      {leading ??
        (icon && (
          <Icon name={icon} size={20} color={active ? c.accentForeground : c.mutedForeground} />
        ))}
      <Text
        variant="label"
        numberOfLines={1}
        style={{ flex: 1, color: active ? c.accentForeground : c.foreground }}
      >
        {label}
      </Text>
      {trailing}
    </>
  )
  // A row that goes nowhere is no button — so a button in its `trailing` is not nested in one.
  if (!onPress) return <View style={frame(false)}>{body}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => frame(pressed)}
    >
      {body}
    </Pressable>
  )
}

function Heading({ children }: { children: string }) {
  const theme = useTheme()
  return (
    <Text
      variant="caption"
      tone="muted"
      style={{
        paddingHorizontal: theme.space(4),
        paddingTop: theme.space(4),
        paddingBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {children}
    </Text>
  )
}

export function SidebarDrawer({
  installs,
  currentId,
  content,
  user,
  notifications = 0,
  onSelectInstall,
  onSelectSection,
  onSelectSession,
  onNewSession,
  onAllSessions,
  onHome,
  onNotifications,
  onSettings,
  onAddInstall,
  onPickProject,
  onClose,
}: {
  installs: Install[]
  currentId?: string
  content?: SidebarContent
  user?: string
  notifications?: number
  onSelectInstall?: (id: string) => void
  onSelectSection?: (id: string) => void
  onSelectSession?: (projectId: string, sessionId: string) => void
  onNewSession?: (projectId: string) => void
  onAllSessions?: () => void
  /** The footer rows: required, so no route can leave one of them dead (#696). */
  onHome: () => void
  onNotifications: () => void
  onSettings: () => void
  onAddInstall: () => void
  /** Another project for the open section. */
  onPickProject?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const current = installs.find((i) => i.id === currentId)
  return (
    <View
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row' }}
    >
      <View
        accessibilityViewIsModal
        style={{
          width: '84%',
          maxWidth: 340,
          backgroundColor: c.background,
          borderRightWidth: 1,
          borderRightColor: c.border,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.space(2),
            paddingLeft: theme.space(4),
            paddingRight: theme.space(2),
            height: 52,
            borderBottomWidth: 1,
            borderBottomColor: c.border,
          }}
        >
          <Icon name="brain" size={20} color={c.primary} strokeWidth={2.25} />
          <Text variant="heading" style={{ flex: 1 }} numberOfLines={1}>
            {user ?? 'Buff'}
          </Text>
          <IconButton icon="x" label={t('common.close')} onPress={onClose} size="sm" />
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: theme.space(2),
            paddingBottom: theme.space(2),
          }}
        >
          <Heading>{t('sidebar.installs')}</Heading>
          {installs.map((install) => {
            const live = install.status.kind === 'online'
            return (
              <DrawerRow
                key={install.id}
                leading={<Avatar name={install.name} icon={KIND_ICON[install.kind]} size={28} />}
                label={install.name}
                active={install.id === currentId}
                trailing={
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {install.attention > 0 && (
                      <Badge tone={live ? 'crit' : 'neutral'}>{install.attention}</Badge>
                    )}
                    <StatusDot tone={statusTone(install.status)} pulse={live} />
                  </View>
                }
                onPress={() => onSelectInstall?.(install.id)}
              />
            )
          })}
          {current && content?.kind === 'cabinet' && (
            <>
              <Heading>{t('sidebar.sections')}</Heading>
              {content.sections.map((s) => (
                <DrawerRow
                  key={s.id}
                  icon={s.icon}
                  label={s.label}
                  active={s.id === content.selected}
                  trailing={s.badge ? <Badge tone="crit">{s.badge}</Badge> : undefined}
                  onPress={() => onSelectSection?.(s.id)}
                />
              ))}
              {content.project && (
                <>
                  <Heading>{t(PROJECT_LABEL[content.project.kind ?? 'dev'])}</Heading>
                  <DrawerRow
                    icon={PROJECT_ICON[content.project.kind ?? 'dev']}
                    label={content.project.name}
                    trailing={<Icon name="chevronDown" size={18} color={c.mutedForeground} />}
                    onPress={onPickProject}
                  />
                </>
              )}
            </>
          )}
          {current && content?.kind === 'machine' && (
            <>
              {(
                [
                  ['projects', 'folderGit', 'buffcode.projects'],
                  ['automations', 'calendar', 'buffcode.automations'],
                  ['workflows', 'workflow', 'buffcode.workflows'],
                ] as const
              ).map(([id, icon, key]) => (
                <DrawerRow
                  key={id}
                  icon={icon}
                  label={t(key)}
                  active={content.place === id}
                  onPress={() => onSelectSection?.(id)}
                />
              ))}
              <Heading>{t('sidebar.projects')}</Heading>
              {content.projects.map((project) => (
                <View key={project.id}>
                  <DrawerRow
                    icon="folderGit"
                    label={project.name}
                    trailing={
                      <IconButton
                        icon="plus"
                        label={t('sidebar.newSession')}
                        size="sm"
                        onPress={() => onNewSession?.(project.id)}
                      />
                    }
                  />
                  {project.sessions.map((s) => (
                    <DrawerRow
                      key={s.id}
                      indent
                      label={s.title}
                      active={s.id === content.selectedSession}
                      trailing={
                        s.running ? (
                          <StatusDot tone="info" pulse />
                        ) : s.attention ? (
                          <StatusDot tone="crit" />
                        ) : undefined
                      }
                      onPress={() => onSelectSession?.(project.id, s.id)}
                    />
                  ))}
                </View>
              ))}
              <View style={{ paddingHorizontal: theme.space(2), paddingTop: theme.space(2) }}>
                <Button variant="ghost" size="sm" leadingIcon="history" onPress={onAllSessions}>
                  {t('sidebar.moreSessions', { n: content.totalSessions })}
                </Button>
              </View>
            </>
          )}
          {current && current.status.kind !== 'online' && (
            <Text
              variant="caption"
              tone="muted"
              style={{ paddingHorizontal: theme.space(4), paddingTop: theme.space(2) }}
            >
              {statusLabel(t, current.status)}
            </Text>
          )}
        </ScrollView>
        <View style={{ borderTopWidth: 1, borderTopColor: c.border, padding: theme.space(2) }}>
          <DrawerRow icon="inbox" label={t('sidebar.home')} onPress={onHome} />
          <DrawerRow
            icon="bell"
            label={t('sidebar.notifications')}
            trailing={notifications ? <Badge tone="crit">{notifications}</Badge> : undefined}
            onPress={onNotifications}
          />
          <DrawerRow icon="settings" label={t('sidebar.settings')} onPress={onSettings} />
          <DrawerRow icon="plus" label={t('sidebar.addInstall')} onPress={onAddInstall} />
        </View>
      </View>
      <Pressable
        accessibilityLabel={t('common.close')}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(5, 8, 16, 0.5)' }}
      />
    </View>
  )
}
