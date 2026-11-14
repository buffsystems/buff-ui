/** @jsxRuntime automatic */
/**
  «Параметры ИИ» on the phone's cabinet (#840, epic #783): the thinking level, the context
  window and the subagents flag (#926) of a session. A folded card on the forms that start a question, a research, a task or
  an audit; a chip in an open session's header; a quiet note row in the dialogue when the mode
  changed. The words are the cabinet's (shared/ai-modes), so the phone reads like the web.
*/
import type { ReactNode } from 'react'
import { View } from 'react-native'
import { aiContextLabel, aiModeSummary, aiThinkingWords } from '../../../shared/ai-modes.ts'
import { Chip } from '../../Chip.tsx'
import { Choice } from '../../Choice.tsx'
import { Disclosure } from '../../Disclosure.tsx'
import { Field, SelectField } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useLocale, useT, useTheme } from '../../theme.tsx'

export interface AiModeDefaults {
  thinking: string
  contextTokens: number
  /** The subagents flag in force (#904, #926); absent — the install has no such choice. */
  subagents?: boolean
}

/**
  The choices of a session's AI mode, folded to one line with what will apply. `null` is
  «as in the settings»: the field then names the inherited value. The picks themselves are the
  host's sheets; the subagents flag (#926) is a tick right in the card.
*/
export function AiModeParamsCard({
  thinking,
  contextTokens,
  subagents = null,
  defaults,
  modelWindow,
  defaultOpen = false,
  disabled = false,
  note,
  onPickThinking,
  onPickContext,
  onToggleSubagents,
}: {
  thinking: string | null
  contextTokens: number | null
  defaults: AiModeDefaults
  modelWindow?: number
  defaultOpen?: boolean
  disabled?: boolean
  /** The line under the fields; default — «for this session; unset — as in the settings». */
  note?: string
  onPickThinking?: () => void
  onPickContext?: () => void
  /** The session's own subagents flag; null — as in the settings. */
  subagents?: boolean | null
  onToggleSubagents?: (next: boolean | null) => void
}) {
  const t = useT()
  const locale = useLocale()
  const effective = {
    thinking: thinking ?? defaults.thinking,
    contextTokens: contextTokens ?? defaults.contextTokens,
    subagents: subagents ?? defaults.subagents,
  }
  return (
    <Disclosure
      title={t('cabinet.aiParams')}
      meta={aiModeSummary(effective, locale, modelWindow)}
      defaultOpen={defaultOpen}
    >
      <AiModeFields
        thinking={thinking}
        contextTokens={contextTokens}
        defaults={defaults}
        modelWindow={modelWindow}
        disabled={disabled}
        onPickThinking={onPickThinking}
        onPickContext={onPickContext}
        subagents={subagents}
        onToggleSubagents={onToggleSubagents}
      />
      <Text variant="caption" tone="muted">
        {note ?? t('cabinet.aiNoteForm')}
      </Text>
    </Disclosure>
  )
}

/** The fields alone — the card's inside and the session sheet's body. The subagents tick shows
 *  only when the install knows the flag and the host takes it; ticking back to the settings'
 *  value drops the override (null). */
export function AiModeFields({
  thinking,
  contextTokens,
  subagents = null,
  defaults,
  modelWindow,
  disabled = false,
  onPickThinking,
  onPickContext,
  onToggleSubagents,
}: {
  thinking: string | null
  contextTokens: number | null
  subagents?: boolean | null
  defaults: AiModeDefaults
  modelWindow?: number
  disabled?: boolean
  onPickThinking?: () => void
  onPickContext?: () => void
  onToggleSubagents?: (next: boolean | null) => void
}) {
  const t = useT()
  const locale = useLocale()
  const theme = useTheme()
  const thinkingValue =
    thinking === null
      ? t('cabinet.aiDefault', { value: aiThinkingWords(defaults.thinking, locale).label })
      : aiThinkingWords(thinking, locale).label
  const contextValue =
    contextTokens === null
      ? t('cabinet.aiDefault', {
          value: aiContextLabel(defaults.contextTokens, locale, modelWindow),
        })
      : aiContextLabel(contextTokens, locale, modelWindow)
  return (
    <View style={{ gap: theme.space(3) }}>
      <Field label={t('cabinet.aiThinking')}>
        <SelectField
          icon="brain"
          value={thinkingValue}
          placeholder={t('cabinet.aiThinking')}
          onPress={onPickThinking}
          disabled={disabled}
        />
      </Field>
      <Field label={t('cabinet.aiContext')}>
        <SelectField
          icon="layers"
          value={contextValue}
          placeholder={t('cabinet.aiContext')}
          onPress={onPickContext}
          disabled={disabled}
        />
      </Field>
      {defaults.subagents !== undefined && onToggleSubagents ? (
        <Choice
          multiple
          label={t('cabinet.aiSubagents')}
          hint={t(defaults.subagents ? 'cabinet.aiSubagentsHintOn' : 'cabinet.aiSubagentsHintOff')}
          picked={subagents ?? defaults.subagents}
          disabled={disabled}
          onPress={() => {
            const on = !(subagents ?? defaults.subagents)
            onToggleSubagents(on === defaults.subagents ? null : on)
          }}
        />
      ) : null}
    </View>
  )
}

/** The session's AI mode in one line, in its header: a press opens the choice. */
export function AiModeChip({
  thinking,
  contextTokens,
  subagents,
  modelWindow,
  onPress,
}: {
  thinking: string
  contextTokens: number
  /** The subagents flag in force: true adds «субагенты» to the line (#904). */
  subagents?: boolean
  modelWindow?: number
  onPress?: () => void
}) {
  const locale = useLocale()
  return (
    <Chip icon="brain" onPress={onPress}>
      {aiModeSummary({ thinking, contextTokens, subagents }, locale, modelWindow)}
    </Chip>
  )
}

/** A service row of a dialogue: the AI mode was changed — who and to what. Quiet and centred. */
export function AiModeNoteRow({ text, when }: { text: string; when?: string }) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      accessibilityRole="text"
      role="note"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space(2),
        paddingVertical: theme.space(1),
      }}
    >
      <Icon name="brain" size={14} color={c.fg2} />
      <Text variant="caption" tone="muted" style={{ flexShrink: 1 }}>
        {text}
      </Text>
      {when ? (
        <Text variant="caption" tone="muted">
          {when}
        </Text>
      ) : null}
    </View>
  )
}

/** A slot's wrapper on a form: the card sits between the text and the attachments. */
export function AiModeSlot({ children }: { children?: ReactNode }) {
  return children ? <View>{children}</View> : null
}
