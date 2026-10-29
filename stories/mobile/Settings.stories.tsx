import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AppSettingsScreen,
  DemoInstallScreen,
  InstallSettingsScreen,
  InstallsSettingsScreen,
  RemoveInstallSheet,
} from '../../src/native/screens/settings/index.ts'
import { installs } from './fixtures.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Настройки приложения: установки, тема и язык, о приложении, демо-установка. */
const meta = {
  title: 'Mobile/Settings',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const detail = {
  install: installs[0],
  name: 'Acme',
  user: 'ivan.petrov',
  phoneName: 'iPhone Ивана',
  since: '3 окт 2026',
  fingerprint: 'SHA256:9fA2 kLm0 Qx7r Vb3n Zc8d Ee1w Hh5t Jj6y',
}

export const Installs: Story = { render: () => <InstallsSettingsScreen installs={installs} /> }
export const InstallsEmpty: Story = { render: () => <InstallsSettingsScreen installs={[]} /> }
export const Install: Story = { render: () => <InstallSettingsScreen {...detail} /> }
export const InstallRepair: Story = {
  render: () => <InstallSettingsScreen {...detail} install={installs[7]} name="dev-box" />,
}
export const InstallRemove: Story = {
  render: () => (
    <>
      <InstallSettingsScreen {...detail} />
      <RemoveInstallSheet install={installs[0]} />
    </>
  ),
}
export const App: Story = {
  render: () => (
    <AppSettingsScreen
      version="1.2.0"
      build="412"
      installs={installs.length}
      theme="system"
      onDemo={() => undefined}
    />
  ),
}
/** The phone set to English and dark: the screen speaks English on a dark ground, not only
 *  shows those choices picked. */
export const AppEnglishDark: Story = {
  globals: { locale: 'en', theme: 'dark' },
  render: () => <AppSettingsScreen version="1.2.0" installs={0} theme="dark" locale="en" />,
}
export const Demo: Story = { render: () => <DemoInstallScreen /> }
export const DemoConnecting: Story = { render: () => <DemoInstallScreen state="connecting" /> }
export const DemoFailed: Story = { render: () => <DemoInstallScreen state="failed" /> }
export const DemoConnected: Story = { render: () => <DemoInstallScreen state="connected" /> }
