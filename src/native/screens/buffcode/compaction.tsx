/** @jsxRuntime automatic */
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { StatusDot } from '../../Badge.tsx'
import { Icon } from '../../Icon.tsx'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { CompactionStatus } from './model.ts'

/**
 * A context compaction (#761): the line in the timeline and its summary for the model — shown
 * while it is written, folded after; a tap opens it (and the screen fetches the whole text).
 */
export function CompactionNote({
  when,
  status,
  summary,
  onOpen,
}: {
  when: string
  status?: CompactionStatus
  summary?: string
  onOpen?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  if (status === 'running')
    return (
      <View style={{ gap: theme.space(2) }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <StatusDot tone="info" pulse size={6} />
          <Text variant="caption" tone="muted">
            {t('buffcode.compacting')}
          </Text>
        </View>
        {summary ? <SummaryCard markdown={summary} /> : null}
      </View>
    )
  const line = (
    <Text variant="caption" tone="muted" align="center">
      — {t(status === 'failed' ? 'buffcode.compactFailed' : 'buffcode.compacted')} · {when} —
    </Text>
  )
  if (status === 'failed' || !summary) return line
  return (
    <View style={{ gap: theme.space(2) }}>
      {line}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('buffcode.compactionSummary')}
        accessibilityState={{ expanded: open }}
        hitSlop={6}
        onPress={() => {
          if (!open) onOpen?.()
          setOpen((was) => !was)
        }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text variant="caption" style={{ fontWeight: '600' }}>
          {t('buffcode.compactionSummary')}
        </Text>
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={14}
          color={theme.colors.mutedForeground}
        />
      </Pressable>
      {open ? <SummaryCard markdown={summary} /> : null}
    </View>
  )
}

/** The summary for the model, set apart from the conversation. */
function SummaryCard({ markdown }: { markdown: string }) {
  const theme = useTheme()
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.muted,
        padding: theme.space(3),
      }}
    >
      <Prose markdown={markdown} />
    </View>
  )
}
