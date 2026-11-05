/** @jsxRuntime automatic */
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Badge, StatusDot, type Tone } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { CodeBlock } from '../../Code.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { TodoItem, TodoStatus, ToolStatus } from './model.ts'

export function statusTone(status: ToolStatus): Tone {
  return status === 'running' ? 'info' : status === 'done' ? 'ok' : 'crit'
}

const TOOL_ICON: Record<string, IconName> = {
  bash: 'terminal',
  read: 'fileText',
  edit: 'pencil',
  write: 'pencil',
  grep: 'search',
  glob: 'search',
  webfetch: 'globe',
  task: 'bot',
}

/** A tool call: collapsed to one line, expanded to its output. */

export function ToolCall({
  tool,
  title,
  status,
  detail,
  output,
  expanded: initial = false,
}: {
  tool: string
  title: string
  status: ToolStatus
  detail?: string
  output?: string
  expanded?: boolean
}) {
  const t = useT()
  const theme = useTheme()
  const [open, setOpen] = useState(initial)
  const label = t(
    status === 'running'
      ? 'buffcode.toolRunning'
      : status === 'done'
        ? 'buffcode.toolDone'
        : 'buffcode.toolError',
  )
  return (
    <View
      style={{
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.muted,
        overflow: 'hidden',
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${tool}: ${title}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          minHeight: 44,
          paddingHorizontal: theme.space(3),
        }}
      >
        <Icon name={TOOL_ICON[tool] ?? 'wrench'} size={16} color={theme.colors.mutedForeground} />
        <Text variant="mono" tone="fg2" numberOfLines={1} style={{ flex: 1 }}>
          {title}
        </Text>
        <Badge tone={statusTone(status)}>{label}</Badge>
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={16}
          color={theme.colors.mutedForeground}
        />
      </Pressable>
      {open && (detail || output) && (
        <View
          style={{
            paddingHorizontal: theme.space(3),
            paddingBottom: theme.space(3),
            gap: theme.space(2),
          }}
        >
          {detail && (
            <Text variant="caption" tone="muted">
              {detail}
            </Text>
          )}
          {output && <CodeBlock code={output} />}
        </View>
      )}
    </View>
  )
}

/** Work moved to the background: shells and subagents still running, each with Output / Halt. */

export function BackgroundWork({
  tasks,
  disabled = false,
  onOutput,
  onHalt,
}: {
  tasks: { title: string; status: ToolStatus }[]
  disabled?: boolean
  onOutput?: (index: number) => void
  onHalt?: (index: number) => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <View
      style={{
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.space(3),
        gap: theme.space(2),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="clock" size={16} color={theme.colors.mutedForeground} />
        <Text variant="label" tone="fg2">
          {t('buffcode.background')}
        </Text>
      </View>
      {tasks.map((task, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
          <StatusDot tone={statusTone(task.status)} pulse={task.status === 'running'} />
          <Text variant="label" numberOfLines={1} style={{ flex: 1 }}>
            {task.title}
          </Text>
          <Button size="sm" variant="ghost" onPress={() => onOutput?.(i)} disabled={disabled}>
            {t('buffcode.output')}
          </Button>
          {task.status === 'running' && (
            <Button size="sm" onPress={() => onHalt?.(i)} disabled={disabled}>
              {t('buffcode.halt')}
            </Button>
          )}
        </View>
      ))}
    </View>
  )
}

const TODO_ICON: Record<TodoStatus, IconName> = {
  completed: 'checkCircle',
  in_progress: 'play',
  pending: 'clock',
}
const TODO_LABEL: Record<TodoStatus, string> = {
  completed: 'buffcode.todoCompleted',
  in_progress: 'buffcode.todoInProgress',
  pending: 'buffcode.todoPending',
}

/** The model's to-do list (#752): done, in progress or waiting — the whole list as of this call. */
export function TodoCard({ items }: { items: TodoItem[] }) {
  const t = useT()
  const theme = useTheme()
  const done = items.filter((i) => i.status === 'completed').length
  const current =
    items.find((i) => i.status === 'in_progress') ?? items.find((i) => i.status === 'pending')
  return (
    <View
      accessibilityLabel={`${t('buffcode.todos')}: ${t('buffcode.todoProgress', { done: String(done), total: String(items.length) })}`}
      style={{
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.muted,
        padding: theme.space(3),
        gap: theme.space(2),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        <Icon name="listChecks" size={16} color={theme.colors.mutedForeground} />
        <Text variant="label" tone="fg2" style={{ flex: 1 }} numberOfLines={1}>
          {t('buffcode.todos')} ·{' '}
          {t('buffcode.todoProgress', { done: String(done), total: String(items.length) })}
          {current ? ` · ${current.content}` : ` · ${t('buffcode.todoAllDone')}`}
        </Text>
      </View>
      {items.map((item, i) => (
        <View
          key={i}
          accessibilityLabel={`${t(TODO_LABEL[item.status])}: ${item.content}`}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.space(2) }}
        >
          <Icon
            name={TODO_ICON[item.status]}
            size={16}
            color={
              item.status === 'completed'
                ? theme.colors.success
                : item.status === 'in_progress'
                  ? theme.colors.primary
                  : theme.colors.mutedForeground
            }
          />
          <Text
            variant="body"
            tone={item.status === 'completed' ? 'muted' : 'fg'}
            style={{
              flex: 1,
              ...(item.status === 'completed'
                ? { textDecorationLine: 'line-through' as const }
                : {}),
            }}
          >
            {item.content}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** A subagent's result as the tool returns it: one outer wrapper tag, if any, is not for people. */
export function subagentMarkdown(output: string): string {
  const m = /^\s*<([A-Za-z_][\w-]*)(?:\s[^>]*)?>\s*([\s\S]*?)\s*<\/\1>\s*$/.exec(output)
  return (m ? m[2]! : output).trim()
}

/** A subagent's call (#753): who, what, how it goes; the result as Markdown; a tap opens its session. */
export function SubagentCard({
  title,
  agent,
  status,
  output,
  background = false,
  onOpen,
}: {
  title: string
  agent?: string
  status: ToolStatus
  output?: string
  background?: boolean
  onOpen?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const markdown = output ? subagentMarkdown(output) : ''
  const head = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        minHeight: 44,
        paddingHorizontal: theme.space(3),
      }}
    >
      <StatusDot tone={statusTone(status)} pulse={status === 'running'} />
      <Icon name="bot" size={16} color={theme.colors.mutedForeground} />
      <View style={{ flex: 1 }}>
        <Text variant="label" numberOfLines={1}>
          {agent ?? t('buffcode.subagentDefault')}
          {background ? ` · ${t('buffcode.subagentInBackground')}` : ''}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={2}>
          {title}
        </Text>
      </View>
      {onOpen ? (
        <Icon name="chevronRight" size={16} color={theme.colors.mutedForeground} />
      ) : markdown ? (
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={16}
          color={theme.colors.mutedForeground}
        />
      ) : null}
    </View>
  )
  return (
    <View
      style={{
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.muted,
        overflow: 'hidden',
      }}
    >
      {onOpen ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('buffcode.subagentOpen')}
          onPress={onOpen}
        >
          {head}
        </Pressable>
      ) : markdown ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen((v) => !v)}
        >
          {head}
        </Pressable>
      ) : (
        head
      )}
      {markdown && (onOpen || open) ? (
        <View style={{ paddingHorizontal: theme.space(3), paddingBottom: theme.space(3) }}>
          <Prose markdown={markdown} />
        </View>
      ) : null}
    </View>
  )
}
