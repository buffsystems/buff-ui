/** @jsxRuntime automatic */
/*
  The stages of a task (#629): the words for them, the seven-square pipe of the list and the
  strip of the detail screen — green passed, blue current, red stopped.
*/
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import type { Tone } from '../../../Badge.tsx'
import { Icon } from '../../../Icon.tsx'
import { Spinner } from '../../../Feedback.tsx'
import type { Translate } from '../../../i18n.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { STAGE_ORDER, type PostPoolStep, type TaskRow, type TaskStageId } from './model.ts'

const STAGE_KEY: Record<TaskStageId, string> = {
  request: 'dev.stageRequest',
  formulation: 'dev.stageFormulation',
  decomposition: 'dev.stageDecomposition',
  development: 'dev.stageDevelopment',
  review: 'dev.stageReview',
  publication: 'dev.stagePublication',
  merged: 'dev.stageMerged',
}
const STRIP_KEY: Partial<Record<TaskStageId, string>> = {
  review: 'dev.stageReviewStrip',
  merged: 'dev.stageMergedStrip',
}
const STEP_KEY: Record<PostPoolStep, string> = {
  sync: 'dev.stepSync',
  conflicts: 'dev.stepConflicts',
  acceptance: 'dev.stepAcceptance',
  rework: 'dev.stepRework',
  open_prs: 'dev.stepOpenPrs',
}

export function stageLabel(t: Translate, id: TaskStageId, strip = false): string {
  return t((strip && STRIP_KEY[id]) || STAGE_KEY[id])
}

/** The status word of a task: rejected / stopped / draft win over the stage. */
export function taskStatus(t: Translate, task: TaskRow): { label: string; tone: Tone } {
  if (task.stage.rejected) return { label: t('dev.statusRejected'), tone: 'crit' }
  if (task.stage.stopped) return { label: t('dev.statusStopped'), tone: 'crit' }
  if (task.draft) return { label: t('dev.statusDraft'), tone: 'neutral' }
  const id = task.stage.id
  const tone: Tone = id === 'review' ? 'warn' : id === 'merged' ? 'ok' : 'info'
  return { label: stageLabel(t, id), tone }
}

/** The second line of a task row: why it is where it is — what its status chip does not say. */
export function taskSubtitle(t: Translate, task: TaskRow): string {
  const parts: string[] = []
  // A cancelled run says so in its chip, «Прогон отменён»: nothing to add.
  const live = !task.stage.rejected && !task.stage.stopped
  if (task.stage.rejected) parts.push(t('dev.subRejected'))
  if (live && task.stage.id === 'review')
    parts.push(
      task.openFindings ? t('dev.findingsOpen', { n: task.openFindings }) : t('dev.findingsNone'),
    )
  if (live && task.stage.id === 'merged') parts.push(t('dev.subMerged'))
  if (task.step) parts.push(t(STEP_KEY[task.step]))
  if (task.devprep) parts.push(t('dev.subDevprep'))
  return parts.join(' · ')
}

/**
  Seven small squares: passed, current, ahead. `wide`: seven bars sharing the row's width — the
  folded strip of the detail screen.
*/
export function StagePipe({ stage, wide = false }: { stage: TaskRow['stage']; wide?: boolean }) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View style={{ flexDirection: 'row', gap: wide ? 4 : 3 }} accessibilityElementsHidden>
      {STAGE_ORDER.map((id, i) => {
        const done = i < stage.index || (stage.id === 'merged' && i === stage.index)
        const current = i === stage.index && !done
        const bg = done
          ? c.success
          : current
            ? stage.stopped || stage.rejected
              ? c.destructive
              : c.primary
            : c.muted2
        return (
          <View
            key={id}
            style={
              wide
                ? { flex: 1, height: 6, borderRadius: 3, backgroundColor: bg }
                : { width: 10, height: 10, borderRadius: 2, backgroundColor: bg }
            }
          />
        )
      })}
    </View>
  )
}

/** The headline over the strip: where the task is, in words. */
export function stripHeadline(t: Translate, stage: TaskRow['stage'], paused: boolean): string {
  const genitive = stageLabel(t, stage.id, true).toLowerCase()
  if (stage.rejected) return t('dev.stagesRejected')
  if (stage.stopped) return `${t('dev.stagesStopped')} · ${genitive}`
  if (stage.id === 'merged') return t('dev.stagesAll')
  if (paused) return t('dev.stagesPaused', { i: stage.index + 1 })
  return t('dev.stagesOf', { i: stage.index + 1, stage: genitive })
}

/** The seven stages, each with a note: a coloured rail, title and note on one line. */
export function StageStrip({
  stage,
  notes,
  paused = false,
  running = false,
}: {
  stage: TaskRow['stage']
  notes: Partial<Record<TaskStageId, string>>
  paused?: boolean
  running?: boolean
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  // Folded, the strip is one line — where the task is, and the seven bars — so the task's own
  // call to act stays on the first screen; the stages with their notes open on a tap.
  const [open, setOpen] = useState(false)
  const headline = `${t('dev.stagesTitle')} · ${stripHeadline(t, stage, paused)}`
  return (
    <View style={{ gap: 6 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={headline}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        hitSlop={8}
        style={{ gap: 8 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
          <Text
            variant="caption"
            tone="muted"
            style={{ flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {headline}
          </Text>
          {running && !paused && !open && <Spinner />}
          <Icon name={open ? 'chevronDown' : 'chevronRight'} size={16} color={c.mutedForeground} />
        </View>
        {!open && <StagePipe stage={stage} wide />}
      </Pressable>
      {open &&
        STAGE_ORDER.map((id, i) => {
          const done = i < stage.index || (stage.id === 'merged' && i === stage.index)
          const current = i === stage.index && !done
          const bad = current && (stage.stopped || stage.rejected)
          const rail = done ? c.success : current ? (bad ? c.destructive : c.primary) : c.border
          const note = current && paused ? t('dev.onPause') : notes[id]
          const ahead = !done && !current
          return (
            <View
              key={id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.space(3),
                minHeight: 32,
                paddingLeft: theme.space(2),
                borderLeftWidth: 3,
                borderLeftColor: rail,
                backgroundColor: current ? (bad ? c.destructiveSoft : c.brandSoft) : 'transparent',
                borderRadius: 4,
              }}
            >
              {done ? (
                <Icon name="check" size={14} color={c.success} />
              ) : current && running && !paused ? (
                <Spinner />
              ) : (
                <View style={{ width: 14 }} />
              )}
              <Text variant="label" tone={ahead ? 'muted' : 'fg'} style={{ minWidth: 110 }}>
                {stageLabel(t, id, true)}
              </Text>
              <Text variant="caption" tone="muted" numberOfLines={1} style={{ flex: 1 }}>
                {ahead && id !== 'merged'
                  ? ''
                  : (note ?? (id === 'merged' ? t('dev.afterApproval') : ''))}
              </Text>
            </View>
          )
        })}
    </View>
  )
}
