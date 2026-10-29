/*
  The Knowledge base's shapes (#629): an entry, the AI pass that extends the base, and the
  editor's form. Mirrors the web's `KnowledgeEntry` / `KnowledgePass` / `KnowledgeForm`.
*/
export type KnowledgeType = 'rule' | 'fact' | 'pitfall'

export const KNOWLEDGE_TYPES: readonly KnowledgeType[] = ['rule', 'fact', 'pitfall']

export interface KnowledgeEntry {
  id: string
  /** The address: `sborka-trebuet-tulcheyn`. */
  name: string
  title: string
  description: string
  type: KnowledgeType
  /** Markdown. */
  body: string
  /** The project, or none for the organisation. */
  project?: string
  task?: number
  pinned: boolean
  permanent: boolean
  needsReview: boolean
  reviewNote?: string
  author: string
  authorAi: boolean
  updatedBy?: string
  updatedByAi?: boolean
  updated: string
  archived?: { by: string; when: string; reason: string }
}

export interface KnowledgePass {
  status: 'running' | 'done' | 'failed'
  paused?: { by: string; when: string }
  boundary: 'task' | 'audit' | 'manual'
  ref: string
  outcome?: 'rejected' | 'stopped'
  started: string
  finished?: string
  added: number
  updated: number
  merged: number
  archived: number
  flagged: number
  tokens?: number
  time?: string
  error?: string
}

export interface KnowledgeForm {
  title: string
  name: string
  description: string
  type: KnowledgeType
  /** The scope label: the organisation, a project, a task. */
  scope: string
  body: string
  pinned: boolean
  permanent: boolean
}

export type KnowledgeFilter =
  | 'org'
  | 'human'
  | 'ai'
  | 'pinned'
  | 'review'
  | 'task'
  | `type:${KnowledgeType}`
  | `project:${string}`
