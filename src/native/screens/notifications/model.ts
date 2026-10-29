/*
  Notifications (#629): one entry of the phone's list — from the record stream of an install,
  or kept locally — and the catalogue of pushable types per install, as the cabinet's web-push
  settings group them. The SET of types is the install's; the phone only labels and groups.
*/

export type NotificationSource = 'stream' | 'local'

export interface NotificationEntry {
  id: string
  installId: string
  installName: string
  /** The backend's type slug: `gate_ready`, `bc_permission`, … */
  type: string
  title: string
  body?: string
  when: string
  read: boolean
  source: NotificationSource
  /** Where tapping it leads, for the row's hint. */
  target?: string
}

export interface NotificationGroup {
  key: string
  types: string[]
}

const TYPE_GROUP: Record<string, string> = {
  clarify_question: 'task',
  gate_ready: 'task',
  merge_conflict: 'task',
  task_published: 'task',
  task_merged: 'task',
  task_rejected: 'task',
  formulation_approved: 'task',
  formulation_rejected: 'task',
  formulation_rework: 'task',
  task_decomposed: 'task',
  review_needed: 'review',
  review_rework: 'review',
  review_decided: 'review',
  atom_closed: 'atom',
  atom_cooldown: 'atom',
  ask_question: 'ask',
  ask_answer: 'ask',
  ask_error: 'ask',
  research_question: 'research',
  research_done: 'research',
  research_error: 'research',
  flow_failed: 'system',
  repo_imported: 'system',
  repo_synced: 'system',
  devproject_created: 'system',
  space_created: 'system',
  org_created: 'system',
  devprep_started: 'system',
  devprep_ready: 'system',
  bc_turn_complete: 'buffcode',
  bc_permission: 'buffcode',
  bc_question: 'buffcode',
  bc_error: 'buffcode',
}

const GROUP_ORDER = ['task', 'review', 'atom', 'ask', 'research', 'buffcode', 'system', 'other']

/** Every type the cabinet pushes today, in catalogue order. */
export const ALL_TYPES: string[] = Object.keys(TYPE_GROUP)

function camel(slug: string): string {
  return slug.replace(/_(\w)/g, (_, ch: string) => ch.toUpperCase())
}

/** The string key of a type's label: `gate_ready` → `notif.typeGateReady`. */
export function typeKey(type: string): string {
  const name = camel(type)
  return `notif.type${name[0].toUpperCase()}${name.slice(1)}`
}

/** The string key of a group's label: `task` → `notif.groupTask`. */
export function groupKey(group: string): string {
  return `notif.group${group[0].toUpperCase()}${group.slice(1)}`
}

/** A type's label, or its raw slug when the phone does not know it yet — never dropped. */
export function typeLabel(t: (key: string) => string, type: string): string {
  const key = typeKey(type)
  const label = t(key)
  return label === key ? type : label
}

/** Group an install's types the way the cabinet does; unknown types land in «other». */
export function buildGroups(types: string[]): NotificationGroup[] {
  const byGroup = new Map<string, string[]>()
  for (const type of types) {
    const group = TYPE_GROUP[type] ?? 'other'
    byGroup.set(group, [...(byGroup.get(group) ?? []), type])
  }
  return GROUP_ORDER.flatMap((key) => {
    const list = byGroup.get(key)
    return list?.length ? [{ key, types: list }] : []
  })
}

export type TriState = 'all' | 'some' | 'none'

export function groupState(types: string[], enabled: ReadonlySet<string>): TriState {
  const on = types.filter((type) => enabled.has(type)).length
  return on === 0 ? 'none' : on === types.length ? 'all' : 'some'
}
