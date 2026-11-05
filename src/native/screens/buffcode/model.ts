/*
  The shapes the Buff Code machine screens are drawn from (#629): what the window shows of a
  machine — projects, sessions, the timeline, the docks, git, automations, workflows — as plain
  data the app hands in. Presentational: nothing here knows how it was fetched.
*/
import type { Attachment } from '../../model.ts'

export interface BcProject {
  id: string
  name: string
  /** The directory on the machine. */
  path: string
  branch?: string
  sessions: number
  /** A relative time label of the last activity. */
  lastActive?: string
}

/** Where a session was started: the window, the console, or this phone. */
export type SessionOrigin = 'window' | 'console' | 'phone'

export interface BcSession {
  id: string
  projectId: string
  title: string
  origin: SessionOrigin
  when: string
  group: 'today' | 'yesterday' | 'older'
  running?: boolean
  /** Waits for the person: a permission, a question. */
  attention?: number
}

export interface BcModel {
  id: string
  name: string
  provider: string
}

export interface BcAgent {
  id: string
  name: string
}

export type PermissionMode = 'ask' | 'edit' | 'full' | 'custom'

export type ToolStatus = 'running' | 'done' | 'error'

export type TimelineItem =
  | { kind: 'user'; id: string; text: string; when: string; attachments?: Attachment[] }
  | { kind: 'assistant'; id: string; markdown: string; model?: string; streaming?: boolean }
  | {
      kind: 'tool'
      id: string
      tool: string
      title: string
      status: ToolStatus
      detail?: string
      output?: string
    }
  | { kind: 'background'; id: string; tasks: { title: string; status: ToolStatus }[] }
  /** The model's to-do list (#752, `todo_update`): the whole list as of this call. */
  | { kind: 'todo'; id: string; items: TodoItem[] }
  /** A subagent's call (#753): its session opens read-only; the result is Markdown. */
  | {
      kind: 'subagent'
      id: string
      title: string
      agent?: string
      status: ToolStatus
      sessionID?: string
      output?: string
      background?: boolean
    }
  /** A file the agent handed over (#708): the path inside the session's folder. */
  | {
      kind: 'file'
      id: string
      path: string
      name: string
      mime: string
      bytes: number
      note?: string
    }
  /** A service notice (#711): the goal, a workflow — a label and what happened. */
  | { kind: 'notice'; id: string; label: string; summary?: string }
  /**
   * A failed turn. `files` (#757): the model refused a request with files — the card offers to
   * analyse them with code, switch the model or go on without them.
   */
  | { kind: 'error'; id: string; text: string; files?: { names: string[] } }
  /**
   * A context compaction (#761): its summary for the model, clipped as the timeline comes; the
   * whole text is fetched when the person opens it. No status — an old service.
   */
  | {
      kind: 'compaction'
      id: string
      when: string
      status?: CompactionStatus
      summary?: string
    }

export type CompactionStatus = 'running' | 'completed' | 'failed'

/** The ways on after a refusal with files (#757). */
export type FileChoice = 'analyze' | 'switch-model' | 'without-files'

export type TodoStatus = 'pending' | 'in_progress' | 'completed'
export interface TodoItem {
  content: string
  status: TodoStatus
}

/** A subagent of the session (#753): the working ones sit behind the composer's icon (#762). */
export interface SubagentRef {
  id: string
  title: string
  status: ToolStatus
  sessionID?: string
  /** The agent that runs it (#762). */
  agent?: string
}

/** The session's goal for the bar above the composer (#711). */
export interface GoalBarState {
  line: string
  reason?: string
  status: 'active' | 'checking' | 'paused' | 'complete'
}

export interface PermissionRequest {
  title: string
  hint?: string
  patterns: string[]
  diffFile?: string
  subagent?: boolean
  /** What «always» would cover; absent when «always» is not offered. */
  alwaysNote?: string
}

export interface QuestionOption {
  value: string
  label: string
  hint?: string
}

export interface Question {
  text: string
  options: QuestionOption[]
  multiple?: boolean
}

export type McpField =
  | { key: string; kind: 'text'; label: string; hint?: string }
  | { key: string; kind: 'switch'; label: string }
  | { key: string; kind: 'select'; label: string; options: string[] }

export interface McpRequest {
  server: string
  message: string
  fields: McpField[]
}

export interface WebSearchRequest {
  providers: { id: string; name: string }[]
}

export type Dock =
  | { kind: 'permission'; request: PermissionRequest }
  | { kind: 'question'; questions: Question[]; index: number }
  | { kind: 'mcp'; request: McpRequest }
  | { kind: 'websearch'; request: WebSearchRequest }

export interface ChangedFile {
  path: string
  status: 'modified' | 'added' | 'deleted'
  added: number
  removed: number
  diff: string[]
}

export interface FileNode {
  path: string
  name: string
  kind: 'dir' | 'file'
  depth: number
}

export interface Usage {
  cost: string
  /** The context window's use, 0..100. */
  percent: number
  tokens: { input: number; output: number; cache: number; reasoning: number }
  turns: { title: string; tokens: number; cost: string }[]
}

export interface GitState {
  branch?: string
  ahead: number
  behind: number
  changes: { path: string; status: ChangedFile['status'] }[]
  branches: string[]
  history: { hash: string; subject: string; when: string }[]
}

export interface TrustItem {
  id: string
  kind: 'hook' | 'command'
  title: string
  note: string
}

export interface SideMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  tools?: string[]
}

export interface SessionDetails {
  directory: string
  branch?: string
  baseBranch?: string
  origin: SessionOrigin
  created: string
  mcp: { name: string; ok: boolean }[]
  lsp: string[]
}

export interface Automation {
  id: string
  title: string
  schedule: string
  next?: string
  paused: boolean
  runs: number
  last?: string
  state: 'idle' | 'running' | 'waiting'
}

export interface AutomationRun {
  id: string
  when: string
  source: 'manual' | 'schedule'
  status: 'done' | 'failed' | 'running' | 'waiting'
  summary?: string
}

export interface WorkflowArg {
  name: string
  type: 'string' | 'number' | 'boolean'
  required: boolean
  description?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  whenToUse?: string
  args: WorkflowArg[]
  lastRun?: string
}

export interface WorkflowRun {
  id: string
  label: string
  workflow?: string
  state: 'running' | 'done' | 'failed' | 'paused'
  elapsed: string
  tokens: { total: number; input: number; output: number; cache: number }
  files: {
    added: number
    modified: number
    deleted: number
    linesAdded: number
    linesDeleted: number
  }
  phases: { title: string; status: ToolStatus; actor?: string }[]
  waiting?: { actor: string }[]
  questions?: { id: string; actor: string; text: string }[]
  artifacts?: { name: string; version: number }[]
  result?: string
  log: string[]
  amended?: boolean
}

export interface SlashCommand {
  name: string
  description: string
  source: 'builtin' | 'project' | 'skill' | 'agent'
}
