import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardContent,
  MobilePolicyForm,
  PairingPanel,
  type PairingLocale,
} from '../../src/react/index.ts'
import {
  HomeScreen,
  InstallBanner,
  RevokedScreen,
  SasScreen,
  TopBar,
  Screen,
  Text,
} from '../../src/native/index.ts'
import { attention, installs } from '../mobile/fixtures.ts'
import { PhoneFrame } from '../mobile/PhoneFrame.tsx'
import { offer, phone, policy, roles } from './fixtures.ts'

/**
 * One phone, many installs — the sequences that cross the computer and the phone: the
 * phone next to the screen it pairs with, the Enterprise ban reaching a Buff Code machine.
 */
type Args = { locale: PairingLocale }

const meta: Meta<Args> = {
  title: 'Pairing/Scenarios',
  args: { locale: 'ru' as PairingLocale },
  argTypes: { locale: { control: 'inline-radio', options: ['ru', 'en'] } },
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<Args>

const side = {
  display: 'flex',
  gap: 24,
  padding: 24,
  alignItems: 'flex-start',
  flexWrap: 'wrap' as const,
}

/** 2 SaaS organisations, 2 Community, 1 Enterprise and 3 Buff Code machines on one phone, some unavailable. */
export const ManyInstalls: Story = {
  render: (a) => (
    <div style={side}>
      <PhoneFrame device="iphone" locale={a.locale}>
        <HomeScreen installs={installs} attention={attention} />
      </PhoneFrame>
      <PhoneFrame device="android" locale={a.locale}>
        <HomeScreen installs={installs} attention={attention} />
      </PhoneFrame>
    </div>
  ),
}

/** The SAS moment: the cabinet and the phone show the same six digits. */
export const SasBothSides: Story = {
  render: (a) => (
    <div style={side}>
      <Card style={{ width: 520 }}>
        <CardContent>
          <PairingPanel
            phase={{ kind: 'claimed', sas: '482913', device: phone }}
            locale={a.locale}
          />
        </CardContent>
      </Card>
      <PhoneFrame device="iphone" locale={a.locale}>
        <SasScreen sas="482913" installName="Acme" />
      </PhoneFrame>
    </div>
  ),
}

/** The admin forbade pairing: the EE cabinet, the employee's Buff Code signed into it and the phone all lose it. */
export const EeBanReachesBuffCode: Story = {
  render: (a) => (
    <div style={side}>
      <Card style={{ width: 520 }}>
        <CardContent>
          <MobilePolicyForm
            policy={{ ...policy, pairing: 'forbidden' }}
            availableRoles={roles}
            locale={a.locale}
          />
        </CardContent>
      </Card>
      <Card style={{ width: 420 }}>
        <CardContent>
          <PairingPanel phase={{ kind: 'blocked', reason: 'ee' }} locale={a.locale} />
        </CardContent>
      </Card>
      <PhoneFrame device="iphone" locale={a.locale}>
        <RevokedScreen installName="Enterprise · банк" by="admin" />
      </PhoneFrame>
      <PhoneFrame device="iphone" locale={a.locale}>
        <TopBar title="dev-box" subtitle="вошёл в Enterprise · банк" />
        <Screen>
          <InstallBanner status={{ kind: 'blockedEe' }} />
          <Text tone="muted" align="center" style={{ padding: 16 }}>
            {a.locale === 'en'
              ? 'The machine signed into the install: its policy applies.'
              : 'Машина вошла в установку: действует её политика.'}
          </Text>
        </Screen>
      </PhoneFrame>
    </div>
  ),
}

/** The QR on the computer and the scanner on the phone — the first contact. */
export const OfferAndScan: Story = {
  render: (a) => (
    <div style={side}>
      <Card style={{ width: 560 }}>
        <CardContent>
          <PairingPanel phase={{ kind: 'offer', offer, secondsLeft: 288 }} locale={a.locale} />
        </CardContent>
      </Card>
      <PhoneFrame device="iphone" locale={a.locale}>
        <HomeScreen installs={[]} attention={[]} />
      </PhoneFrame>
    </div>
  ),
}
