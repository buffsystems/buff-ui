/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Brain } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover.tsx'
import { Field } from '../Field.tsx'
import { useLocale } from '../locale.tsx'
import { cx } from '../cx.ts'
import { aiModeSummary } from '../../shared/ai-modes.ts'
import { AiThinkingSelect } from './AiThinkingSelect.tsx'
import { AiContextSelect } from './AiContextSelect.tsx'

export interface AiModeChipProps {
  thinking: string
  contextTokens: number
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
            {aiModeSummary({ thinking, contextTokens }, locale, modelWindow)}
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
  /** The values in force without an override — named as «по умолчанию (…)». */
  defaults: { thinking: string; contextTokens: number }
  onChange: (next: { thinking?: string | null; contextTokens?: number | null }) => void
  modelWindow?: number | null
  available?: readonly string[] | null
  /** The line under the fields: when the change takes effect. Default: from the next run. */
  note?: ReactNode
  disabled?: boolean
}

/** The two choices of a session's AI mode with the line on when they apply (#833). */
export function AiModePanel({
  thinking,
  contextTokens,
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
      <p className="ui-ai-panel__note">
        {note ??
          (locale === 'ru' ? 'Применится со следующего запуска.' : 'Applies from the next run.')}
      </p>
    </div>
  )
}
