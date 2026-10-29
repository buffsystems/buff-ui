/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Choice } from '../../Choice.tsx'
import { Input } from '../../Field.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { DockFrame } from './docks.tsx'
import type { Question } from './model.ts'

/**
 * The agent's questions, one at a time: options (one or several) and an own answer typed in
 * place; «Next» walks the questions, the last one replies. The picks are local visual state
 * until the reply.
 */
export function QuestionDock({
  questions,
  index = 0,
  disabled = false,
  onNext,
  onReply,
  onDismiss,
}: {
  questions: Question[]
  index?: number
  disabled?: boolean
  onNext?: (answers: string[]) => void
  onReply?: (answers: string[]) => void
  onDismiss?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const question = questions[index]
  const [picked, setPicked] = useState<string[]>([])
  const [custom, setCustom] = useState('')
  if (!question) return null
  const multiple = question.multiple === true
  const last = index >= questions.length - 1
  const answers = [...picked, ...(custom.trim() ? [custom.trim()] : [])]
  const toggle = (value: string) =>
    setPicked((v) =>
      multiple ? (v.includes(value) ? v.filter((x) => x !== value) : [...v, value]) : [value],
    )
  // Typing an own answer to a single-choice question is the choice.
  const typeOwn = (text: string) => {
    setCustom(text)
    if (!multiple && text.trim()) setPicked([])
  }
  return (
    <DockFrame
      icon="circleHelp"
      title={t('buffcode.questionTitle')}
      badge={
        questions.length > 1
          ? t('buffcode.questionOf', { n: index + 1, total: questions.length })
          : undefined
      }
      footer={
        <>
          <Button size="sm" variant="ghost" disabled={disabled} onPress={onDismiss}>
            {t('buffcode.dismiss')}
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={disabled || answers.length === 0}
            onPress={() => (last ? onReply?.(answers) : onNext?.(answers))}
          >
            {last ? t('buffcode.reply') : t('buffcode.next')}
          </Button>
        </>
      }
    >
      <Text>{question.text}</Text>
      <View style={{ gap: theme.space(2) }}>
        {question.options.map((option) => (
          <Choice
            key={option.value}
            label={option.label}
            hint={option.hint}
            picked={picked.includes(option.value)}
            multiple={multiple}
            disabled={disabled}
            onPress={() => toggle(option.value)}
          />
        ))}
        <Input
          icon="pencil"
          rows={2}
          placeholder={t('buffcode.ownAnswerPlaceholder')}
          value={custom}
          onChangeText={typeOwn}
          editable={!disabled}
          accessibilityLabel={t('buffcode.ownAnswer')}
        />
      </View>
    </DockFrame>
  )
}
