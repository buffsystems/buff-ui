import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  ProjectsScreen,
  type ProjectSort,
  type ProjectsView,
} from '../../src/native/screens/buffcode/index.ts'
import {
  blockedEe,
  machine,
  offline,
  projects,
  repair,
  serviceDown,
  sessions,
} from './fixtures-buffcode.ts'
import { withPhone } from './PhoneFrame.tsx'

/** Проекты, которые знает служба Buff Code на машине. */
const meta = {
  title: 'Mobile/BuffCode/Projects',
  decorators: [withPhone],
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const status = { kind: 'online' } as const

// #938: the sessions of all the projects, each with its project's name.
const recents = sessions.map((s, i) => ({
  ...s,
  projectId: i % 3 === 2 ? 'site' : 'billing',
  project: i % 3 === 2 ? 'site' : 'billing-service',
}))

/** Both views alive: the tabs switch, the order is picked, the search filters. */
function Home({ view: initial }: { view: ProjectsView }) {
  const [view, setView] = useState(initial)
  const [sort, setSort] = useState<ProjectSort>('recent')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  return (
    <ProjectsScreen
      install={machine}
      status={status}
      projects={
        sort === 'name' ? [...projects].sort((a, b) => a.name.localeCompare(b.name)) : projects
      }
      view={view}
      onView={setView}
      sort={sort}
      onSort={setSort}
      recents={recents.filter((s) => `${s.title} ${s.project}`.toLowerCase().includes(q))}
      query={query}
      onQuery={setQuery}
    />
  )
}

export const Recent: Story = { render: () => <Home view="recent" /> }
export const ByProjects: Story = { render: () => <Home view="projects" /> }
export const RecentLoading: Story = {
  render: () => (
    <ProjectsScreen
      install={machine}
      status={status}
      projects={projects}
      view="recent"
      onView={() => {}}
      recentsLoading
    />
  ),
}
export const RecentEmpty: Story = {
  render: () => (
    <ProjectsScreen
      install={machine}
      status={status}
      projects={projects}
      view="recent"
      onView={() => {}}
    />
  ),
}

export const List: Story = {
  render: () => <ProjectsScreen install={machine} status={status} projects={projects} />,
}
export const Empty: Story = {
  render: () => <ProjectsScreen install={machine} status={status} projects={[]} />,
}
export const Loading: Story = {
  render: () => <ProjectsScreen install={machine} status={status} projects={[]} loading />,
}
export const Offline: Story = {
  render: () => <ProjectsScreen install={machine} status={offline} projects={projects} />,
}
export const ServiceDown: Story = {
  render: () => <ProjectsScreen install={machine} status={serviceDown} projects={projects} />,
}
export const BlockedByPolicy: Story = {
  render: () => <ProjectsScreen install={machine} status={blockedEe} projects={projects} />,
}
export const NeedsRepair: Story = {
  render: () => (
    <ProjectsScreen install={machine} status={repair} projects={projects} onRepair={() => {}} />
  ),
}
