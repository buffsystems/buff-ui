/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Segmented } from '../../Field.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** What the agent is doing (#894): working on the task, drafting a plan, or setting itself up. */
export type WorkMode = 'work' | 'plan' | 'setup'

const LABEL: Record<WorkMode, string> = {
  work: 'buffcode.work',
  plan: 'buffcode.plan',
  setup: 'buffcode.setupGroup',
}
const HINT: Record<WorkMode, string> = {
  work: 'buffcode.workHint',
  plan: 'buffcode.planHint',
  setup: 'buffcode.setupHint',
}

/** The name of a mode that is not plain work, for the lines that name the session's state. */
export const workModeLabel = (work: WorkMode): string | undefined =>
  work === 'work' ? undefined : LABEL[work]

/**
 * The work mode as one visible switch (#894): Work, Plan, Setup — the mode in force is marked and
 * any other is one tap away. A machine without the plan or the setup agent does not offer it.
 */
export function WorkModeControl({
  work,
  plan = true,
  setup = true,
  disabled = false,
  onWork,
}: {
  work: WorkMode
  plan?: boolean
  setup?: boolean
  disabled?: boolean
  onWork?: (next: WorkMode) => void
}) {
  const t = useT()
  const theme = useTheme()
  const modes = (['work', 'plan', 'setup'] as const).filter(
    (id) => id === 'work' || id === work || (id === 'plan' ? plan : setup),
  )
  return (
    <View
      style={{ gap: theme.space(2), opacity: disabled ? 0.5 : 1 }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <Segmented
        options={modes.map((id) => ({ id, label: t(LABEL[id]) }))}
        value={work}
        onChange={(id) => id !== work && onWork?.(id as WorkMode)}
      />
      <Text variant="caption" tone="muted">
        {t(HINT[work])}
      </Text>
    </View>
  )
}
