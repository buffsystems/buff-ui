import type { Meta, StoryObj } from '@storybook/react-vite'
import { View } from 'react-native'
import {
  HomeScreen,
  InstallBanner,
  InstallSwitcherSheet,
  InstallSwitchButton,
  Screen,
  Text,
  TopBar,
} from '../../src/native/index.ts'
import { attention, installs } from './fixtures.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Home',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Every kind and status at once: 2 SaaS, 2 CE, 1 EE, 3 Buff Code machines. */
export const ManyInstalls: Story = {
  render: () => <HomeScreen installs={installs} attention={attention} />,
}
export const OneInstallQuiet: Story = {
  render: () => <HomeScreen installs={installs.slice(0, 1)} attention={[]} />,
}
export const NoInstalls: Story = { render: () => <HomeScreen installs={[]} attention={[]} /> }

export const Switcher: Story = {
  render: () => (
    <>
      <HomeScreen installs={installs} attention={attention} />
      <InstallSwitcherSheet installs={installs} currentId="acme" />
    </>
  ),
}

/** The banner a section shows for each not-live status; the switch button in the bar. */
export const StatusBanners: Story = {
  render: () => (
    <>
      <TopBar title="Разработка" leading={<InstallSwitchButton install={installs[0]} />} />
      <Screen>
        {installs
          .filter((i) => i.status.kind !== 'online')
          .map((i) => (
            <View key={i.id}>
              <Text variant="caption" tone="muted" style={{ paddingHorizontal: 12 }}>
                {i.name}
              </Text>
              <InstallBanner status={i.status} onRepair={() => {}} />
            </View>
          ))}
      </Screen>
    </>
  ),
}
