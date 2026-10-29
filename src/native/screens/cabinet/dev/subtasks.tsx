/** @jsxRuntime automatic */
/*
  The «Subtasks» tab of a task (#629): each with its state — done, running, waiting — and, with
  the execution scheme known (#644), grouped by the waves they run in, each saying what it
  waits for: the cabinet's scheme graph, read top to bottom.
*/
import { View } from 'react-native'
import { Spinner } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import { Row, RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { TaskDetail } from './model.ts'

export function SubtasksTab({ task, onOpen }: { task: TaskDetail; onOpen?: (n: number) => void }) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
      <Text variant="caption" tone="muted">
        {t('devd.subtasksDone', { done: task.subtasksDone, n: task.subtasksTotal })}
      </Text>
      {waves(task.subtasks).map(([wave, items]) => (
        <RowGroup key={wave} title={wave ? t('devd.wave', { n: wave }) : undefined}>
          {items.map((s) => (
            <Row
              key={s.number}
              leading={
                s.state === 'done' ? (
                  <Icon name="checkCircle" size={20} color={c.success} />
                ) : s.state === 'active' ? (
                  <Spinner />
                ) : (
                  <Icon name="clock" size={20} color={c.mutedForeground} />
                )
              }
              title={`#${s.number} ${s.title}`}
              subtitle={[
                t(`devd.sub${s.state[0].toUpperCase()}${s.state.slice(1)}`),
                s.stage,
                s.after?.length
                  ? t('devd.after', { list: s.after.map((n) => `#${n}`).join(', ') })
                  : '',
              ]
                .filter(Boolean)
                .join(' · ')}
              chevron
              onPress={() => onOpen?.(s.number)}
              lines={2}
            />
          ))}
        </RowGroup>
      ))}
    </View>
  )
}

/** Subtasks by wave, in order; without a scheme — one group with no title. */
function waves(subtasks: TaskDetail['subtasks']): [number, TaskDetail['subtasks']][] {
  if (!subtasks.some((s) => s.wave)) return [[0, subtasks]]
  const by = new Map<number, TaskDetail['subtasks']>()
  for (const s of subtasks) by.set(s.wave ?? 0, [...(by.get(s.wave ?? 0) ?? []), s])
  return [...by.entries()].sort(([a], [b]) => a - b)
}
