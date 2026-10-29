/*
  The Development section's shapes (#629): a task as the list shows it, the detail the task
  screen draws, and the pieces of its tabs. Mirrors the web cabinet's `Task` / `TaskDetail`.
*/
import type { Attachment } from '../../../model.ts'
import type { Question } from '../questions.tsx'

export type TaskStageId =
  'request' | 'formulation' | 'decomposition' | 'development' | 'review' | 'publication' | 'merged'

export const STAGE_ORDER: readonly TaskStageId[] = [
  'request',
  'formulation',
  'decomposition',
  'development',
  'review',
  'publication',
  'merged',
]

export interface TaskStage {
  index: number
  id: TaskStageId
  stopped: boolean
  rejected?: boolean
}

/** The gate the pipeline waits at, as the list knows it. */
export type GatePhase =
  'none' | 'running' | 'clarify' | 'gate' | 'decomposing' | 'preparing' | 'implementing' | 'review'

export type PostPoolStep = 'sync' | 'conflicts' | 'acceptance' | 'rework' | 'open_prs'

export interface Pause {
  by: string
  reason: 'user' | 'balance' | 'runway'
  when: string
}

export interface TaskRow {
  number: number
  title: string
  state: 'open' | 'closed'
  stage: TaskStage
  draft?: boolean
  subtasksTotal: number
  subtasksDone: number
  openFindings?: number
  step?: PostPoolStep
  devprep?: boolean
  costRub?: number
  filesTotal?: number
  linesAdded?: number
  linesDeleted?: number
  updated: string
}

export interface Subtask {
  number: number
  title: string
  state: 'done' | 'active' | 'waiting'
  stage?: string
  /** The execution scheme (#644): the wave it runs in (1 — first) and what it waits for. */
  wave?: number
  after?: number[]
}

export interface UpstreamHold {
  merged: number
  total: number
  repos: { repo: string; upstream: string; base: string; pr?: string; merged: boolean }[]
}

export interface TaskMetricsData {
  filesTotal: number
  filesAdded: number
  filesModified: number
  filesDeleted: number
  linesAdded: number
  linesDeleted: number
  costRub: number
  tokensIn: number
  tokensOut: number
  /** The lead-time label and what it spans; `live` while a run is going. */
  time?: { value: string; note: string; live?: boolean }
}

export interface TaskDetail extends TaskRow {
  phase: GatePhase
  /** Notes under every stage of the strip, by stage id. */
  stageNotes: Partial<Record<TaskStageId, string>>
  paused?: Pause
  hold?: UpstreamHold
  postanovka: string
  attachments: Attachment[]
  questions?: Question[]
  formulation?: string
  clarifications: { topic: string; question: string; answer?: string }[]
  decompositionReport?: string
  inProgress?: { number: number; title: string; stage: string }[]
  subtasks: Subtask[]
  metrics?: TaskMetricsData
  exportable: boolean
  /** The elapsed time of the current step, for the status line. */
  stepElapsed?: string
  /** The baseline gate waiting undecided: what the pipeline found (#94). */
  baseline?: { invite: string }
}

export type ChangeKind = 'added' | 'modified' | 'deleted'

export interface ChangedFile {
  path: string
  kind: ChangeKind
  add: number
  del: number
  outside?: boolean
}

export interface TestEntry {
  file: string
  /** `*` is the whole file. */
  case: string
  status: 'active' | 'disabled'
  scope?: 'task' | 'permanent'
  reason?: string
}

export type HistoryTone = 'action' | 'success' | 'error' | 'info' | 'neutral'

export interface HistoryEvent {
  id: string
  tone: HistoryTone
  title: string
  when: string
  unread?: boolean
  count?: number
}

/** What the run-controls menu may offer, by the task's state. */
export type RunAction = 'continue' | 'pause' | 'stop' | 'resume' | 'close'

export interface RepoBranchPick {
  name: string
  branches: string[]
  defaultBranch: string
  /** An empty repo cannot be a source. */
  empty?: boolean
}
