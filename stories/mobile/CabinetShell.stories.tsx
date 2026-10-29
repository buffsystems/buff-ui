import type { Meta, StoryObj } from '@storybook/react-vite'
import { View } from 'react-native'
import { Text } from '../../src/native/index.ts'
import { CabinetShell, MoreSectionsSheet } from '../../src/native/screens/cabinet/index.ts'
import { shell } from './fixtures-cabinet.ts'
import { withPhone } from './PhoneFrame.tsx'

const meta = {
  title: 'Mobile/Cabinet/Shell',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** The frame of every section: switcher, title, the tab bar with badges. */
export const Frame: Story = {
  render: () => (
    <CabinetShell shell={shell} section="dev">
      <View style={{ padding: 16 }}>
        <Text tone="muted">…</Text>
      </View>
    </CabinetShell>
  ),
}

/** A section behind «More»: the «More» tab is the active one. */
export const MoreSectionActive: Story = {
  render: () => (
    <CabinetShell shell={shell} section="audits">
      <View style={{ padding: 16 }}>
        <Text tone="muted">…</Text>
      </View>
    </CabinetShell>
  ),
}

/** The «More» sheet with the three sections that did not fit the bar. */
export const MoreSheet: Story = {
  render: () => (
    <CabinetShell shell={shell} section="dev" moreOpen>
      <View style={{ padding: 16 }}>
        <Text tone="muted">…</Text>
      </View>
    </CabinetShell>
  ),
}

export const MoreSheetAlone: Story = {
  render: () => (
    <>
      <CabinetShell shell={{ ...shell, badges: {} }} section="knowledge">
        <View style={{ padding: 16 }}>
          <Text tone="muted">…</Text>
        </View>
      </CabinetShell>
      <MoreSectionsSheet selected="knowledge" badges={{ repos: 2 }} />
    </>
  ),
}
