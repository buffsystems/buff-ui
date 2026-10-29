/** @jsxRuntime automatic */
/*
  The turns of an Ask thread (#629): the person's bubbles, Buff's prose with its reasoning,
  attachments under either, and the «thinking» line with its timer.
*/
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Spinner } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import type { Attachment } from '../../../model.ts'
import { Prose } from '../../../Prose.tsx'
import { RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { AttachmentRow } from '../attachments.tsx'
import type { AskMessage } from './model.ts'

function Reasoning({ text, open = false }: { text: string; open?: boolean }) {
  const t = useT()
  const theme = useTheme()
  const [shown, setShown] = useState(open)
  return (
    <View style={{ gap: 4 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: shown }}
        onPress={() => setShown((v) => !v)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 32 }}
      >
        <Icon
          name={shown ? 'chevronDown' : 'chevronRight'}
          size={14}
          color={theme.colors.mutedForeground}
        />
        <Text variant="caption" tone="muted">
          {shown ? t('ask.collapse') : t('ask.reasoningTrail')}
        </Text>
      </Pressable>
      {shown && (
        <View style={{ borderLeftWidth: 2, borderLeftColor: theme.colors.border, paddingLeft: 10 }}>
          <Text variant="caption" tone="fg2" selectable>
            {text}
          </Text>
        </View>
      )}
    </View>
  )
}

function Attachments({ items, onOpen }: { items: Attachment[]; onOpen?: (id: string) => void }) {
  return (
    <RowGroup>
      {items.map((a) => (
        <AttachmentRow key={a.id} attachment={a} onOpen={() => onOpen?.(a.id)} />
      ))}
    </RowGroup>
  )
}

/** The turns of a thread. */
export function MessageList({
  messages,
  onOpenAttachment,
}: {
  messages: AskMessage[]
  onOpenAttachment?: (id: string) => void
}) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{ gap: theme.space(3), paddingHorizontal: theme.space(4), paddingTop: theme.space(2) }}
    >
      {messages.map((m) =>
        m.role === 'user' ? (
          <View key={m.id} style={{ alignItems: 'flex-end', gap: 6 }}>
            <View
              style={{
                maxWidth: '88%',
                padding: theme.space(3),
                borderRadius: theme.radius.lg,
                borderBottomRightRadius: 4,
                backgroundColor: c.brandSoft,
              }}
            >
              <Text selectable style={{ color: c.brandSoftForeground }}>
                {m.content}
              </Text>
            </View>
            {m.attachments && m.attachments.length > 0 && (
              <View style={{ width: '88%' }}>
                <Attachments items={m.attachments} onOpen={onOpenAttachment} />
              </View>
            )}
          </View>
        ) : (
          <View key={m.id} style={{ gap: 8 }}>
            {m.reasoning && <Reasoning text={m.reasoning} />}
            <Prose markdown={m.content} />
            {m.attachments && m.attachments.length > 0 && (
              <Attachments items={m.attachments} onOpen={onOpenAttachment} />
            )}
          </View>
        ),
      )}
    </View>
  )
}

/** «Buff is thinking…» with the timer and the live reasoning. */
export function ThinkingLine({ elapsed, reasoning }: { elapsed?: string; reasoning?: string }) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ paddingHorizontal: theme.space(4), gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Spinner />
        <Text variant="label" tone="muted">
          {t('ask.thinking')}
        </Text>
        {elapsed && (
          <Text variant="mono" tone="muted">
            {elapsed}
          </Text>
        )}
      </View>
      {reasoning && <Reasoning text={reasoning} open />}
    </View>
  )
}
