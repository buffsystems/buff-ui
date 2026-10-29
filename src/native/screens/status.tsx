/** @jsxRuntime automatic */
import { View } from 'react-native'
import type { Tone } from '../Badge.tsx'
import { Button } from '../Button.tsx'
import { Callout, EmptyState } from '../Feedback.tsx'
import type { IconName } from '../icons.ts'
import type { InstallStatus } from '../model.ts'
import { Screen, TopBar } from '../Screen.tsx'
import { useT, useTheme } from '../theme.tsx'

const OFFLINE_LABEL = {
  network: 'common.noGatewaySince',
  install: 'common.notRespondingSince',
  unknown: 'common.offlineSince',
}
const OFFLINE_TEXT = {
  network: 'common.readOnlyNetwork',
  install: 'common.readOnlyInstall',
  unknown: 'common.readOnly',
}

/** The one-line label of a status, for rows and switchers. */
export function statusLabel(
  t: (key: string, vars?: Record<string, string | number>) => string,
  status: InstallStatus,
): string {
  switch (status.kind) {
    case 'online':
      return t('common.online')
    case 'connecting':
      return t('common.connecting')
    case 'offline':
      return t(OFFLINE_LABEL[status.reason ?? 'unknown'], { time: status.since })
    case 'repair':
      return t('common.repairNeeded')
    case 'blockedOrg':
      return t('common.blockedByOrg')
    case 'blockedEe':
      return t('common.blockedByEe')
    case 'incompatible':
      return t('common.incompatible')
    case 'serviceDown':
      return t('common.serviceDown')
  }
}

export function statusTone(status: InstallStatus): Tone {
  switch (status.kind) {
    case 'online':
      return 'ok'
    case 'connecting':
      return 'neutral'
    case 'offline':
      return 'warn'
    case 'incompatible':
    case 'serviceDown':
      return 'warn'
    default:
      return 'crit'
  }
}

/**
 * The banner over any section of an install that is not live: what is shown, what is not
 * possible. `online` draws nothing, so a screen can always include it; nor does `connecting` —
 * a link coming back in a second is no news (#695).
 */
export function InstallBanner({
  status,
  onRepair,
}: {
  status: InstallStatus
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (status.kind === 'online' || status.kind === 'connecting') return null
  const text =
    status.kind === 'offline'
      ? t(OFFLINE_TEXT[status.reason ?? 'unknown'], { time: status.since })
      : status.kind === 'incompatible'
        ? t('pair.errIncompatibleText', { version: status.version })
        : status.kind === 'blockedOrg'
          ? t('pair.errBlockedOrgText')
          : status.kind === 'blockedEe'
            ? t('pair.errBlockedEeText')
            : status.kind === 'serviceDown'
              ? t('status.serviceDownText')
              : t('status.repairText')
  return (
    <View style={{ padding: theme.space(3), paddingBottom: 0 }}>
      <Callout
        tone={statusTone(status)}
        icon={bannerIcon(status)}
        title={statusLabel(t, status)}
        action={
          status.kind === 'repair' && onRepair ? (
            <Button size="sm" variant="primary" leadingIcon="qrCode" onPress={onRepair}>
              {t('status.repair')}
            </Button>
          ) : undefined
        }
      >
        {text}
      </Callout>
    </View>
  )
}

function bannerIcon(status: InstallStatus): IconName {
  switch (status.kind) {
    case 'offline':
      return 'wifiOff'
    case 'repair':
      return 'unplug'
    case 'serviceDown':
      return 'cpu'
    case 'incompatible':
      return 'alertTriangle'
    default:
      return 'lock'
  }
}

/** The whole screen of an install whose pairing was torn down from the other side. */
export function RevokedScreen({
  installName,
  by,
  onRemove,
  onRepair,
}: {
  installName: string
  by: 'admin' | 'org'
  onRemove?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  return (
    <>
      <TopBar title={installName} />
      <Screen scroll={false}>
        <EmptyState
          icon="unplug"
          title={t('common.repairNeeded')}
          text={by === 'org' ? t('common.revokedByOrg') : t('common.revokedByAdmin')}
          action={{ label: t('status.repair'), icon: 'qrCode', onPress: onRepair }}
        />
        <View style={{ alignItems: 'center', paddingBottom: 24 }}>
          <Button variant="ghost" leadingIcon="trash" onPress={onRemove}>
            {t('status.forget')}
          </Button>
        </View>
      </Screen>
    </>
  )
}
