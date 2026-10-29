// Fake data of the Cabinet stories (#629): the shell, plus every section's fixtures.
import type { ShellProps } from '../../src/native/screens/cabinet/index.ts'
import { installs } from './fixtures.ts'

export const shell: ShellProps = {
  install: installs[0],
  badges: { dev: 2, review: 3, audits: 1 },
}

export const offline = { kind: 'offline', since: '14:20' } as const
export const online = { kind: 'online' } as const

export * from './fixtures-cabinet-dev.ts'
export * from './fixtures-cabinet-ask.ts'
export * from './fixtures-cabinet-review.ts'
export * from './fixtures-cabinet-knowledge.ts'
export * from './fixtures-cabinet-audits.ts'
