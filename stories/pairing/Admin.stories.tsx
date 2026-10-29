import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  AffectedMachines,
  Card,
  CardContent,
  MobileAuditLog,
  MobilePolicyForm,
  PageHeader,
  PairedDevices,
  pairingStrings,
  SectionHeader,
  type MobilePolicy,
  type PairingLocale,
} from '../../src/react/index.ts'
import { audit, machines, orgDevices, policy, roles } from './fixtures.ts'

/** The Enterprise admin's «Мобильное приложение» screen. */
type Args = { locale: PairingLocale; phone: boolean }

const meta: Meta<Args> = {
  title: 'Pairing/Admin EE',
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
  phone,
  initial,
}: {
  locale: PairingLocale
  phone: boolean
  initial: MobilePolicy
}) {
  const t = pairingStrings(locale)
  const [value, setValue] = useState(initial)
  const forbidden = value.pairing === 'forbidden' || !value.enabled
  return (
    <div className="sb-stack" style={{ maxWidth: phone ? 390 : 900 }}>
      <PageHeader title={t('adminTitle')} subtitle={t('intro')} />
      <Card>
        <CardContent>
          <MobilePolicyForm
            policy={value}
            availableRoles={roles}
            locale={locale}
            onChange={setValue}
          />
        </CardContent>
      </Card>
      <SectionHeader title={t('devicesAll')} note={String(orgDevices.length)} />
      <PairedDevices
        devices={
          forbidden ? orgDevices.map((d) => ({ ...d, status: 'revoked' as const })) : orgDevices
        }
        scope="all"
        locale={locale}
      />
      <SectionHeader title={t('affected')} note={t('affectedHint')} />
      <AffectedMachines
        machines={forbidden ? machines.map((m) => ({ ...m, phones: 0 })) : machines}
        locale={locale}
      />
      <SectionHeader title={t('audit')} />
      <MobileAuditLog entries={audit} locale={locale} />
    </div>
  )
}

/** Everything on: every employee may pair, push via buff.systems. */
export const Enabled: Story = { render: (a) => <Page {...a} initial={policy} /> }
/** Only some roles may pair. */
export const Roles: Story = {
  render: (a) => (
    <Page {...a} initial={{ ...policy, pairing: 'roles', roles: ['Разработчик', 'Ревьюер'] }} />
  ),
}
/** Pairing forbidden for employees: every device and every Buff Code signed in lost its pairing. */
export const Forbidden: Story = {
  render: (a) => <Page {...a} initial={{ ...policy, pairing: 'forbidden' }} />,
}
/** Air-gapped: push off, the mobile app still on inside the perimeter. */
export const PushOff: Story = {
  render: (a) => <Page {...a} initial={{ ...policy, push: 'off' }} />,
}
/** The mobile app switched off for the install. */
export const Off: Story = { render: (a) => <Page {...a} initial={{ ...policy, enabled: false }} /> }
