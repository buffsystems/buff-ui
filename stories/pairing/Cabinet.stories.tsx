import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Card,
  CardContent,
  OrgPhonePolicy,
  PairedDevices,
  PairingPanel,
  PairingRequestCard,
  pairingStrings,
  SectionHeader,
  type PairingLocale,
  type PairingMode,
  type PairingPhase,
} from '../../src/react/index.ts'
import { myDevices, offer, orgDevices, phone, request } from './fixtures.ts'

/** «Настройки → Телефон» of a cabinet (SaaS, Community, Enterprise): pairing, phones, the owner's switch. */
type Args = { locale: PairingLocale; phone: boolean }

const meta: Meta<Args> = {
  title: 'Pairing/Cabinet',
  args: { locale: 'ru' as PairingLocale, phone: false },
  argTypes: {
    locale: { control: 'inline-radio', options: ['ru', 'en'] },
    phone: { control: 'boolean', description: 'Render at phone width (390px)' },
  },
}

export default meta
type Story = StoryObj<Args>

function Page({
  locale,
  phone: narrow,
  phase,
  owner = false,
  forbidden = false,
  withRequest = false,
  startMode = 'qr',
}: {
  locale: PairingLocale
  phone: boolean
  phase: PairingPhase
  owner?: boolean
  forbidden?: boolean
  withRequest?: boolean
  startMode?: PairingMode
}) {
  const t = pairingStrings(locale)
  const [mode, setMode] = useState<PairingMode>(startMode)
  const [ban, setBan] = useState(forbidden)
  return (
    <div className="sb-stack" style={{ maxWidth: narrow ? 390 : 760 }}>
      <SectionHeader title={t('title')} note={t('intro')} />
      {withRequest && <PairingRequestCard request={request} locale={locale} />}
      <Card>
        <CardContent>
          <PairingPanel
            phase={ban ? { kind: 'blocked', reason: 'org' } : phase}
            mode={mode}
            locale={locale}
            onModeChange={setMode}
          />
        </CardContent>
      </Card>
      <SectionHeader title={t(owner ? 'devicesOrg' : 'devicesMine')} />
      <PairedDevices
        devices={owner ? orgDevices : myDevices}
        scope={owner ? 'org' : 'mine'}
        locale={locale}
      />
      {owner && <OrgPhonePolicy forbidden={ban} locale={locale} onChange={setBan} />}
    </div>
  )
}

const offering: PairingPhase = { kind: 'offer', offer, secondsLeft: 212 }

/** The QR with its countdown; switch the segmented control to the link + code path. */
export const Offer: Story = { render: (a) => <Page {...a} phase={offering} /> }
/** A phone claimed the code offer: the SAS, confirm it matches the phone. */
export const Sas: Story = {
  render: (a) => (
    <Page {...a} startMode="link" phase={{ kind: 'claimed', sas: '482913', device: phone }} />
  ),
}
/** A phone came by the QR: it shows no code — the person confirms the phone itself. */
export const QrConfirm: Story = {
  render: (a) => <Page {...a} phase={{ kind: 'claimed', sas: '482913', device: phone }} />,
}
export const Paired: Story = {
  render: (a) => <Page {...a} phase={{ kind: 'paired', device: phone }} />,
}
export const Expired: Story = { render: (a) => <Page {...a} phase={{ kind: 'expired' }} /> }
/** The organisation owner: every phone in the organisation, and the switch that forbids them. */
export const Owner: Story = { render: (a) => <Page {...a} phase={offering} owner /> }
/** The owner forbade phones: pairing blocked, the switch on, existing pairings torn down. */
export const OwnerForbidden: Story = {
  render: (a) => <Page {...a} phase={offering} owner forbidden />,
}
/** Enterprise policy forbids pairing for this employee. */
export const BlockedByEe: Story = {
  render: (a) => <Page {...a} phase={{ kind: 'blocked', reason: 'ee' }} />,
}
/** The admin switched the mobile app off for the install. */
export const Disabled: Story = {
  render: (a) => <Page {...a} phase={{ kind: 'blocked', reason: 'disabled' }} />,
}
/** A phone asks to pair and the policy wants the person to confirm it first. */
export const Request: Story = { render: (a) => <Page {...a} phase={offering} withRequest /> }
export const NoPhones: Story = {
  render: (a) => (
    <div className="sb-stack" style={{ maxWidth: 760 }}>
      <PairingPanel phase={offering} locale={a.locale} />
      <PairedDevices devices={[]} locale={a.locale} />
    </div>
  ),
}
