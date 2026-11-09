import type { Meta, StoryObj } from '@storybook/react-vite'
import { PublicLinksScreen, ShareSheet, type PublicLinkRow } from '../../src/native/index.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Public links (#821, epic #769): the share sheet and Settings → Public links. */
const meta = {
  title: 'Mobile/Share',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const previews = [
  { id: 'u1', role: 'user' as const, text: 'Собери дизайн-систему для мобильного приложения' },
  {
    id: 'a1',
    role: 'assistant' as const,
    text: 'Готово: токены, кнопки, поля и карточки. Экраны — в следующем шаге.',
  },
  { id: 'u2', role: 'user' as const, text: 'Добавь тёмную тему' },
]

export const Sheet: Story = {
  render: () => (
    <ShareSheet sourceTitle="Дизайн-система" previews={previews} onClose={() => undefined} />
  ),
}
export const SheetPicking: Story = {
  render: () => (
    <ShareSheet
      sourceTitle="Дизайн-система"
      previews={previews}
      preselect={['a1']}
      onClose={() => undefined}
    />
  ),
}
export const SheetError: Story = {
  render: () => (
    <ShareSheet
      sourceTitle="Дизайн-система"
      previews={previews}
      error="Нет связи со шлюзом dev.buff.systems: ссылку не опубликовать."
      onClose={() => undefined}
    />
  ),
}
export const SheetMade: Story = {
  render: () => (
    <ShareSheet
      sourceTitle="Дизайн-система"
      previews={previews}
      made={{ link: 'https://buff.systems/share/7Qx3mLp9aVbNc2RtYw5KzA', hasPass: false }}
      onClose={() => undefined}
    />
  ),
}

const now = Date.now()
const rows: PublicLinkRow[] = [
  {
    id: '7Qx3mLp9aVbNc2RtYw5KzA',
    installId: 'm1',
    installName: 'Ноутбук Анны',
    kind: 'session',
    title: 'Дизайн-система',
    link: 'https://buff.systems/share/7Qx3mLp9aVbNc2RtYw5KzA',
    sourceTitle: 'Дизайн-система',
    hasPass: true,
    expiresAt: now + 6 * 24 * 3600 * 1000,
    tools: true,
    live: false,
    enabled: true,
    published: true,
    created: now - 3600 * 1000,
  },
  {
    id: 'Kp2wR8sTq4Lm9Xz1Vb3YnA',
    installId: 'i1',
    installName: 'Acme',
    kind: 'research',
    title: 'Рынок платёжных терминалов',
    link: 'https://buff.systems/share/Kp2wR8sTq4Lm9Xz1Vb3YnA',
    sourceTitle: 'Рынок платёжных терминалов',
    hasPass: false,
    expiresAt: null,
    tools: false,
    live: false,
    enabled: false,
    published: true,
    created: now - 2 * 24 * 3600 * 1000,
  },
  {
    id: 'Zq9aB4cD7eF2gH5jK8mN1pA',
    installId: 'i1',
    installName: 'Acme',
    kind: 'ask',
    title: 'Срок реакции по договору',
    link: 'https://buff.systems/share/Zq9aB4cD7eF2gH5jK8mN1pA',
    sourceTitle: null,
    hasPass: false,
    expiresAt: now - 3600 * 1000,
    tools: false,
    live: true,
    enabled: true,
    published: false,
    created: now - 5 * 24 * 3600 * 1000,
  },
]

export const Links: Story = {
  render: () => <PublicLinksScreen rows={rows} onBack={() => undefined} />,
}
export const LinksUnavailable: Story = {
  render: () => (
    <PublicLinksScreen rows={rows.slice(0, 1)} error="Acme — недоступна" onBack={() => undefined} />
  ),
}
export const LinksEmpty: Story = {
  render: () => <PublicLinksScreen rows={[]} onBack={() => undefined} />,
}
export const LinksLoading: Story = {
  render: () => <PublicLinksScreen rows={[]} loading onBack={() => undefined} />,
}
