/*
  The Ask section's shapes (#629): a thread as the list and the thread screen show it, and
  Mirrors the web's `AskThread*`. The cabinet does not pick a model (only Buff Code does).
*/
import type { Attachment } from '../../../model.ts'
import type { Question } from '../questions.tsx'

/** running = queued; answering = the AI thinks; waiting = the AI asked the person. */
export type AskStatus = 'running' | 'answering' | 'waiting' | 'idle' | 'error'

export interface AskThreadRow {
  id: string
  title?: string
  author: string
  status: AskStatus
  updated: string
}

export interface AskMessage {
  id: string
  role: 'user' | 'assistant'
  /** Markdown. */
  content: string
  reasoning?: string
  questions?: Question[]
  attachments?: Attachment[]
  when?: string
}

export interface AskThread extends AskThreadRow {
  project: string
  messages: AskMessage[]
  /** The «thinking» timer, `m:ss`, while running / answering. */
  elapsed?: string
  /** Live reasoning text while answering. */
  liveReasoning?: string
  /** Opened from a task review: the task number. */
  task?: number
}

export type AskKind = 'project' | 'space' | 'review'
