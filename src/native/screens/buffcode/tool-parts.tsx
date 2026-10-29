/** @jsxRuntime automatic */
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Badge, StatusDot, type Tone } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { CodeBlock } from '../../Code.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { ToolStatus } from './model.ts'

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
