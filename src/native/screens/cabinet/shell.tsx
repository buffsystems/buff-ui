/** @jsxRuntime automatic */
/*
  The install shell (#629): the top bar with the drawer's hamburger, the section body, and the
  bottom tab bar with the cabinet's seven sections — four on the bar, three behind «More».
*/
import { useState, type ReactNode } from 'react'
import { View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { Icon } from '../../Icon.tsx'
import { Row, RowGroup } from '../../Row.tsx'
import { Screen, TabBar, TopBar, type TabItem } from '../../Screen.tsx'
import { Sheet } from '../../Sheet.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { MORE_SECTIONS, SECTION_ICON, type SectionId, type ShellProps } from './model.ts'

const BAR_SECTIONS: readonly SectionId[] = ['dev', 'ask', 'research', 'review']

/** The short tab label of a section. */
export function sectionLabel(t: (key: string) => string, id: SectionId): string {
  return t(`cabinet.${id}`)
}

/** The full title of a section, for the top bar. */
export function sectionTitle(t: (key: string) => string, id: SectionId): string {
  if (id === 'research' || id === 'knowledge' || id === 'repos') return t(`cabinet.${id}Full`)
  return t(`cabinet.${id}`)
}

/** The sheet behind the «More» tab: the three sections that did not fit the bar. */
export function MoreSectionsSheet({
  selected,
  badges,
  onSelect,
  onClose,
}: {
  selected: SectionId
  badges?: Partial<Record<SectionId, number>>
  onSelect?: (id: SectionId) => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Sheet title={t('cabinet.moreSections')} onClose={onClose}>
      <RowGroup>
        {MORE_SECTIONS.map((id) => {
          const count = badges?.[id] ?? 0
          return (
            <Row
              key={id}
              icon={SECTION_ICON[id]}
              title={sectionTitle(t, id)}
              trailing={
                id === selected ? (
                  <Icon name="check" size={18} color={theme.colors.primary} />
                ) : count > 0 ? (
                  <Badge tone="crit">{count}</Badge>
                ) : undefined
              }
              onPress={() => onSelect?.(id)}
            />
          )
        })}
      </RowGroup>
    </Sheet>
  )
}

/**
 * The frame of a section's list screen: switcher + title + actions above, the tab bar
 * below. The body is the section's own; `scroll={false}` for a body that scrolls itself.
 */
export function CabinetShell({
  shell,
  section,
  title,
  subtitle,
  actions,
  scroll = true,
  footer,
  moreOpen = false,
  refreshing,
  onRefresh,
  children,
}: {
  shell: ShellProps
  section: SectionId
  title?: string
  subtitle?: string
  actions?: ReactNode
  scroll?: boolean
  footer?: ReactNode
  /** The «More» sheet already open (a story). */
  moreOpen?: boolean
  /** Pull to refresh the section. */
  refreshing?: boolean
  onRefresh?: () => void
  children: ReactNode
}) {
  const t = useT()
  const [more, setMore] = useState(moreOpen)
  const onMore = MORE_SECTIONS.includes(section)
  const items: TabItem[] = [
    ...BAR_SECTIONS.map((id) => ({
      id,
      label: sectionLabel(t, id),
      icon: SECTION_ICON[id],
      badge: shell.badges?.[id],
    })),
    {
      id: 'more',
      label: t('common.more'),
      icon: 'ellipsis',
      badge: MORE_SECTIONS.reduce((sum, id) => sum + (shell.badges?.[id] ?? 0), 0) || undefined,
    },
  ]
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title={title ?? sectionTitle(t, section)}
        subtitle={subtitle}
        leading={<IconButton icon="menu" label={t('sidebar.open')} onPress={shell.onMenu} />}
        actions={
          shell.onSearch ? (
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="search" label={t('search.open')} onPress={shell.onSearch} />
              {actions}
            </View>
          ) : (
            actions
          )
        }
      />
      <Screen scroll={scroll} footer={footer} refreshing={refreshing} onRefresh={onRefresh}>
        {children}
      </Screen>
      <TabBar
        items={items}
        selected={onMore ? 'more' : section}
        onSelect={(id) => {
          if (id === 'more') setMore(true)
          else shell.onSelectSection?.(id as SectionId)
        }}
      />
      {more && (
        <MoreSectionsSheet
          selected={section}
          badges={shell.badges}
          onSelect={(id) => {
            setMore(false)
            shell.onSelectSection?.(id)
          }}
          onClose={() => setMore(false)}
        />
      )}
    </View>
  )
}
