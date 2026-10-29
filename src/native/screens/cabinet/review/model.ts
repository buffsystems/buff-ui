/*
  The Review section's shapes (#629): a task waiting in the queue, the review of one task
  with its pull requests, findings, checks and the repositories a decision publishes to.
  Mirrors the web's `ReviewData` / `ReviewFinding` / `TaskChecks`.
*/
import type { Attachment } from '../../../model.ts'
import type { GatePhase } from '../dev/model.ts'

export interface ReviewQueueRow {
  number: number
  title: string
  openFindings: number
  /** «ждёт с …» — a relative day. */
  since?: string
}

export type ReviewFileStatus = 'added' | 'modified' | 'deleted' | 'renamed' | 'binary'

export interface ReviewFile {
  path: string
  oldPath?: string
  status: ReviewFileStatus
  add: number
  del: number
}

export interface ReviewPr {
  repo: string
  number: number
  title: string
  add: number
  del: number
  files: ReviewFile[]
}

export type FindingStatus = 'pending' | 'approved' | 'rejected' | 'resolved'

export interface Finding {
  id: string
  title: string
  /** Markdown. */
  detail?: string
  source: 'user' | 'model'
  status: FindingStatus
}

export type CheckStatus = 'passed' | 'failed' | 'running' | 'untested' | 'unknown'

export interface CheckRun {
  status: CheckStatus
  hasLog?: boolean
  duration?: string
  runs?: number
}

export interface ReviewChecks {
  build: CheckRun
  tests: CheckRun
  inventory?: { before: number; after: number; added: number; reenabled: number }
  findings: { open: number; resolved: number; total: number }
}

export interface Review {
  task: number
  title: string
  /** `review` while it waits; anything else is «not on the gate». */
  phase: GatePhase
  closed?: boolean
  since?: string
  prs: ReviewPr[]
  /** The development-tools change: its summary and counts. */
  superproject?: { summary?: string; files: number; add: number; del: number }
  superprojectOnly?: boolean
  landError?: string
  findings: Finding[]
  checks?: ReviewChecks
  /** Where approval publishes: «GitLab · grp/repo»; none = merge straight in. */
  publishTargets: string[]
}

export type RepoProvider = 'github' | 'gitlab' | 'bitbucket' | 'gitea'

/** One changed repository in the approve sheet: its upstream and the access check. */
export interface ApproveRepo {
  repo: string
  provider?: RepoProvider
  upstream?: string
  defaultBranch: string
  branch?: string
  access: 'noToken' | 'checking' | 'ok' | 'denied'
  reason?: string
}

export interface FindingDraft {
  title: string
  detail: string
  attachments: Attachment[]
}
