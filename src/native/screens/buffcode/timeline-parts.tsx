/** @jsxRuntime automatic */
import { View } from 'react-native'
import { StatusDot } from '../../Badge.tsx'
import { Callout } from '../../Feedback.tsx'
import { Icon } from '../../Icon.tsx'
import type { Attachment } from '../../model.ts'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { TimelineItem } from './model.ts'
import { SentFile } from './sent-file.tsx'
import { BackgroundWork, ToolCall } from './tool-parts.tsx'

/** What the person said; attachments as chips under the text. */
export function UserTurn({
  text,
  when,
  attachments = [],
}: {
  text: string
  when: string
  attachments?: Attachment[]
}) {
  const theme = useTheme()
  return (
    <View style={{ alignItems: 'flex-end', gap: 4 }}>
      <View
        style={{
          maxWidth: '88%',
          backgroundColor: theme.colors.brandSoft,
          borderRadius: theme.radius.lg,
          borderBottomRightRadius: theme.radius.sm,
          padding: theme.space(3),
          gap: theme.space(2),
        }}
      >
        <Text selectable style={{ color: theme.colors.brandSoftForeground }}>
          {text}
        </Text>
        {attachments.map((a) => (
          <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon
              name={a.kind === 'image' ? 'image' : 'paperclip'}
              size={14}
              color={theme.colors.brandSoftForeground}
            />
            <Text variant="caption" style={{ color: theme.colors.brandSoftForeground }}>
              {a.name}
            </Text>
          </View>
        ))}
      </View>
      <Text variant="caption" tone="muted">
        {when}
      </Text>
    </View>
  )
}

/** The assistant's answer as Markdown; a shimmer line while it streams. */
export function AssistantTurn({
  markdown,
  model,
  streaming = false,
}: {
  markdown: string
  model?: string
  streaming?: boolean
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ gap: theme.space(2) }}>
      <Prose markdown={markdown} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        {streaming && <StatusDot tone="info" pulse size={6} />}
        <Text variant="caption" tone="muted">
          {streaming ? t('buffcode.thinking') : (model ?? '')}
        </Text>
      </View>
    </View>
  )
}

/** A service notice (#711): a label (the goal, a workflow) and, muted, what happened. */
function ServiceNotice({ label, summary }: { label: string; summary?: string }) {
  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: theme.space(2),
        paddingVertical: theme.space(1),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(1) }}>
        <Icon name="info" size={13} color={theme.colors.mutedForeground} />
        <Text variant="caption" style={{ fontWeight: '600' }}>
          {label}
        </Text>
      </View>
      {summary ? (
        <Text variant="caption" tone="muted" style={{ flex: 1 }}>
          {summary}
        </Text>
      ) : null}
    </View>
  )
}

/** One item of the timeline by its kind. */
export function TimelinePart({
  item,
  disabled = false,
  onOpenSent,
}: {
  item: TimelineItem
  disabled?: boolean
  /** A file the agent handed over was tapped (#708). */
  onOpenSent?: (file: { path: string; name: string; mime: string }) => void
}) {
  const t = useT()
  switch (item.kind) {
    case 'user':
      return <UserTurn text={item.text} when={item.when} attachments={item.attachments} />
    case 'assistant':
      return (
        <AssistantTurn markdown={item.markdown} model={item.model} streaming={item.streaming} />
      )
    case 'tool':
      return (
        <ToolCall
          tool={item.tool}
          title={item.title}
          status={item.status}
          detail={item.detail}
          output={item.output}
        />
      )
    case 'background':
      return <BackgroundWork tasks={item.tasks} disabled={disabled} />
    case 'file':
      return (
        <SentFile
          name={item.name}
          mime={item.mime}
          bytes={item.bytes}
          note={item.note}
          onOpen={
            onOpenSent && !disabled
              ? () => onOpenSent({ path: item.path, name: item.name, mime: item.mime })
              : undefined
          }
        />
      )
    case 'error':
      return (
        <Callout tone="crit" title={t('buffcode.errorTitle')}>
          {item.text}
        </Callout>
      )
    case 'notice':
      return <ServiceNotice label={item.label} summary={item.summary} />
    case 'compaction':
      return (
        <Text variant="caption" tone="muted" align="center">
          — {t('buffcode.compacted')} · {item.when} —
        </Text>
      )
  }
}
