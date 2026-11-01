/** @jsxRuntime automatic */
/*
  The run log of a task's checks (#647): each step of the test run with its outcome and
  duration; a step opens to its output, read in pages.
*/
import { Pressable, View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Terminal } from '../../../Code.tsx'
import { Icon } from '../../../Icon.tsx'
import type { InstallStatus, LoadFailure } from '../../../model.ts'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'

export interface CheckLogStep {
  id: string
  /** «tests · прогон 1 из 2». */
  label: string
  status: 'ok' | 'failed' | 'running'
  duration?: string
  open?: boolean
  /** The output read so far. */
  lines?: string[]
  total?: number
  loading?: boolean
  error?: LoadFailure
}

const TONE: Record<CheckLogStep['status'], Tone> = { ok: 'ok', failed: 'crit', running: 'neutral' }
const LABEL: Record<CheckLogStep['status'], string> = {
  ok: 'rvd.code0',
  failed: 'rvd.codeErr',
  running: 'rvd.stepRunning',
}

export function CheckLogScreen({
  status,
  task,
  steps,
  loading = false,
  error = false,
  onToggle,
  onMore,
  onRetry,
  onBack,
}: {
  status: InstallStatus
  task: number
  steps: CheckLogStep[]
  loading?: boolean
  error?: LoadFailure
  onToggle?: (id: string) => void
  onMore?: (id: string) => void
  /** Without a step: the run itself; with one: that step's output. */
  onRetry?: (id?: string) => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar title={t('rvd.log')} subtitle={t('review.ofTask', { n: task })} onBack={onBack} />
      <Screen>
        <InstallBanner status={status} />
        {loading ? (
          <ListSkeleton rows={4} />
        ) : error ? (
          <LoadError error={error} onRetry={() => onRetry?.()} />
        ) : (
          <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
            {steps.map((s) => (
              <Card key={s.id} style={{ gap: theme.space(2) }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={s.label}
                  accessibilityState={{ expanded: !!s.open }}
                  onPress={() => onToggle?.(s.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Icon
                    name={s.open ? 'chevronDown' : 'chevronRight'}
                    size={16}
                    color={theme.colors.mutedForeground}
                  />
                  <Text variant="label" style={{ flex: 1 }} numberOfLines={2}>
                    {s.label}
                  </Text>
                  <Badge tone={TONE[s.status]}>{t(LABEL[s.status])}</Badge>
                  {s.duration && (
                    <Text variant="mono" tone="muted">
                      {s.duration}
                    </Text>
                  )}
                </Pressable>
                {s.open && <StepBody step={s} onMore={onMore} onRetry={onRetry} />}
              </Card>
            ))}
          </View>
        )}
      </Screen>
    </>
  )
}

function StepBody({
  step,
  onMore,
  onRetry,
}: {
  step: CheckLogStep
  onMore?: (id: string) => void
  onRetry?: (id?: string) => void
}) {
  const t = useT()
  const lines = step.lines ?? []
  const total = step.total ?? lines.length
  return (
    <View style={{ gap: 8 }}>
      {lines.length > 0 ? (
        <Terminal lines={lines} />
      ) : (
        !step.loading &&
        !step.error && (
          <Text variant="caption" tone="muted">
            {t('rvd.logEmpty')}
          </Text>
        )
      )}
      {step.error ? (
        <LoadError error={step.error} onRetry={() => onRetry?.(step.id)} />
      ) : step.loading ? (
        <ListSkeleton rows={2} />
      ) : (
        total > lines.length && (
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text variant="caption" tone="muted">
              {t('devt.loadedOf', { n: lines.length, total })}
            </Text>
            <Button variant="ghost" onPress={() => onMore?.(step.id)}>
              {t('devt.showMore')}
            </Button>
          </View>
        )
      )}
    </View>
  )
}
