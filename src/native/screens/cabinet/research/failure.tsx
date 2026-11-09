/** @jsxRuntime automatic */
/*
  A failed research (#767): why it stopped — the sentence, the stage, the original text under
  «Технические детали» — and «Продолжить», which runs it again from where it stopped. The same
  reason stands under the status line and in the sheet the «Ошибка» status opens.
*/
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Disclosure } from '../../../Disclosure.tsx'
import { Callout } from '../../../Feedback.tsx'
import type { Translate } from '../../../i18n.ts'
import { Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { ResearchFailure } from './model.ts'

const KIND_KEY: Record<string, string> = {
  provider: 'research.failProvider',
  limit: 'research.failLimit',
  interrupted: 'research.failInterrupted',
  launch: 'research.failLaunch',
  internal: 'research.failInternal',
}

const STEP_KEY: Record<string, string> = {
  prepare: 'research.stepPrepare',
  build_prompts: 'research.stepPrepare',
  analyst_first: 'research.stepAnalyst',
  review_phase: 'research.stepReview',
  // Steps inside the review loop (run_llm_with_reviewer): the analyst revises, the reviewer checks.
  audit_first: 'research.stepAnalyst',
  revise: 'research.stepAnalyst',
  revise_consume: 'research.stepAnalyst',
  review: 'research.stepReview',
  round: 'research.stepReview',
  clarify: 'research.stepReview',
  summarize: 'research.stepReview',
  publish: 'research.stepPublish',
}

/** The reason as sentences in the reader's language; null failure — none was saved. */
export function failureLines(t: Translate, failure: ResearchFailure | null | undefined) {
  if (!failure) return { summary: t('research.failUnknown'), step: null, detail: null }
  const said = t(KIND_KEY[failure.kind] ?? 'research.failInternal')
  const stepKey = failure.step ? STEP_KEY[failure.step] : undefined
  return {
    summary: failure.attempts
      ? `${said} ${t('research.failAttempts', { n: failure.attempts })}`
      : said,
    step: stepKey ? t('research.failStep', { stage: t(stepKey) }) : null,
    detail: failure.detail || null,
  }
}

/** The stage and the original text — under the sentence, wherever it stands. */
function FailureMore({ failure }: { failure: ResearchFailure | null | undefined }) {
  const t = useT()
  const theme = useTheme()
  const f = failureLines(t, failure)
  return (
    <>
      {f.step && (
        <Text variant="caption" tone="muted">
          {f.step}
        </Text>
      )}
      {f.detail && (
        <Disclosure title={t('research.failDetails')}>
          <View
            style={{
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.codeBorder,
              backgroundColor: theme.colors.codeBlockBg,
              padding: 10,
            }}
          >
            {/* An error line is read whole, not scrolled: it wraps, unlike code. */}
            <Text variant="mono" selectable>
              {f.detail}
            </Text>
          </View>
        </Disclosure>
      )}
    </>
  )
}

function ContinueButton({ onContinue, disabled }: { onContinue: () => void; disabled?: boolean }) {
  const t = useT()
  return (
    <Button variant="primary" leadingIcon="play" disabled={disabled} onPress={onContinue}>
      {t('research.continue')}
    </Button>
  )
}

/** The band under the status line of a failed research. */
export function FailureCard({
  failure,
  onContinue,
  disabled,
}: {
  failure: ResearchFailure | null | undefined
  /** Absent — the reader may not change the research, no button. */
  onContinue?: () => void
  disabled?: boolean
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ gap: theme.space(2) }}>
      <Callout tone="crit" title={t('research.failTitle')}>
        {failureLines(t, failure).summary}
      </Callout>
      <FailureMore failure={failure} />
      {onContinue && <ContinueButton onContinue={onContinue} disabled={disabled} />}
    </View>
  )
}

/** The sheet the «Ошибка» status opens. */
export function ResearchFailureSheet({
  failure,
  onContinue,
  onClose,
}: {
  failure: ResearchFailure | null | undefined
  onContinue?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet
      title={t('research.failTitle')}
      onClose={onClose}
      footer={onContinue ? <ContinueButton onContinue={onContinue} /> : undefined}
    >
      <View style={{ gap: 6 }}>
        <Text>{failureLines(t, failure).summary}</Text>
        <FailureMore failure={failure} />
      </View>
    </Sheet>
  )
}
