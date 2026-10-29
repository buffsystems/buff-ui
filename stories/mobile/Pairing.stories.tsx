import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  EnterCodeScreen,
  PairedScreen,
  PairErrorScreen,
  RevokedScreen,
  SasScreen,
  ScanScreen,
  WelcomeScreen,
} from '../../src/native/index.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Pairing',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Welcome: Story = { render: () => <WelcomeScreen /> }
export const Scanner: Story = { render: () => <ScanScreen /> }
export const ScannerFound: Story = { render: () => <ScanScreen found /> }
export const EnterCode: Story = {
  render: () => <EnterCodeScreen link="https://app.buff.systems/pair/7f3a" code="7KQ2" />,
}
export const EnterCodeBusy: Story = {
  render: () => <EnterCodeScreen link="https://app.buff.systems/pair/7f3a" code="7KQ2M9XA" busy />,
}
export const EnterCodeWrong: Story = {
  render: () => (
    <EnterCodeScreen
      link="https://app.buff.systems/pair/7f3a"
      code="7KQ2M9XB"
      error="Код не подошёл. Осталось 3 попытки."
    />
  ),
}
export const Sas: Story = { render: () => <SasScreen sas="482913" installName="Acme" /> }
export const Paired: Story = {
  render: () => <PairedScreen installName="Acme" user="Анна Громова" deviceName="iPhone Анны" />,
}
export const ErrorExpired: Story = { render: () => <PairErrorScreen error="expired" /> }
export const ErrorLocked: Story = { render: () => <PairErrorScreen error="locked" /> }
export const ErrorBlockedOrg: Story = { render: () => <PairErrorScreen error="blockedOrg" /> }
export const ErrorBlockedEe: Story = { render: () => <PairErrorScreen error="blockedEe" /> }
export const ErrorIncompatible: Story = {
  render: () => <PairErrorScreen error="incompatible" version="v0.18.2" />,
}
export const ErrorGateway: Story = {
  render: () => <PairErrorScreen error="gateway" gateway="buff.systems" />,
}
export const ErrorInstallOffline: Story = {
  render: () => <PairErrorScreen error="installOffline" />,
}
export const RevokedByAdmin: Story = {
  render: () => <RevokedScreen installName="Enterprise · банк" by="admin" />,
}
export const RevokedByOrg: Story = {
  render: () => <RevokedScreen installName="Northwind" by="org" />,
}
