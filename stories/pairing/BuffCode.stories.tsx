import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Badge,
  BuffCodeHomeNote,
  Card,
  CardContent,
  ConsolePhoneDialog,
  PairedDevices,
  PairingPanel,
  pairingStrings,
  PhoneOriginBadge,
  PhoneSessionBanner,
  SectionHeader,
  type BuffCodeHome,
  type PairingLocale,
  type PairingMode,
  type PairingPhase,
} from '../../src/react/index.ts'
import { myDevices, offer, phone } from './fixtures.ts'

/** Buff Code: «Настройки → Телефон» in the desktop window, `/phone` in the console, the phone-session banner. */
type Args = { locale: PairingLocale }

const meta: Meta<Args> = {
  title: 'Pairing/Buff Code',
  args: { locale: 'ru' as PairingLocale },
  argTypes: { locale: { control: 'inline-radio', options: ['ru', 'en'] } },
}

export default meta
type Story = StoryObj<Args>

const offering: PairingPhase = { kind: 'offer', offer, secondsLeft: 212 }

function Settings({
  locale,
  home,
  phase,
}: {
  locale: PairingLocale
  home: BuffCodeHome
  phase: PairingPhase
}) {
  const t = pairingStrings(locale)
  const [mode, setMode] = useState<PairingMode>('qr')
  const blocked = home.kind === 'signedIn' && home.policyForbids
  return (
    <div className="sb-stack" style={{ maxWidth: 720 }}>
      <SectionHeader title={t('title')} note={t('bcConsoleHint')} />
      <BuffCodeHomeNote home={home} locale={locale} />
      <Card>
        <CardContent>
          <PairingPanel
            phase={blocked ? { kind: 'blocked', reason: 'ee' } : phase}
            mode={mode}
            locale={locale}
            onModeChange={setMode}
          />
        </CardContent>
      </Card>
      <SectionHeader title={t('devicesMine')} />
      <PairedDevices
        devices={blocked ? myDevices.map((d) => ({ ...d, status: 'revoked' as const })) : myDevices}
        locale={locale}
      />
    </div>
  )
}

/** Not signed into Buff: the machine pairs directly via buff.systems. */
export const DesktopStandalone: Story = {
  render: (a) => <Settings {...a} home={{ kind: 'standalone' }} phase={offering} />,
}
/** Signed into an install: its policy applies. */
export const DesktopSignedIn: Story = {
  render: (a) => (
    <Settings
      {...a}
      home={{ kind: 'signedIn', install: 'Acme', policyForbids: false }}
      phase={offering}
    />
  ),
}
/** The home install forbade phones: pairing blocked, existing phones revoked. */
export const DesktopPolicyForbids: Story = {
  render: (a) => (
    <Settings
      {...a}
      home={{ kind: 'signedIn', install: 'Enterprise · банк', policyForbids: true }}
      phase={offering}
    />
  ),
}
/** The service is stopped: the phone cannot see the machine. */
export const DesktopServiceDown: Story = {
  render: (a) => (
    <Settings
      {...a}
      home={{ kind: 'standalone' }}
      phase={{ kind: 'blocked', reason: 'serviceDown' }}
    />
  ),
}
export const DesktopSas: Story = {
  render: (a) => (
    <Settings
      {...a}
      home={{ kind: 'standalone' }}
      phase={{ kind: 'claimed', sas: '482913', device: phone }}
    />
  ),
}

/** The console: `/phone` with the QR as block art, the code, the phones. */
export const Console: Story = {
  render: (a) => (
    <ConsolePhoneDialog
      code={offer.code}
      link={offer.link}
      secondsLeft={212}
      phones={[
        { name: 'iPhone Анны', status: 'online' },
        { name: 'Pixel', status: 'offline' },
      ]}
      locale={a.locale}
    />
  ),
}
export const ConsoleSas: Story = {
  render: (a) => (
    <ConsolePhoneDialog
      code={offer.code}
      link={offer.link}
      secondsLeft={180}
      sas="482913"
      phones={[]}
      locale={a.locale}
    />
  ),
}
export const ConsoleServiceDown: Story = {
  render: (a) => (
    <ConsolePhoneDialog
      code={offer.code}
      link={offer.link}
      secondsLeft={0}
      phones={[{ name: 'iPhone Анны', status: 'offline' }]}
      locale={a.locale}
      warning={pairingStrings(a.locale)('serviceDownText')}
    />
  ),
}

/** The banner over a session a phone started, and the mark in the session list. */
export const SessionFromPhone: Story = {
  render: (a) => (
    <div className="sb-stack" style={{ maxWidth: 720 }}>
      <PhoneSessionBanner device="iPhone Анны" at="14:02" locale={a.locale} />
      <div className="sb-row">
        <span>Экспорт отчётов в PDF</span>
        <PhoneOriginBadge device="iPhone Анны" locale={a.locale} />
        <Badge tone="ok" dot>
          работает
        </Badge>
      </div>
    </div>
  ),
}
