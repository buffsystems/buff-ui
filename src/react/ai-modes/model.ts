/*
  Режимы ИИ (#832, эпик #783): модель матрицы «шаг × роль» — чистые правила, которыми живёт
  AiModeMatrix. Словарь шагов приходит с сервера (common-lib ai_modes); здесь он складывается в
  сценарии (фазы задачи — под одной карточкой), а ячейка читается слоями: своё → унаследованное.
*/
import type { Locale } from '../../shared/locale.ts'
import { aiModeSummary } from '../../shared/ai-modes.ts'

export interface AiModeLabel {
  ru: string
  en: string
}

export interface AiModeRoleDef {
  id: string
  label: AiModeLabel
}

export interface AiModeStepDef {
  id: string
  label: AiModeLabel
  roles: AiModeRoleDef[]
}

/** One cell of a layer as the warehouse stores it: NULL — not set, 0 — the model maximum. */
export interface AiModeCell {
  step: string
  role: string
  thinking?: string | null
  context_tokens?: number | null
}

export interface AiModeGroup {
  id: string
  label: AiModeLabel
  steps: AiModeStepDef[]
}

const TASK_LABEL: AiModeLabel = { ru: 'Задача', en: 'Task' }

/** Scenarios of the matrix: the task's phases under one card, every other step on its own. */
export function aiModeGroups(steps: readonly AiModeStepDef[]): AiModeGroup[] {
  const groups: AiModeGroup[] = []
  for (const step of steps) {
    if (step.id.startsWith('task_')) {
      const task = groups.find((g) => g.id === 'task')
      if (task) task.steps.push(step)
      else groups.push({ id: 'task', label: TASK_LABEL, steps: [step] })
      continue
    }
    groups.push({ id: step.id, label: step.label, steps: [step] })
  }
  return groups
}

/** A phase's name inside its scenario card: «Задача — разработка» reads as «Разработка». */
export function phaseLabel(step: AiModeStepDef, group: AiModeGroup, locale: Locale): string {
  const full = step.label[locale]
  if (group.steps.length === 1) return full
  const cut = full.split(' — ')
  return cut.length > 1
    ? cut
        .slice(1)
        .join(' — ')
        .replace(/^\p{Ll}/u, (c) => c.toUpperCase())
    : full
}

export type AiModeSource = 'own' | 'inherited' | 'none'

export interface AiModeCellView {
  thinking: { value: string; source: AiModeSource }
  context: { value: number; source: AiModeSource }
}

function find(cells: readonly AiModeCell[], step: string, role: string): AiModeCell | undefined {
  return cells.find((c) => c.step === step && c.role === role)
}

/** The cell as it stands: its own value first, then the inherited layer, else the defaults. */
export function cellValue(
  own: readonly AiModeCell[],
  inherited: readonly AiModeCell[],
  step: string,
  role: string,
): AiModeCellView {
  const mine = find(own, step, role)
  const above = find(inherited, step, role)
  const thinking =
    mine?.thinking != null
      ? { value: mine.thinking, source: 'own' as const }
      : above?.thinking != null
        ? { value: above.thinking, source: 'inherited' as const }
        : { value: 'default', source: 'none' as const }
  const context =
    mine?.context_tokens != null
      ? { value: mine.context_tokens, source: 'own' as const }
      : above?.context_tokens != null
        ? { value: above.context_tokens, source: 'inherited' as const }
        : { value: 0, source: 'none' as const }
  return { thinking, context }
}

/** Every (step, role) of a group. */
export function groupCells(group: AiModeGroup): { step: string; role: string }[] {
  return group.steps.flatMap((s) => s.roles.map((r) => ({ step: s.id, role: r.id })))
}

/** The card's one line: the values when every cell of the scenario agrees, else «Разные». */
export function groupSummary(
  group: AiModeGroup,
  own: readonly AiModeCell[],
  inherited: readonly AiModeCell[],
  locale: Locale,
  modelWindow?: number | null,
): string {
  const views = groupCells(group).map(({ step, role }) => cellValue(own, inherited, step, role))
  const first = views[0]
  const same = views.every(
    (v) => v.thinking.value === first.thinking.value && v.context.value === first.context.value,
  )
  if (!same) return locale === 'ru' ? 'Разные' : 'Mixed'
  return aiModeSummary(
    { thinking: first.thinking.value, contextTokens: first.context.value },
    locale,
    modelWindow,
  )
}
