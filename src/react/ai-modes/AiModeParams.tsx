/** @jsxRuntime automatic */
import { Brain } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../Collapsible.tsx'
import { useLocale } from '../locale.tsx'
import { cx } from '../cx.ts'
import { aiModeSummary } from '../../shared/ai-modes.ts'
import { AiModePanel, type AiModePanelProps } from './AiModeChip.tsx'

export interface AiModeParamsProps extends AiModePanelProps {
  className?: string
  defaultOpen?: boolean
}

/**
 * «Параметры ИИ» on a form that starts a question, a research, a task or an audit (#833):
 * folded to one line with what will apply; open — the two choices. An untouched form sends
 * nothing and the layers decide.
 */
export function AiModeParams({
  className,
  defaultOpen = false,
  note,
  ...panel
}: AiModeParamsProps) {
  const locale = useLocale()
  const effective = {
    thinking: panel.thinking ?? panel.defaults.thinking,
    contextTokens: panel.contextTokens ?? panel.defaults.contextTokens,
  }
  const changed = panel.thinking != null || panel.contextTokens != null
  return (
    <Collapsible
      bordered
      defaultOpen={defaultOpen}
      className={cx('ui-ai-params', changed && 'ui-ai-params--changed', className)}
    >
      <CollapsibleTrigger className="ui-ai-params__trigger">
        <Brain aria-hidden className="ui-ai-params__icon" />
        <span className="ui-ai-params__title">
          {locale === 'ru' ? 'Параметры ИИ' : 'AI parameters'}
        </span>
        <span className="ui-ai-params__summary">
          {aiModeSummary(effective, locale, panel.modelWindow)}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AiModePanel
          {...panel}
          note={
            note ??
            (locale === 'ru'
              ? 'Для этой сессии; не задано — как в настройках.'
              : 'For this session; unset — as in the settings.')
          }
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
