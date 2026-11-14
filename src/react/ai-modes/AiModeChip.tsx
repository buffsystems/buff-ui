/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Brain } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover.tsx'
import { Field } from '../Field.tsx'
import { Checkbox } from '../Surface.tsx'
import { useLocale } from '../locale.tsx'
import { cx } from '../cx.ts'
import { aiModeSummary } from '../../shared/ai-modes.ts'
import { AiThinkingSelect } from './AiThinkingSelect.tsx'
import { AiContextSelect } from './AiContextSelect.tsx'

export interface AiModeChipProps {
  thinking: string
  contextTokens: number
  /** The subagents flag in force (#904): true adds «субагенты» to the line. */
  subagents?: boolean
  modelWindow?: number | null
  /** What opens under the chip — an AiModePanel, usually. */
  children: ReactNode
  className?: string
}

/**
 * The session's AI mode in one line, in the header of a dialogue or a task (#833): a press
 * opens the panel beside it. The words are the matrix's, so a chip and a card read alike.
 */
export function AiModeChip({
  thinking,
  contextTokens,
  subagents,
  modelWindow,
  children,
  className,
}: AiModeChipProps) {
  const locale = useLocale()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cx('ui-ai-chip', className)}>
          <Brain aria-hidden className="ui-ai-chip__icon" />
          <span className="ui-ai-chip__text">
            {aiModeSummary({ thinking, contextTokens, subagents }, locale, modelWindow)}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="ui-ai-panel-popover">
        {children}
      </PopoverContent>
    </Popover>
  )
}

export interface AiModePanelProps {
  thinking: string | null
  contextTokens: number | null
  /** The session's own subagents flag (#904); null — as in the settings. */
  subagents?: boolean | null
  /** The values in force without an override — named as «по умолчанию (…)». Without
   *  `subagents` the panel offers no subagents choice (a step that has none). */
  defaults: { thinking: string; contextTokens: number; subagents?: boolean }
  onChange: (next: {
    thinking?: string | null
    contextTokens?: number | null
    subagents?: boolean | null
  }) => void
  modelWindow?: number | null
  available?: readonly string[] | null
  /** The line under the fields: when the change takes effect. Default: from the next run. */
  note?: ReactNode
  disabled?: boolean
}

/** The choices of a session's AI mode with the line on when they apply (#833): thinking,
 *  context and, where the step has one, the subagents flag (#904) — ticking it back to the
 *  settings' value drops the override. */
export function AiModePanel({
  thinking,
  contextTokens,
  subagents,
  defaults,
  onChange,
  modelWindow,
  available,
  note,
  disabled,
}: AiModePanelProps) {
  const locale = useLocale()
  const from = locale === 'ru' ? 'по умолчанию' : 'default'
  return (
    <div className="ui-ai-panel">
      <Field label={locale === 'ru' ? 'Размышления' : 'Thinking'}>
        <AiThinkingSelect
          value={thinking}
          onChange={(level) => onChange({ thinking: level })}
          inherited={defaults.thinking}
          inheritedFrom={from}
          available={available}
          disabled={disabled}
        />
      </Field>
      <Field label={locale === 'ru' ? 'Контекст' : 'Context'}>
        <AiContextSelect
          value={contextTokens}
          onChange={(tokens) => onChange({ contextTokens: tokens })}
          inherited={defaults.contextTokens}
          inheritedFrom={from}
          modelWindow={modelWindow}
          disabled={disabled}
        />
      </Field>
      {defaults.subagents !== undefined && (
        <Checkbox
          label={
            locale === 'ru'
              ? 'Рекомендовать модели субагентов'
              : 'Advise the model to use subagents'
          }
          hint={
            locale === 'ru'
              ? `Может значительно увеличить расход токенов. По умолчанию — ${defaults.subagents ? 'да' : 'нет'}.`
              : `May considerably increase token spend. Default — ${defaults.subagents ? 'yes' : 'no'}.`
          }
          checked={subagents ?? defaults.subagents}
          disabled={disabled}
          onChange={(e) => {
            const on = e.currentTarget.checked
            onChange({ subagents: on === defaults.subagents ? null : on })
          }}
        />
      )}
      <p className="ui-ai-panel__note">
        {note ??
          (locale === 'ru' ? 'Применится со следующего запуска.' : 'Applies from the next run.')}
      </p>
    </div>
  )
}
