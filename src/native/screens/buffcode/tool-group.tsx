/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from '../../Icon.tsx'
import { Spinner } from '../../Spinner.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { TimelineItem } from './model.ts'
import { ToolCall } from './tool-parts.tsx'

type Foldable = Extract<TimelineItem, { kind: 'tool' | 'subagent' }>
export type Folded = TimelineItem | { kind: 'tools'; id: string; items: Foldable[] }

// A running subagent stays in sight, as in the window; a finished one folds with the tools.
const foldable = (item: TimelineItem): item is Foldable =>
  item.kind === 'tool' || (item.kind === 'subagent' && item.status !== 'running')

/** Tool calls in a row (#758) fold into one group, as the window does; one call alone stays a row. */
export function foldTools(items: TimelineItem[]): Folded[] {
  const out: Folded[] = []
  let run: Foldable[] = []
  const flush = () => {
    if (run.length > 1) out.push({ kind: 'tools', id: `tools:${run[0]!.id}`, items: run })
    else out.push(...run)
    run = []
  }
  for (const item of items) {
    if (foldable(item)) run.push(item)
    else {
      flush()
      out.push(item)
    }
  }
  flush()
  return out
}

const kindOf = (item: Foldable, subagent: string) =>
  item.kind === 'subagent' ? subagent : item.tool.charAt(0).toUpperCase() + item.tool.slice(1)

/** The folded line «Used 5: Shell, Read» (#758): a spinner while a call runs; a tap opens them. */
export function ToolGroup({
  items,
  render,
}: {
  items: Foldable[]
  /** How a call shows when opened; by default — a tool row. */
  render?: (item: Foldable) => ReactNode
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const [open, setOpen] = useState(false)
  const kinds = [...new Set(items.map((i) => kindOf(i, t('buffcode.subagentDefault'))))]
  const label = t('buffcode.toolsUsed', { n: items.length, tools: kinds.join(', ') })
  const running = items.some((i) => i.status === 'running')
  const failed = items.filter((i) => i.status === 'error').length
  return (
    <View style={{ gap: theme.space(2) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        hitSlop={6}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          minHeight: 32,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        {running ? <Spinner /> : <Icon name="wrench" size={14} color={c.mutedForeground} />}
        <Text variant="caption" numberOfLines={1} style={{ flexShrink: 1 }}>
          <Text variant="caption" tone="muted">
            {t('buffcode.toolsUsedCount', { n: items.length })}
          </Text>{' '}
          <Text variant="caption" style={{ fontWeight: '600' }}>
            {kinds.join(', ')}
          </Text>
        </Text>
        {failed > 0 && (
          <Text variant="caption" tone="destructive">
            {t('buffcode.toolsFailed', { n: failed })}
          </Text>
        )}
        <Icon name={open ? 'chevronDown' : 'chevronRight'} size={14} color={c.mutedForeground} />
      </Pressable>
      {open && (
        <View style={{ gap: theme.space(2) }}>
          {items.map((item) => (
            <View key={item.id}>
              {render ? (
                render(item)
              ) : item.kind === 'tool' ? (
                <ToolCall
                  tool={item.tool}
                  title={item.title}
                  status={item.status}
                  detail={item.detail}
                  output={item.output}
                />
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
