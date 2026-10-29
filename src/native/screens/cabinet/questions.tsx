/** @jsxRuntime automatic */
/*
  The clarifying questions an analyst asks (#629): the same card in a task gate, a research
  thread and an ask thread — options to tap, a free answer, one send button.
*/
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Choice } from '../../Choice.tsx'
import { Card } from '../../Card.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

export interface QuestionOption {
  label: string
  description?: string
  /** The analyst's own suggestion. */
  recommended?: boolean
}

export interface Question {
  id: string
  header?: string
  /** Markdown. */
  text: string
  options?: QuestionOption[]
  multiSelect?: boolean
}

/** What the person picked so far, per question id: option indexes and the free text. */
export type Picks = Record<string, { options: number[]; free: string }>

/** The cards of the pending questions, and the send button under them. */
export function QuestionForm({
  title,
  questions,
  picks = {},
  sendLabel,
  disabled = false,
  busy = false,
  onPick,
  onFree,
  onSend,
  children,
}: {
  title: string
  questions: Question[]
  picks?: Picks
  sendLabel: string
  disabled?: boolean
  busy?: boolean
  onPick?: (questionId: string, option: number) => void
  /** The person's own answer to a question, as typed. */
  onFree?: (questionId: string, text: string) => void
  onSend?: () => void
  /** Extra controls between the questions and the button: an attach row. */
  children?: ReactNode
}) {
  const t = useT()
  const theme = useTheme()
  const answered = questions.some((q) => {
    const pick = picks[q.id]
    return pick && (pick.options.length > 0 || pick.free.trim() !== '')
  })
  return (
    <Card style={{ gap: theme.space(3) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="circleHelp" size={18} color={theme.colors.warning} />
        <Text variant="heading">{title}</Text>
      </View>
      {questions.map((q, i) => {
        const pick = picks[q.id] ?? { options: [], free: '' }
        const header = q.header ?? t('q.numbered', { n: i + 1 })
        return (
          <View key={q.id} style={{ gap: theme.space(2) }}>
            <Text variant="label" tone="muted">
              {q.multiSelect ? `${header} · ${t('q.multi')}` : header}
            </Text>
            <Prose markdown={q.text} />
            {q.options?.map((o, j) => (
              <Choice
                key={j}
                label={o.label}
                hint={o.description}
                badge={o.recommended && <Badge tone="info">{t('q.recommended')}</Badge>}
                picked={pick.options.includes(j)}
                multiple={!!q.multiSelect}
                disabled={disabled}
                onPress={() => onPick?.(q.id, j)}
              />
            ))}
            <Input
              value={pick.free}
              placeholder={q.options?.length ? t('q.orOwn') : t('q.yourAnswer')}
              rows={2}
              editable={!disabled}
              onChangeText={(text) => onFree?.(q.id, text)}
            />
          </View>
        )
      })}
      {children}
      <Button
        variant="primary"
        block
        loading={busy}
        disabled={disabled || !answered}
        onPress={onSend}
      >
        {sendLabel}
      </Button>
    </Card>
  )
}

/** A round of questions already answered, read-only. */
export function AskedQuestions({ questions }: { questions: Question[] }) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ gap: theme.space(3) }}>
      {questions.map((q, i) => (
        <View key={q.id} style={{ gap: 4 }}>
          <Text variant="label" tone="muted">
            {q.header ?? t('q.numbered', { n: i + 1 })}
          </Text>
          <Prose markdown={q.text} />
          {q.options?.map((o, j) => (
            <Text key={j} variant="caption" tone="fg2">
              {`• ${o.label}${o.recommended ? ` · ${t('q.recommended')}` : ''}${o.description ? ` — ${o.description}` : ''}`}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}
