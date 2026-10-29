/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Avatar } from '../Avatar.tsx'
import { Badge, StatusDot } from '../Badge.tsx'
import { Button, IconButton } from '../Button.tsx'
import { Card, SectionHeader } from '../Card.tsx'
import { EmptyState } from '../Feedback.tsx'
import { Icon } from '../Icon.tsx'
import type { IconName } from '../icons.ts'
import type { AttentionItem, AttentionKind, Install, InstallKind } from '../model.ts'
import { Row, RowGroup } from '../Row.tsx'
import { Screen, TopBar } from '../Screen.tsx'
import { Sheet } from '../Sheet.tsx'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'
import { statusLabel, statusTone } from './status.tsx'
import { ListSkeleton } from './cabinet/parts.tsx'

const KIND_ICON: Record<InstallKind, IconName> = {
  saas: 'globe',
  ce: 'server',
  ee: 'shieldCheck',
  machine: 'cpu',
}
const KIND_KEY: Record<InstallKind, string> = {
  saas: 'home.kindSaas',
  ce: 'home.kindCe',
  ee: 'home.kindEe',
  machine: 'home.kindMachine',
}
const ATTENTION_ICON: Record<AttentionKind, IconName> = {
  gate: 'listChecks',
  question: 'circleHelp',
  permission: 'keyRound',
  bcQuestion: 'circleHelp',
  review: 'gitPullRequest',
  research: 'microscope',
  audit: 'shieldCheck',
}

/** What an install is, in one line: its kind, and for a machine where it is signed in. */
export function installDetail(
  t: (key: string, vars?: Record<string, string | number>) => string,
  install: Install,
): string {
  if (install.kind === 'machine') {
    return install.homeInstall
      ? t('home.signedInto', { install: install.homeInstall })
      : t('home.standalone')
  }
  return install.detail ?? t(KIND_KEY[install.kind])
}

/** One install in the Home list. */
export function InstallRow({ install, onPress }: { install: Install; onPress?: () => void }) {
  const t = useT()
  const live = install.status.kind === 'online'
  return (
    <Row
      leading={<Avatar name={install.name} icon={KIND_ICON[install.kind]} />}
      title={install.name}
      subtitle={`${installDetail(t, install)} · ${statusLabel(t, install.status)}`}
      trailing={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {install.attention > 0 && (
            <Badge tone={live ? 'crit' : 'neutral'}>{install.attention}</Badge>
          )}
          <StatusDot tone={statusTone(install.status)} pulse={live} />
        </View>
      }
      chevron
      onPress={onPress}
      lines={1}
    />
  )
}

/**
  One line of the attention feed. The title is what to act on and has the row's full width —
  its time goes first in the subtitle, not into a column that cut the title short.
*/
export function AttentionRow({ item, onPress }: { item: AttentionItem; onPress?: () => void }) {
  const t = useT()
  const place = [item.when, t(`home.${item.kind}`), item.installName, item.subtitle]
  return (
    <Row
      icon={ATTENTION_ICON[item.kind]}
      title={item.title}
      subtitle={place.filter(Boolean).join(' · ')}
      chevron
      onPress={onPress}
      disabled={item.stale}
      lines={3}
    />
  )
}

/** Home: every install with its status, and what waits for the person across all of them. */
export function HomeScreen({
  installs,
  attention,
  onOpenInstall,
  onOpenItem,
  onAdd,
  onSettings,
  attentionLoading = false,
  refreshing,
  onRefresh,
}: {
  installs: Install[]
  attention: AttentionItem[]
  /** The installs have not answered yet (#696): a skeleton, not «nothing needs attention». */
  attentionLoading?: boolean
  /** Pull to refresh: ask every install again. */
  refreshing?: boolean
  onRefresh?: () => void
  onOpenInstall?: (id: string) => void
  onOpenItem?: (id: string) => void
  onAdd?: () => void
  onSettings?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar
        title={t('home.title')}
        leading={<View style={{ width: 8 }} />}
        actions={<IconButton icon="settings" label={t('settings.title')} onPress={onSettings} />}
      />
      {installs.length === 0 ? (
        <Screen scroll={false}>
          <EmptyState
            icon="smartphone"
            title={t('home.noInstalls')}
            text={t('pair.welcomeText')}
            action={{ label: t('home.addInstall'), icon: 'plus', onPress: onAdd }}
          />
        </Screen>
      ) : (
        <Screen refreshing={refreshing} onRefresh={onRefresh}>
          {/* Where one works first, then what waits in them (the owner, #695). */}
          <SectionHeader
            title={t('home.installs')}
            count={installs.length}
            action={
              <IconButton icon="plus" label={t('home.addInstall')} onPress={onAdd} size="sm" />
            }
          />
          <View style={{ paddingHorizontal: theme.space(4) }}>
            <RowGroup>
              {installs.map((install) => (
                <InstallRow
                  key={install.id}
                  install={install}
                  onPress={() => onOpenInstall?.(install.id)}
                />
              ))}
            </RowGroup>
          </View>
          <SectionHeader title={t('home.attention')} count={attention.length} />
          <View style={{ paddingHorizontal: theme.space(4) }}>
            {attention.length === 0 && attentionLoading ? (
              <ListSkeleton rows={2} />
            ) : attention.length === 0 ? (
              <Card tone="muted">
                <Text tone="muted" align="center">
                  {t('home.attentionEmpty')}
                </Text>
              </Card>
            ) : (
              <RowGroup>
                {attention.map((item) => (
                  <AttentionRow key={item.id} item={item} onPress={() => onOpenItem?.(item.id)} />
                ))}
              </RowGroup>
            )}
          </View>
        </Screen>
      )}
    </>
  )
}

/** The install switcher in the top bar of every section: a chip with the current install. */
export function InstallSwitchButton({
  install,
  onPress,
}: {
  install: Install
  onPress?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home.switch')}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingLeft: theme.space(2),
        paddingRight: 4,
        height: 36,
        borderRadius: theme.radius.full,
        backgroundColor: pressed ? theme.colors.muted : 'transparent',
      })}
    >
      <Avatar name={install.name} icon={KIND_ICON[install.kind]} size={28} />
      <Icon name="chevronDown" size={16} color={theme.colors.mutedForeground} />
    </Pressable>
  )
}

/** The sheet the switcher opens: every install, the current one marked. */
export function InstallSwitcherSheet({
  installs,
  currentId,
  onSelect,
  onAdd,
  onClose,
}: {
  installs: Install[]
  currentId: string
  onSelect?: (id: string) => void
  onAdd?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet
      title={t('home.switch')}
      onClose={onClose}
      footer={
        <Button leadingIcon="plus" block onPress={onAdd}>
          {t('home.addInstall')}
        </Button>
      }
    >
      <RowGroup>
        {installs.map((install) => (
          <Row
            key={install.id}
            leading={<Avatar name={install.name} icon={KIND_ICON[install.kind]} size={32} />}
            title={install.name}
            subtitle={statusLabel(t, install.status)}
            trailing={
              install.id === currentId ? (
                <Icon name="check" size={18} />
              ) : install.attention > 0 ? (
                <Badge tone="crit">{install.attention}</Badge>
              ) : undefined
            }
            onPress={() => onSelect?.(install.id)}
          />
        ))}
      </RowGroup>
    </Sheet>
  )
}
