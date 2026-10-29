/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Badge, StatusDot } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Card } from '../../Card.tsx'
import { Terminal } from '../../Code.tsx'
import { Callout } from '../../Feedback.tsx'
import { Field, Input } from '../../Field.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { WorkflowRun } from './model.ts'
import { Eyebrow, Gutter, isLive, MachineShell } from './shell.tsx'
import { statusTone } from './tool-parts.tsx'
import { RUN_KEY, RUN_TONE } from './workflows.tsx'

/** A workflow run: its state and metrics, the steps waiting for the person, phases, result, log. */
export function WorkflowRunScreen({
  install,
  status,
  run,
  answer = '',
  onBack,
  onStop,
  onResume,
  onOpenSession,
  onFixInChat,
  onAnswer,
  onReply,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  run: WorkflowRun
  answer?: string
  onBack?: () => void
  onStop?: () => void
  onResume?: () => void
  onOpenSession?: () => void
  onFixInChat?: () => void
  onAnswer?: (text: string) => void
  onReply?: (questionId: string) => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  return (
    <MachineShell
      install={install}
      status={status}
      title={run.label}
      subtitle={t('buffcode.runView')}
      onBack={onBack}
      onRepair={onRepair}
    >
      <View style={{ paddingTop: theme.space(4) }}>
        <Gutter>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.space(2),
              flexWrap: 'wrap',
            }}
          >
            <Badge tone={RUN_TONE[run.state]}>{t(RUN_KEY[run.state])}</Badge>
            <Text variant="caption" tone="muted" style={{ flex: 1 }}>
              {run.workflow ? `«${run.workflow}»` : t('buffcode.fromChat')}
              {run.amended ? ` · ${t('buffcode.amended')}` : ''}
            </Text>
            {run.state === 'running' ? (
              <Button
                size="sm"
                variant="danger"
                leadingIcon="square"
                disabled={!live}
                onPress={onStop}
              >
                {t('buffcode.stop')}
              </Button>
            ) : run.state === 'paused' || run.state === 'failed' ? (
              <Button size="sm" leadingIcon="play" disabled={!live} onPress={onResume}>
                {t('buffcode.resume')}
              </Button>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
            <Button size="sm" disabled={!live} onPress={onOpenSession}>
              {t('buffcode.openSession')}
            </Button>
            {run.state === 'failed' && (
              <Button
                size="sm"
                variant="ghost"
                leadingIcon="wrench"
                disabled={!live}
                onPress={onFixInChat}
              >
                {t('buffcode.fixInChat')}
              </Button>
            )}
          </View>
          <Card tone="muted" style={{ gap: 4 }}>
            <Text variant="caption" tone="fg2">
              {t('buffcode.elapsed', { elapsed: run.elapsed })}
            </Text>
            <Text variant="caption" tone="fg2">
              {t('buffcode.tokensLine', {
                total: run.tokens.total.toLocaleString('ru-RU'),
                input: run.tokens.input.toLocaleString('ru-RU'),
                output: run.tokens.output.toLocaleString('ru-RU'),
                cache: run.tokens.cache.toLocaleString('ru-RU'),
              })}
            </Text>
            <Text variant="caption" tone="fg2">
              {t('buffcode.filesLine', run.files)}
            </Text>
          </Card>
          {run.waiting?.map((step, i) => (
            <Callout
              key={i}
              tone="warn"
              title={t('buffcode.stepWaiting', { actor: step.actor })}
              action={
                <Button size="sm" variant="primary" disabled={!live} onPress={onOpenSession}>
                  {t('buffcode.answerInSession')}
                </Button>
              }
            />
          ))}
          {run.questions && run.questions.length > 0 && (
            <>
              <Eyebrow>{t('buffcode.subagentQuestions')}</Eyebrow>
              {run.questions.map((q) => (
                <Card key={q.id} style={{ gap: theme.space(2) }}>
                  <Text variant="label" style={{ fontWeight: '600' }}>
                    {t('buffcode.asks', { actor: q.actor })}
                  </Text>
                  <Text tone="fg2">{q.text}</Text>
                  <Field label={t('buffcode.answer')}>
                    <Input rows={2} value={answer} onChangeText={onAnswer} editable={live} />
                  </Field>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={!live || !answer.trim()}
                    onPress={() => onReply?.(q.id)}
                  >
                    {t('buffcode.reply')}
                  </Button>
                </Card>
              ))}
            </>
          )}
          <Eyebrow>{t('buffcode.phases')}</Eyebrow>
          <Card padded={false}>
            {run.phases.length === 0 ? (
              <Text variant="label" tone="muted" style={{ padding: theme.space(4) }}>
                {t('buffcode.noSteps')}
              </Text>
            ) : (
              run.phases.map((phase, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.space(2),
                    paddingHorizontal: theme.space(3),
                    paddingVertical: theme.space(2),
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: theme.colors.border,
                  }}
                >
                  <StatusDot tone={statusTone(phase.status)} pulse={phase.status === 'running'} />
                  <Text variant="label" style={{ flex: 1 }} numberOfLines={2}>
                    {phase.title}
                  </Text>
                  {phase.actor && (
                    <Text variant="caption" tone="muted">
                      {phase.actor}
                    </Text>
                  )}
                </View>
              ))
            )}
          </Card>
          {run.artifacts && run.artifacts.length > 0 && (
            <>
              <Eyebrow>{t('buffcode.artifacts')}</Eyebrow>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
                {run.artifacts.map((a) => (
                  <Badge key={a.name} icon="fileText">{`${a.name} · v${a.version}`}</Badge>
                ))}
              </View>
            </>
          )}
          {run.result && (
            <>
              <Eyebrow>{t('buffcode.result')}</Eyebrow>
              <Card>
                <Prose markdown={run.result} />
              </Card>
            </>
          )}
          <Eyebrow>{t('buffcode.log')}</Eyebrow>
          <Terminal lines={run.log} cursor={run.state === 'running'} />
        </Gutter>
      </View>
    </MachineShell>
  )
}
