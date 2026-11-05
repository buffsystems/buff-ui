/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from '../Button.tsx'
import { Card } from '../Card.tsx'
import { Icon } from '../Icon.tsx'
import type { IconName } from '../icons.ts'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'

/** A link out of the app (#745): the host turns it into an address in the app's language. */
export type StarterLink =
  'buffcode-site' | 'buffcode-github' | 'community-site' | 'community-github'

function StarterCard({
  icon,
  title,
  text,
  children,
}: {
  icon: IconName
  title: string
  text: string
  children: ReactNode
}) {
  const theme = useTheme()
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        <Icon name={icon} size={20} color={theme.colors.primary} />
        <Text variant="title">{title}</Text>
      </View>
      <Text tone="muted" style={{ marginTop: theme.space(1) }}>
        {text}
      </Text>
      <View style={{ flexDirection: 'row', gap: theme.space(2), marginTop: theme.space(3) }}>
        {children}
      </View>
    </Card>
  )
}

/**
 * Nothing paired yet (#745): the two products a phone connects to — where to get them — and the
 * demo in one tap. The demo card shows only when the host offers it (a build with the demo).
 */
export function StarterCards({
  onOpen,
  onDemo,
}: {
  onOpen?: (link: StarterLink) => void
  onDemo?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const links = (site: StarterLink, github: StarterLink) => (
    <>
      <Button size="sm" leadingIcon="globe" onPress={() => onOpen?.(site)}>
        {t('starter.site')}
      </Button>
      <Button size="sm" leadingIcon="gitBranch" onPress={() => onOpen?.(github)}>
        {t('starter.github')}
      </Button>
    </>
  )
  return (
    <View
      style={{
        paddingHorizontal: theme.space(4),
        paddingBottom: theme.space(6),
        gap: theme.space(3),
      }}
    >
      <Text variant="caption" tone="muted">
        {t('starter.title')}
      </Text>
      {onDemo && (
        <StarterCard icon="eye" title={t('starter.demo')} text={t('starter.demoText')}>
          <Button size="sm" variant="primary" leadingIcon="eye" onPress={onDemo}>
            {t('common.open')}
          </Button>
        </StarterCard>
      )}
      <StarterCard icon="terminal" title={t('starter.buffCode')} text={t('starter.buffCodeText')}>
        {links('buffcode-site', 'buffcode-github')}
      </StarterCard>
      <StarterCard icon="server" title={t('starter.community')} text={t('starter.communityText')}>
        {links('community-site', 'community-github')}
      </StarterCard>
    </View>
  )
}
