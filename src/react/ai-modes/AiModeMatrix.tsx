/** @jsxRuntime automatic */
import { Fragment } from 'react'
import { RotateCcw } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../Collapsible.tsx'
import { Badge } from '../Badge.tsx'
import { Button } from '../Button.tsx'
import { useLocale } from '../locale.tsx'
import { cx } from '../cx.ts'
import { AiThinkingSelect } from './AiThinkingSelect.tsx'
import { AiContextSelect } from './AiContextSelect.tsx'
import {
  aiModeGroups,
  cellValue,
  groupCells,
  groupSummary,
  phaseLabel,
  type AiModeCell,
  type AiModeGroup,
  type AiModeStepDef,
} from './model.ts'

export interface AiModeMatrixProps {
  /** The dictionary of steps and roles, as the server names them (common-lib ai_modes). */
  steps: readonly AiModeStepDef[]
  /** This layer's cells. */
  own: readonly AiModeCell[]
  /** The layer above (the installation for an organisation; nothing for the installation itself). */
  inherited: readonly AiModeCell[]
  /** The words for an inherited value: «как у установки» / «как у организации». */
  inheritedFrom: string
  /** Cells to write: a cell with both values null is a reset. */
  onChange: (cells: AiModeCell[]) => void
  modelWindow?: number | null
  readOnly?: boolean
  /** Every card open (a test, a narrow screen with one scenario). */
  defaultOpen?: boolean
  className?: string
}

/**
 * The matrix of AI modes (#783): one card per scenario — «Спросить», «Исследование», «Аудит»,
 * «Code review», «Задача» (its phases inside), «Buff Code» — with a one-line summary; open,
 * a table of phases × roles with two choices each. An inherited value is dimmed and marked
 * where it comes from; an overridden row can be reset; the first row writes the whole scenario.
 */
export function AiModeMatrix({
  steps,
  own,
  inherited,
  inheritedFrom,
  onChange,
  modelWindow,
  readOnly = false,
  defaultOpen = false,
  className,
}: AiModeMatrixProps) {
  const locale = useLocale()
  const groups = aiModeGroups(steps)
  return (
    <div className={cx('ui-ai-matrix', className)}>
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          own={own}
          inherited={inherited}
          inheritedFrom={inheritedFrom}
          onChange={onChange}
          modelWindow={modelWindow}
          readOnly={readOnly}
          defaultOpen={defaultOpen}
          locale={locale}
        />
      ))}
    </div>
  )
}

function GroupCard({
  group,
  own,
  inherited,
  inheritedFrom,
  onChange,
  modelWindow,
  readOnly,
  defaultOpen,
  locale,
}: Omit<AiModeMatrixProps, 'steps' | 'className' | 'defaultOpen' | 'readOnly'> & {
  group: AiModeGroup
  readOnly: boolean
  defaultOpen: boolean
  locale: 'ru' | 'en'
}) {
  const title = group.label[locale]
  const cells = groupCells(group)
  const views = cells.map((c) => cellValue(own, inherited, c.step, c.role))
  const all = (patch: { thinking?: string | null; context_tokens?: number | null }) =>
    onChange(cells.map((c) => ({ ...c, ...patch })))
  const agreeThinking = views.every((v) => v.thinking.value === views[0].thinking.value)
    ? views[0].thinking.value
    : null
  const agreeContext = views.every((v) => v.context.value === views[0].context.value)
    ? views[0].context.value
    : null
  const words = {
    thinking: locale === 'ru' ? 'Размышления' : 'Thinking',
    context: locale === 'ru' ? 'Контекст' : 'Context',
    phase: locale === 'ru' ? 'Фаза и роль' : 'Phase and role',
    all: locale === 'ru' ? 'Все фазы и роли' : 'All phases and roles',
    mixed: locale === 'ru' ? 'Разные' : 'Mixed',
    reset: locale === 'ru' ? 'Сбросить' : 'Reset',
  }
  return (
    <Collapsible bordered defaultOpen={defaultOpen} className="ui-ai-matrix__card">
      <CollapsibleTrigger className="ui-ai-matrix__head">
        <span className="ui-ai-matrix__title">{title}</span>
        <span className="ui-ai-matrix__summary">
          {groupSummary(group, own, inherited, locale, modelWindow)}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <section aria-label={title} className="ui-ai-matrix__body">
          <table className="ui-ai-matrix__table">
            <thead>
              <tr>
                <th scope="col">{words.phase}</th>
                <th scope="col">{words.thinking}</th>
                <th scope="col">{words.context}</th>
                <th scope="col" aria-label={words.reset} />
              </tr>
            </thead>
            <tbody>
              {cells.length > 1 && (
                <tr className="ui-ai-matrix__bulk" aria-label={words.all}>
                  <th scope="row">{words.all}</th>
                  <td>
                    <AiThinkingSelect
                      aria-label={`${words.all}: ${words.thinking}`}
                      compact
                      disabled={readOnly}
                      value={agreeThinking}
                      onChange={(level) => all({ thinking: level ?? null })}
                      inherited={agreeThinking == null ? undefined : agreeThinking}
                      placeholder={words.mixed}
                    />
                  </td>
                  <td>
                    <AiContextSelect
                      aria-label={`${words.all}: ${words.context}`}
                      compact
                      disabled={readOnly}
                      value={agreeContext}
                      onChange={(tokens) => all({ context_tokens: tokens ?? null })}
                      modelWindow={modelWindow}
                      inherited={agreeContext == null ? undefined : agreeContext}
                      placeholder={words.mixed}
                    />
                  </td>
                  <td />
                </tr>
              )}
              {group.steps.map((step) => (
                <Fragment key={step.id}>
                  {step.roles.map((role, i) => {
                    const view = cellValue(own, inherited, step.id, role.id)
                    const overridden =
                      view.thinking.source === 'own' || view.context.source === 'own'
                    const name =
                      step.roles.length > 1
                        ? `${phaseLabel(step, group, locale)} — ${role.label[locale].toLowerCase()}`
                        : phaseLabel(step, group, locale)
                    const mine = own.find((c) => c.step === step.id && c.role === role.id)
                    return (
                      <tr
                        key={role.id}
                        className={cx('ui-ai-matrix__row', overridden && 'ui-ai-matrix__row--own')}
                        aria-label={name}
                      >
                        <th scope="row">
                          {i === 0 && group.steps.length > 1 && (
                            <span className="ui-ai-matrix__phase">
                              {phaseLabel(step, group, locale)}
                            </span>
                          )}
                          {step.roles.length > 1 && (
                            <span className="ui-ai-matrix__role">{role.label[locale]}</span>
                          )}
                          {step.roles.length === 1 && group.steps.length === 1 && (
                            <span className="ui-ai-matrix__role">{role.label[locale]}</span>
                          )}
                        </th>
                        <td
                          className={cx(
                            view.thinking.source !== 'own' && 'ui-ai-matrix__cell--inherited',
                          )}
                        >
                          <AiThinkingSelect
                            aria-label={`${name}: ${words.thinking}`}
                            compact
                            disabled={readOnly}
                            value={mine?.thinking ?? null}
                            onChange={(level) =>
                              onChange([
                                {
                                  step: step.id,
                                  role: role.id,
                                  thinking: level,
                                  context_tokens: mine?.context_tokens ?? null,
                                },
                              ])
                            }
                            inherited={
                              view.thinking.source === 'inherited' ? view.thinking.value : 'default'
                            }
                            inheritedFrom={
                              view.thinking.source === 'inherited' ? inheritedFrom : undefined
                            }
                          />
                          {view.thinking.source === 'inherited' && (
                            <Badge size="sm" tone="outline">
                              {inheritedFrom}
                            </Badge>
                          )}
                        </td>
                        <td
                          className={cx(
                            view.context.source !== 'own' && 'ui-ai-matrix__cell--inherited',
                          )}
                        >
                          <AiContextSelect
                            aria-label={`${name}: ${words.context}`}
                            compact
                            disabled={readOnly}
                            value={mine?.context_tokens ?? null}
                            onChange={(tokens) =>
                              onChange([
                                {
                                  step: step.id,
                                  role: role.id,
                                  thinking: mine?.thinking ?? null,
                                  context_tokens: tokens,
                                },
                              ])
                            }
                            modelWindow={modelWindow}
                            inherited={view.context.source === 'inherited' ? view.context.value : 0}
                            inheritedFrom={
                              view.context.source === 'inherited' ? inheritedFrom : undefined
                            }
                          />
                          {view.context.source === 'inherited' && (
                            <Badge size="sm" tone="outline">
                              {inheritedFrom}
                            </Badge>
                          )}
                        </td>
                        <td>
                          {overridden && !readOnly && (
                            <Button
                              size="sm"
                              variant="ghost"
                              leadingIcon={RotateCcw}
                              onClick={() =>
                                onChange([
                                  {
                                    step: step.id,
                                    role: role.id,
                                    thinking: null,
                                    context_tokens: null,
                                  },
                                ])
                              }
                            >
                              {words.reset}
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>
      </CollapsibleContent>
    </Collapsible>
  )
}
