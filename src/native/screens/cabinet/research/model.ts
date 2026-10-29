/*
  The Deep research section's shapes (#629): a research thread as the list and the detail
  show it. Mirrors the web's `ResearchThread*`.
*/
import type { Pause } from '../dev/model.ts'
import type { Question } from '../questions.tsx'

export type ResearchStatus = 'researching' | 'waiting' | 'idle' | 'error'

export type ResearchRole = 'user' | 'clarify' | 'analyst' | 'review' | 'note'

export interface ResearchRow {
  id: string
  title?: string
  author: string
  status: ResearchStatus
  updated: string
}

export interface ResearchTurn {
  id: string
  role: ResearchRole
  /** Markdown. */
  body: string
  user?: string
  when: string
  questions?: Question[]
}

export interface Research extends ResearchRow {
  project: string
  /** The document, Markdown; empty while it is being prepared. */
  document: string
  dialog: ResearchTurn[]
  baseCommit?: string
  /** The live ticker while researching; the pass duration once settled. */
  timer?: string
  /** What the analyst is doing now, replaces the status label. */
  progressNote?: string
  paused?: Pause
}

/**
  The document under a top bar that already names it (#691): its opening `# heading` goes when it
  repeats the research's title — on the phone the two stood one under the other.
*/
export function documentBody(document: string, title: string): string {
  const m = /^\s*#\s+(.+)\n?/.exec(document)
  return m && m[1]!.trim() === title.trim() ? document.slice(m[0].length) : document
}
