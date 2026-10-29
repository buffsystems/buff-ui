/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button, IconButton } from '../../Button.tsx'
import { Card, KeyValue } from '../../Card.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Field, Input } from '../../Field.tsx'
import type { Install } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Screen, TopBar } from '../../Screen.tsx'
import { ConfirmSheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { Gutter } from '../buffcode/shell.tsx'
import { InstallRow } from '../home.tsx'
import { InstallBanner } from '../status.tsx'

/** Manage installs: the list, each opening its own settings. */
export function InstallsSettingsScreen({
  installs,
  onOpen,
  onAdd,
  onBack,
}: {
  installs: Install[]
  onOpen?: (id: string) => void
  onAdd?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar
        title={t('settings.installs')}
        onBack={onBack}
        actions={<IconButton icon="plus" label={t('home.addInstall')} onPress={onAdd} />}
      />
      <Screen scroll={installs.length > 0}>
        {installs.length === 0 ? (
          <EmptyState
            icon="smartphone"
            title={t('settings.noInstalls')}
            text={t('pair.welcomeText')}
            action={{ label: t('home.addInstall'), icon: 'plus', onPress: onAdd }}
          />
        ) : (
          <View style={{ paddingTop: theme.space(3) }}>
            <Gutter>
              <Text variant="caption" tone="muted">
                {t('settings.installsHint')}
              </Text>
              <RowGroup>
                {installs.map((install) => (
                  <InstallRow
                    key={install.id}
                    install={install}
                    onPress={() => onOpen?.(install.id)}
                  />
                ))}
              </RowGroup>
            </Gutter>
          </View>
        )}
      </Screen>
    </>
  )
}

/** One install on this phone: its name here, who it is paired as, the key fingerprint, re-pair, remove. */
export function InstallSettingsScreen({
  install,
  name,
  user,
  phoneName,
  since,
  fingerprint,
  onName,
  onRepair,
  onRemove,
  onNotifications,
  onBack,
}: {
  install: Install
  name: string
  user: string
  phoneName: string
  since: string
  fingerprint: string
  onName?: (name: string) => void
  onRepair?: () => void
  onRemove?: () => void
  onNotifications?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar title={install.name} subtitle={t('settings.installs')} onBack={onBack} />
      <Screen>
        <InstallBanner status={install.status} onRepair={onRepair} />
        <View style={{ paddingTop: theme.space(3) }}>
          <Gutter gap={theme.space(4)}>
            <Field label={t('settings.installName')} hint={t('settings.renameHint')}>
              <Input icon="pencil" value={name} onChangeText={onName} />
            </Field>
            <Card>
              <KeyValue label={t('settings.pairedAs')} value={user} />
              <KeyValue label={t('settings.phoneName')} value={phoneName} />
              <KeyValue label={t('settings.pairedSince')} value={since} />
            </Card>
            <Field label={t('settings.fingerprint')} hint={t('settings.fingerprintHint')}>
              <Card tone="muted">
                <Text variant="mono" selectable>
                  {fingerprint}
                </Text>
              </Card>
            </Field>
            <RowGroup>
              {onNotifications ? (
                <Row
                  icon="bell"
                  title={t('settings.notifications')}
                  chevron
                  onPress={onNotifications}
                />
              ) : null}
              <Row icon="qrCode" title={t('status.repair')} chevron onPress={onRepair} />
            </RowGroup>
            <Button
              variant="ghost"
              leadingIcon="trash"
              onPress={onRemove}
              style={{ alignSelf: 'center' }}
            >
              {t('settings.remove')}
            </Button>
          </Gutter>
        </View>
      </Screen>
    </>
  )
}

/** «Remove {name}?» — the phone forgets the install; the pairing on the computer stays. */
export function RemoveInstallSheet({
  install,
  onConfirm,
  onClose,
}: {
  install: Install
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('settings.removeTitle', { name: install.name })}
      text={t('settings.removeText')}
      confirmLabel={t('settings.remove')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
