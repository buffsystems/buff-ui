/*
  The Repositories section's shapes (#629): a repository with its upstream and the drift of
  every branch, the deferred development-tool merges, and the add form. Mirrors the web's
  `RepoSyncState` / `DevprepHold`.
*/
import type { RepoProvider } from '../review/model.ts'

export type BranchSyncStatus = 'insync' | 'behind' | 'missing' | 'ahead' | 'diverged' | 'unknown'

export interface RepoBranch {
  name: string
  status: BranchSyncStatus
  ahead: number
  behind: number
  reason?: string
}

export interface Repo {
  name: string
  provider?: RepoProvider
  upstream?: string
  defaultBranch: string
  hasToken: boolean
  error?: string
  branches: RepoBranch[]
  pointer?: { branch: string; behind: number; status: 'insync' | 'behind' | 'unknown' }
  syncing?: boolean
}

export type HoldStatus = 'awaiting' | 'ready' | 'merging' | 'conflict' | 'merged'

export interface RepoHold {
  task: number
  status: HoldStatus
  merged: number
  total: number
  repos: { repo: string; upstream: string; pr?: string; merged: boolean }[]
}

export interface AddRepoForm {
  url: string
  name: string
  token: string
  createDev: boolean
  devName: string
}

/** How many branches of a repository differ from upstream. */
export function driftOf(repo: Repo): number {
  return repo.branches.filter((b) => b.status !== 'insync' && b.status !== 'unknown').length
}
