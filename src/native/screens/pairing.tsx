/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from '../Button.tsx'
import { Callout, EmptyState, Spinner } from '../Feedback.tsx'
import { Field, Input } from '../Field.tsx'
import { Row, RowGroup } from '../Row.tsx'
import type { IconName } from '../icons.ts'
import { CodeInput, SasCode, ScannerFrame } from '../Pairing.tsx'
import { Screen, TopBar } from '../Screen.tsx'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'

/** First launch: nothing paired yet. */
export function WelcomeScreen({
  onScan,
  onEnterCode,
  onBack,
}: {
  onScan?: () => void
  onEnterCode?: () => void
  /** Adding one more install (#696): the same two ways as the first time, with a way back. */
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Screen scroll={false}>
      {onBack && <TopBar title={t('home.addInstall')} onBack={onBack} />}
      <EmptyState
        icon="smartphone"
        title={t('pair.welcomeTitle')}
        text={t('pair.welcomeText')}
        action={{ label: t('pair.scan'), icon: 'qrCode', onPress: onScan }}
      />
      <View style={{ alignItems: 'center', paddingBottom: theme.space(8) }}>
        <Button variant="ghost" leadingIcon="link" onPress={onEnterCode}>
          {t('pair.enterCode')}
        </Button>
      </View>
    </Screen>
  )
}

/** The camera over the QR on the computer screen. */
export function ScanScreen({
  found = false,
  camera,
  onBack,
  onEnterCode,
}: {
  found?: boolean
  /** The host's live camera (expo-camera in the app). */
  camera?: ReactNode
  onBack?: () => void
  onEnterCode?: () => void
}) {
  const t = useT()
  return (
    <>
      <TopBar title={t('pair.scan')} onBack={onBack} />
      <ScannerFrame
        hint={found ? t('pair.scanFound') : t('pair.scanHint')}
        found={found}
        camera={camera}
      />
      <View style={{ alignItems: 'center', padding: 12 }}>
        <Button variant="ghost" leadingIcon="link" onPress={onEnterCode}>
          {t('pair.enterCode')}
        </Button>
      </View>
    </>
  )
}

/** The link + 8-character code alternative. `busy` while the claim is in flight. */
export function EnterCodeScreen({
  link = '',
  code = '',
  error,
  busy = false,
  onBack,
  onConnect,
  onChangeLink,
  onChangeCode,
}: {
  link?: string
  code?: string
  error?: string
  busy?: boolean
  onBack?: () => void
  onConnect?: () => void
  onChangeLink?: (link: string) => void
  onChangeCode?: (code: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const ready = link.length > 0 && code.length === 8
  return (
    <>
      <TopBar title={t('pair.enterCode')} onBack={onBack} />
      <Screen
        padded
        footer={
          <View style={{ padding: theme.space(4) }}>
            <Button variant="primary" block loading={busy} disabled={!ready} onPress={onConnect}>
              {busy ? t('pair.connecting') : t('pair.connect')}
            </Button>
          </View>
        }
      >
        <Field label={t('pair.link')} hint={t('pair.linkHint')} required>
          <Input
            icon="link"
            value={link}
            placeholder="https://buff.systems/pair/…"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!busy}
            onChangeText={onChangeLink}
          />
        </Field>
        <Field
          label={t('pair.code')}
          hint={error ? undefined : t('pair.codeHint')}
          error={error}
          required
        >
          <CodeInput value={code} invalid={!!error} onChange={onChangeCode} editable={!busy} />
        </Field>
      </Screen>
    </>
  )
}

/** After the handshake: both sides show the SAS, the person confirms on the computer. */
export function SasScreen({
  sas,
  installName,
  onBack,
}: {
  sas: string
  installName: string
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar title={t('pair.sasTitle')} subtitle={installName} onBack={onBack} />
      <Screen padded>
        <SasCode value={sas} />
        <Text tone="fg2" align="center">
          {t('pair.sasText')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.space(2),
            paddingTop: theme.space(4),
          }}
        >
          <Spinner />
          <Text variant="label" tone="muted">
            {t('pair.sasWaiting')}
          </Text>
        </View>
      </Screen>
    </>
  )
}

/**
  Paired: the rights the phone received, and the name the cabinet lists it under — told, not
  asked: the name went with the pairing, typing another here would change nothing.
*/
export function PairedScreen({
  installName,
  user,
  deviceName,
  onDone,
}: {
  installName: string
  user: string
  deviceName: string
  onDone?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar title={installName} />
      <Screen
        padded
        footer={
          <View style={{ padding: theme.space(4) }}>
            <Button variant="primary" block onPress={onDone}>
              {t('common.ok')}
            </Button>
          </View>
        }
      >
        <EmptyState
          icon="checkCircle"
          done
          title={t('pair.doneTitle')}
          text={t('pair.doneText', { user })}
        />
        <RowGroup>
          <Row icon="smartphone" title={deviceName} subtitle={t('pair.deviceNameIs')} />
        </RowGroup>
      </Screen>
    </>
  )
}

export type PairError =
  'expired' | 'locked' | 'blockedOrg' | 'blockedEe' | 'incompatible' | 'gateway' | 'installOffline'

const ERROR_ICON: Record<PairError, IconName> = {
  expired: 'clock',
  locked: 'lock',
  blockedOrg: 'lock',
  blockedEe: 'shieldCheck',
  incompatible: 'alertTriangle',
  gateway: 'wifiOff',
  installOffline: 'server',
}

/** A pairing that did not happen, and what to do about it. */
export function PairErrorScreen({
  error,
  version,
  gateway = 'buff.systems',
  onBack,
  onRetry,
}: {
  error: PairError
  version?: string
  /** The gateway the link named: it is the one that did not answer. */
  gateway?: string
  onBack?: () => void
  onRetry?: () => void
}) {
  const t = useT()
  const key = `pair.err${error[0].toUpperCase()}${error.slice(1)}`
  const retry = error === 'gateway' || error === 'expired' || error === 'installOffline'
  return (
    <>
      <TopBar title={t('pair.welcomeTitle')} onBack={onBack} />
      <Screen scroll={false}>
        <EmptyState
          icon={ERROR_ICON[error]}
          title={t(key)}
          text={t(`${key}Text`, { version: version ?? '', gateway })}
          action={
            retry ? { label: t('common.retry'), icon: 'refreshCw', onPress: onRetry } : undefined
          }
        />
        {(error === 'blockedOrg' || error === 'blockedEe') && (
          <View style={{ padding: 16 }}>
            <Callout tone="neutral" icon="info">
              {t('pair.blockedHint')}
            </Callout>
          </View>
        )}
      </Screen>
    </>
  )
}
