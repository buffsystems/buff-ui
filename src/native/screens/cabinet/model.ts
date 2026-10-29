/*
  The shapes the cabinet shell and every section share (#629). Each section keeps its own
  richer types in `<section>/model.ts`; only what the shell and the common parts need is here.
*/
import type { IconName } from '../../icons.ts'
import type { Install } from '../../model.ts'

/** The seven sections of an install, in the cabinet's order. */
export type SectionId = 'dev' | 'ask' | 'research' | 'review' | 'knowledge' | 'audits' | 'repos'

export const SECTION_IDS: readonly SectionId[] = [
  'dev',
  'ask',
  'research',
  'review',
  'knowledge',
  'audits',
  'repos',
]

export const SECTION_ICON: Record<SectionId, IconName> = {
  dev: 'workflow',
  ask: 'circleHelp',
  research: 'microscope',
  review: 'gitPullRequest',
  knowledge: 'bookOpen',
  audits: 'shieldCheck',
  repos: 'folderGit',
}

/** The sections that sit in the «More» sheet rather than on the tab bar. */
export const MORE_SECTIONS: readonly SectionId[] = ['knowledge', 'audits', 'repos']

/** What every list screen needs to draw the shell around its body. */
export interface ShellProps {
  install: Install
  /** Unread / waiting counts per section, for the tab badges. */
  badges?: Partial<Record<SectionId, number>>
  /** Opens the navigation drawer. */
  onMenu?: () => void
  onSelectSection?: (id: SectionId) => void
  /** Opens search across the install, from every section's top bar. */
  onSearch?: () => void
}

/** A project of the install as pickers show it. */
/** What a section's list belongs to: a development project, a repository, a knowledge space. */
export type ProjectKind = 'dev' | 'git' | 'space'

export interface ProjectRef {
  id: string
  name: string
  /** Unset — a development project. */
  kind?: ProjectKind
}
