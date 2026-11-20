/** @jsxRuntime automatic */
/*
  What another app shared with Buff (#943): the screen that asks where it goes — a connection,
  and in a cabinet «Ask», a research or a new task — and the bar that stays while the person
  walks to the dialog. The dialog they open takes the files and the text into its composer.
*/
import { Pressable, View } from 'react-native'
import { IconButton } from '../Button.tsx'
import { Card, SectionHeader } from '../Card.tsx'
import { Callout, EmptyState } from '../Feedback.tsx'
import { Icon } from '../Icon.tsx'
import type { Translate } from '../i18n.ts'
import type { Attachment, Install } from '../model.ts'
import { Row, RowGroup } from '../Row.tsx'
import { Screen, TopBar } from '../Screen.tsx'
import { Spinner } from '../Spinner.tsx'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'
import { formatSize } from './cabinet/attachments.tsx'
import { SECTION_ICON } from './cabinet/model.ts'
import { InstallRow } from './home.tsx'

/** Where in a cabinet the shared goes. */
export type IncomingPlace = 'ask' | 'research' | 'task'

/** The files named before the rest is counted. */
const SHOWN_FILES = 3

/** «Files: 2 and text» — what is in hand, in one line. */
export function incomingLine(t: Translate, files: number, text: boolean): string {
  if (files > 0 && text) return t('incoming.filesAndText', { n: files })
  return files > 0 ? t('incoming.files', { n: files }) : t('incoming.text')
}

/** Where the shared goes: every connection; a cabinet then asks which of its three places. */
export function IncomingScreen({
  files,
  text = '',
  loading = false,
  failed = false,
  installs,
  picked,
  onPickInstall,
  onPickPlace,
  onBack,
  onCancel,
  onAdd,
}: {
  files: Attachment[]
  text?: string
  /** The files are still being read: nothing can be chosen yet. */
  loading?: boolean
  failed?: boolean
  installs: Install[]
  /** The cabinet chosen: its places are asked instead of the connections. */
  picked?: Install
  onPickInstall?: (id: string) => void
  onPickPlace?: (place: IncomingPlace) => void
  /** From a cabinet's places back to the connections. */
  onBack?: () => void
  onCancel?: () => void
  onAdd?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const rest = files.length - SHOWN_FILES
  return (
    <>
      <TopBar
        title={t('incoming.title')}
        {...(picked ? { onBack } : {})}
        actions={<IconButton icon="x" label={t('incoming.cancel')} onPress={onCancel} />}
      />
      <Screen>
        <SectionHeader title={t('incoming.what')} />
        <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(3) }}>
          {loading ? (
            <Card tone="muted">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(3) }}>
                <Spinner />
                <Text tone="muted">{t('incoming.reading')}</Text>
              </View>
            </Card>
          ) : failed ? (
            <Callout tone="crit">{t('incoming.failed')}</Callout>
          ) : (
            <>
              {files.length > 0 && (
                <RowGroup>
                  {files.slice(0, SHOWN_FILES).map((f) => (
                    <Row
                      key={f.id}
                      icon={f.kind === 'image' ? 'image' : 'fileText'}
                      title={f.name}
                      subtitle={formatSize(t, f.size)}
                    />
                  ))}
                  {rest > 0 && <Row icon="paperclip" title={t('incoming.more', { n: rest })} />}
                </RowGroup>
              )}
              {text !== '' && (
                <Card tone="muted">
                  <Text numberOfLines={4}>{text}</Text>
                </Card>
              )}
            </>
          )}
        </View>
        {picked ? (
          <>
            <SectionHeader title={picked.name} />
            <View style={{ paddingHorizontal: theme.space(4) }}>
              <RowGroup>
                <Row
                  icon={SECTION_ICON.ask}
                  title={t('cabinet.ask')}
                  subtitle={t('incoming.askHint')}
                  chevron
                  disabled={loading || failed}
                  onPress={() => onPickPlace?.('ask')}
                />
                <Row
                  icon={SECTION_ICON.research}
                  title={t('cabinet.researchFull')}
                  subtitle={t('incoming.researchHint')}
                  chevron
                  disabled={loading || failed}
                  onPress={() => onPickPlace?.('research')}
                />
                <Row
                  icon="plus"
                  title={t('dev.newTask')}
                  subtitle={t('incoming.taskHint')}
                  chevron
                  disabled={loading || failed}
                  onPress={() => onPickPlace?.('task')}
                />
              </RowGroup>
            </View>
          </>
        ) : installs.length === 0 ? (
          <EmptyState
            icon="smartphone"
            title={t('home.noInstalls')}
            text={t('pair.welcomeText')}
            action={{ label: t('home.addInstall'), icon: 'plus', onPress: onAdd }}
          />
        ) : (
          <>
            <SectionHeader title={t('incoming.where')} count={installs.length} />
            <View
              style={{ paddingHorizontal: theme.space(4), opacity: loading || failed ? 0.5 : 1 }}
            >
              <RowGroup>
                {installs.map((install) => (
                  <InstallRow
                    key={install.id}
                    install={install}
                    {...(loading || failed ? {} : { onPress: () => onPickInstall?.(install.id) })}
                  />
                ))}
              </RowGroup>
            </View>
          </>
        )}
      </Screen>
    </>
  )
}

/**
 * The shared, in hand: a bar over every screen until a dialog takes it. A tap goes back to
 * «Send to»; the cross drops what was shared.
 */
export function IncomingBar({
  files,
  text = false,
  onPress,
  onCancel,
}: {
  files: number
  text?: boolean
  onPress?: () => void
  onCancel?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: c.brandSoft,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('incoming.choose')}
        onPress={onPress}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(3),
          minHeight: theme.touch,
          paddingLeft: theme.space(4),
          paddingVertical: theme.space(2),
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Icon name="paperclip" size={18} color={c.brandSoftForeground} />
        <View style={{ flex: 1 }}>
          <Text variant="label" style={{ color: c.brandSoftForeground, fontWeight: '600' }}>
            {incomingLine(t, files, text)}
          </Text>
          <Text variant="caption" style={{ color: c.brandSoftForeground }} numberOfLines={1}>
            {t('incoming.barHint')}
          </Text>
        </View>
      </Pressable>
      <IconButton icon="x" label={t('incoming.cancel')} onPress={onCancel} />
    </View>
  )
}
