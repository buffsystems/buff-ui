import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomeScreen, SidebarDrawer, type SidebarContent } from '../../src/native/index.ts'
import { CabinetShell } from '../../src/native/screens/cabinet/index.ts'
import { SECTION_ICON, type SectionId } from '../../src/native/screens/cabinet/model.ts'
import { SessionScreen } from '../../src/native/screens/buffcode/index.ts'
import { attention, installs } from './fixtures.ts'
import { shell } from './fixtures-cabinet.ts'
import { machine, projects, sessions } from './fixtures-buffcode.ts'
import { base } from './BuffCodeSession.stories.tsx'
import { withPhone } from './PhoneFrame.tsx'

/**
 * The navigation drawer (owner's review of #629): installs, then the current install's
 * sections or projects and sessions, then the app rows. Opened from the hamburger in any
 * top bar; the bottom tab bar keeps quick switching inside a cabinet install.
 */
const meta = {
  title: 'Mobile/Navigation/Sidebar',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SECTIONS: SectionId[] = ['dev', 'ask', 'research', 'review', 'knowledge', 'audits', 'repos']
const LABELS: Record<SectionId, string> = {
  dev: 'Разработка',
  ask: 'Спросить',
  research: 'Глубокое исследование',
  review: 'Ревью',
  knowledge: 'База знаний',
  audits: 'Аудиты',
  repos: 'Репозитории',
}

const cabinet: SidebarContent = {
  kind: 'cabinet',
  selected: 'dev',
  sections: SECTIONS.map((id) => ({
    id,
    label: LABELS[id],
    icon: SECTION_ICON[id],
    badge: shell.badges?.[id],
  })),
}

const machineContent: SidebarContent = {
  kind: 'machine',
  selectedSession: sessions[0].id,
  totalSessions: 12,
  projects: projects.slice(0, 2).map((p, i) => ({
    id: p.id,
    name: p.name,
    sessions: (i === 0 ? sessions.slice(0, 3) : sessions.slice(3, 5)).map((s) => ({
      id: s.id,
      title: s.title,
      running: s.running,
      attention: (s.attention ?? 0) > 0,
    })),
  })),
}

/** The drawer's footer rows (home, notifications, settings, add an install). */
const footer = { onHome() {}, onNotifications() {}, onSettings() {}, onAddInstall() {} }

/** Over a cabinet section: the install's seven sections with their badges. */
export const OverCabinet: Story = {
  render: () => (
    <>
      <CabinetShell shell={shell} section="dev">
        <HomeScreen installs={installs} attention={attention} />
      </CabinetShell>
      <SidebarDrawer
        installs={installs}
        currentId="acme"
        content={cabinet}
        user="Анна Громова"
        notifications={4}
        {...footer}
      />
    </>
  ),
}

/** Over a Buff Code session: the machine's projects with their recent sessions. */
export const OverBuffCode: Story = {
  render: () => (
    <>
      <SessionScreen {...base} />
      <SidebarDrawer
        installs={installs}
        currentId={machine.id}
        content={machineContent}
        user="Анна Громова"
        notifications={1}
        {...footer}
      />
    </>
  ),
}

/** The current install is unavailable: the drawer says so under its content. */
export const CurrentOffline: Story = {
  render: () => (
    <>
      <HomeScreen installs={installs} attention={attention} />
      <SidebarDrawer
        installs={installs}
        currentId="ce-office"
        content={cabinet}
        user="Анна Громова"
        {...footer}
      />
    </>
  ),
}

/** English. */
export const English: Story = {
  render: () => (
    <>
      <HomeScreen installs={installs} attention={attention} />
      <SidebarDrawer
        installs={installs}
        currentId="acme"
        content={cabinet}
        user="Anna Gromova"
        notifications={4}
        {...footer}
      />
    </>
  ),
  globals: { locale: 'en' },
}
