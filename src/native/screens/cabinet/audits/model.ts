/*
  The Audits section's shapes (#629): the ten sections with their state, a section's
  report, and the runs. Mirrors the web's `Audit` / `AuditDetail` / `AuditSectionRec`.
*/
export type AuditStatus = 'ready' | 'in_progress' | 'scheduled' | 'missing'

export interface AuditSection {
  id: string
  /** «A. Кодовая база и архитектура». */
  title: string
  /** What the section is about, one line. */
  about: string
  status: AuditStatus
  /** The report date, for ready sections. */
  date?: string
  /** Commits the code moved since the audit, per module: «core +12». */
  behind?: { module: string; commits: number }[]
}

export function isStale(s: AuditSection): boolean {
  return s.status === 'ready' && (s.behind?.some((b) => b.commits > 0) ?? false)
}

export function isLocked(s: AuditSection): boolean {
  return s.status === 'in_progress' || s.status === 'scheduled'
}

export interface AuditRun {
  id: string
  sectionIds: string[]
  /** «запущено сегодня». */
  started: string
  paused?: { by: string; when: string }
}

export interface AuditReport {
  section: AuditSection
  /** Markdown. */
  content: string
  wip?: boolean
  findings?: { open: number; inProgress: number; closed: number }
  /** Elapsed since the run started, while in progress. */
  leadTime?: string
  tokens?: string
  /** What the section's run changed: files and lines. */
  changes?: { files: number; add: number; del: number }
}
