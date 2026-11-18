/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { KeyValue } from '../../Card.tsx'
import { Segmented } from '../../Field.tsx'
import type { Locale } from '../../i18n.ts'
import { Row, RowGroup, SectionTitle } from '../../Row.tsx'
import { Screen, TopBar } from '../../Screen.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { Gutter } from '../buffcode/shell.tsx'

export type ThemeChoice = 'light' | 'dark' | 'system'

/** The app's settings: installs, appearance, language, about and the demo. */
export function AppSettingsScreen({
  theme: choice = 'system',
  locale = 'ru',
  version,
  build,
  installs,
  onTheme,
  onLocale,
  onInstalls,
  onLinks,
  onDemo,
  onLicences,
  onPrivacy,
  onDiagnostics,
  onVersionLongPress,
  update,
  onUpdate,
  onTour,
  store,
  onRate,
  onShare,
  onContact,
  onSite,
  onBack,
}: {
  theme?: ThemeChoice
  locale?: Locale
  version: string
  build?: string
  /** How many installs are paired, for the row's subtitle. */
  installs: number
  onTheme?: (choice: ThemeChoice) => void
  onLocale?: (locale: Locale) => void
  onInstalls?: () => void
  /** Settings → Public links (#821). */
  onLinks?: () => void
  onDemo?: () => void
  onLicences?: () => void
  onPrivacy?: () => void
  onDiagnostics?: () => void
  /** A long press on the version: where the app hides what reviewers need (the demo install). */
  onVersionLongPress?: () => void
  /** A newer app version that is out (#768); absent — this one is the latest. */
  update?: string
  /** Where to get it: the store or the site's download block. */
  onUpdate?: () => void
  /** The first-launch tour again (#931). */
  onTour?: () => void
  /** The store this build was installed from, by its name (#933); a build from none has none. */
  store?: string
  /** The store's page of the app, where a review is left; absent — nowhere to rate. */
  onRate?: () => void
  onShare?: () => void
  onContact?: () => void
  onSite?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const feedback = [
    onTour && (
      <Row
        key="tour"
        icon="sparkles"
        title={t('tour.replay')}
        subtitle={t('tour.replayHint')}
        chevron
        onPress={onTour}
      />
    ),
    onRate && (
      <Row
        key="rate"
        icon="star"
        title={t('settings.rate')}
        subtitle={store ? t('settings.rateIn', { store }) : undefined}
        chevron
        onPress={onRate}
      />
    ),
    onShare && (
      <Row
        key="share"
        icon="share"
        title={t('settings.shareApp')}
        subtitle={t('settings.shareAppHint')}
        onPress={onShare}
      />
    ),
    onContact && (
      <Row
        key="contact"
        icon="mail"
        title={t('settings.contact')}
        subtitle={t('settings.contactHint')}
        onPress={onContact}
      />
    ),
    onSite && (
      <Row
        key="site"
        icon="globe"
        title={t('settings.site')}
        subtitle="buff.systems"
        chevron
        onPress={onSite}
      />
    ),
  ].filter(Boolean)
  return (
    <>
      <TopBar title={t('settings.title')} onBack={onBack} />
      <Screen>
        <View style={{ paddingTop: theme.space(3) }}>
          <Gutter gap={theme.space(5)}>
            <RowGroup>
              <Row
                icon="smartphone"
                title={t('settings.installs')}
                subtitle={installs ? undefined : t('settings.noInstalls')}
                label={installs ? `${t('settings.installs')}: ${installs}` : undefined}
                trailing={installs ? <Text tone="muted">{installs}</Text> : undefined}
                chevron
                onPress={onInstalls}
              />
              {onLinks ? (
                <Row
                  icon="link"
                  title={t('share.links')}
                  subtitle={t('share.linksHint')}
                  chevron
                  onPress={onLinks}
                />
              ) : null}
              {onDemo ? (
                <Row
                  icon="eye"
                  title={t('settings.demoTitle')}
                  subtitle={t('settings.demo')}
                  chevron
                  onPress={onDemo}
                />
              ) : null}
            </RowGroup>
            <View style={{ gap: theme.space(2) }}>
              <SectionTitle>{t('settings.theme')}</SectionTitle>
              <Segmented
                options={[
                  { id: 'light', label: t('settings.themeLight') },
                  { id: 'dark', label: t('settings.themeDark') },
                  { id: 'system', label: t('settings.themeSystem') },
                ]}
                value={choice}
                onChange={(id) => onTheme?.(id as ThemeChoice)}
              />
            </View>
            <View style={{ gap: theme.space(2) }}>
              <SectionTitle>{t('settings.language')}</SectionTitle>
              <Segmented
                options={[
                  { id: 'ru', label: t('settings.langRu') },
                  { id: 'en', label: t('settings.langEn') },
                ]}
                value={locale}
                onChange={(id) => onLocale?.(id as Locale)}
              />
            </View>
            {feedback.length > 0 && <RowGroup title={t('settings.feedback')}>{feedback}</RowGroup>}
            <RowGroup title={t('settings.about')}>
              {[
                <Pressable
                  key="version"
                  onLongPress={onVersionLongPress}
                  style={{ paddingHorizontal: theme.space(4), paddingVertical: theme.space(3) }}
                >
                  <KeyValue
                    label={t('settings.version')}
                    value={build ? `${version} (${build})` : version}
                  />
                </Pressable>,
                ...(update
                  ? [
                      <Row
                        key="update"
                        icon="refreshCw"
                        title={t('settings.updateAvailable', { version: update })}
                        subtitle={t('settings.updateHint')}
                        chevron
                        onPress={onUpdate}
                      />,
                    ]
                  : []),
                <Row
                  key="licences"
                  icon="scale"
                  title={t('settings.licences')}
                  lines={2}
                  chevron
                  onPress={onLicences}
                />,
                <Row
                  key="privacy"
                  icon="lock"
                  title={t('settings.privacy')}
                  chevron
                  onPress={onPrivacy}
                />,
                <Row
                  key="diag"
                  icon="download"
                  title={t('settings.diagnostics')}
                  subtitle={t('settings.diagnosticsHint')}
                  onPress={onDiagnostics}
                />,
              ]}
            </RowGroup>
            <Text variant="caption" tone="muted" align="center">
              Buff · buff.systems
            </Text>
          </Gutter>
        </View>
      </Screen>
    </>
  )
}
