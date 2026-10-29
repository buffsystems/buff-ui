/** @jsxRuntime automatic */
/*
  «What was checked» (#629): the build, the tests, the test inventory and the findings — one
  line of marks over a review, unfolded into four tiles on a tap or when something failed.
*/
import { useState, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { toneColors, type Tone } from '../../../Badge.tsx'
import { Icon } from '../../../Icon.tsx'
import type { IconName } from '../../../icons.ts'
import type { Translate } from '../../../i18n.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { CheckRun, CheckStatus, ReviewChecks } from './model.ts'

const TONE: Record<CheckStatus, Tone> = {
  passed: 'ok',
  failed: 'crit',
  running: 'neutral',
  untested: 'warn',
  unknown: 'neutral',
}
const ICON: Record<Tone, IconName> = {
  ok: 'checkCircle',
  crit: 'alertTriangle',
  warn: 'alertTriangle',
  info: 'info',
  neutral: 'clock',
}

function runNote(t: Translate, run: CheckRun, tests: boolean): string | undefined {
  if (run.status === 'unknown' || run.status === 'untested') return undefined
  if (run.status === 'passed' && !run.hasLog) return t('rvd.inSandbox')
  const parts = [run.status === 'failed' ? t('rvd.codeErr') : t('rvd.code0')]
  if (tests && run.runs && run.runs > 1) parts.push(t('rvd.runs', { n: run.runs }))
  if (run.duration)
    parts.push(run.runs && run.runs > 1 ? t('rvd.longest', { d: run.duration }) : run.duration)
  return parts.join(' · ')
}

function Tile({
  tone,
  title,
  note,
  action,
}: {
  tone: Tone
  title: string
  note?: string
  action?: { label: string; onPress?: () => void }
}) {
  const theme = useTheme()
  const { bg, fg } = toneColors(theme, tone)
  // A tile that leads somewhere is pressed as a whole and says so: its action in words with a
  // chevron, at the tile's start — not a bare centred word that reads as a caption.
  const body = (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name={ICON[tone]} size={16} color={fg} />
        <Text variant="label" style={{ color: fg, flex: 1 }} numberOfLines={2}>
          {title}
        </Text>
      </View>
      {note && (
        <Text variant="caption" style={{ color: fg, opacity: 0.85 }} numberOfLines={2}>
          {note}
        </Text>
      )}
      {action && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 }}>
          <Text variant="label" style={{ color: fg, fontWeight: '600' }}>
            {action.label}
          </Text>
          <Icon name="chevronRight" size={16} color={fg} />
        </View>
      )}
    </>
  )
  const style = {
    flexBasis: '48%',
    flexGrow: 1,
    gap: 4,
    padding: theme.space(3),
    borderRadius: theme.radius.md,
    backgroundColor: bg,
  } as const
  if (!action) return <View style={style}>{body}</View>
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${action.label}`}
      onPress={action.onPress}
      style={({ pressed }) => [style, { opacity: pressed ? 0.7 : 1 }]}
    >
      {body}
    </Pressable>
  )
}

export function ChecksBlock({
  checks,
  onLog,
  onFindings,
}: {
  checks: ReviewChecks
  onLog?: () => void
  onFindings?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (checks.build.status === 'unknown' && checks.tests.status === 'unknown') return null
  const build = checks.build.status
  const tests = checks.tests.status
  const buildTitle =
    build === 'failed'
      ? t('rvd.buildFailed')
      : build === 'running'
        ? t('rvd.buildRunning')
        : t('rvd.buildPassed')
  const testsTitle =
    tests === 'failed'
      ? t('rvd.testsFailed')
      : tests === 'running'
        ? t('rvd.testsRunning')
        : tests === 'untested'
          ? t('rvd.testsNone')
          : t('rvd.testsPassed')
  const inv = checks.inventory
  const open = checks.findings.open
  const invTone: Tone = inv && inv.after < inv.before ? 'warn' : 'ok'
  const marks: Mark[] = [
    { tone: TONE[build], label: t('rvd.sumBuild'), full: buildTitle },
    { tone: TONE[tests], label: t('rvd.sumTests'), full: testsTitle },
    ...(inv && inv.after !== inv.before
      ? [
          {
            tone: invTone,
            label:
              inv.after > inv.before
                ? t('rvd.sumInvMore', { n: inv.after - inv.before })
                : t('rvd.sumInvLess'),
            full: inv.after > inv.before ? t('rvd.invMore') : t('rvd.invLess'),
          },
        ]
      : []),
    open > 0
      ? {
          tone: 'warn',
          label: t('rvd.sumFindings', { n: open }),
          full: t('rvd.findingsOpen', { n: open }),
        }
      : { tone: 'ok', label: t('rvd.sumNoFindings'), full: t('rvd.findingsNone') },
  ]
  return (
    <ChecksFold marks={marks} startOpen={build === 'failed' || tests === 'failed'}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
        <Tile tone={TONE[build]} title={buildTitle} note={runNote(t, checks.build, false)} />
        <Tile
          tone={TONE[tests]}
          title={testsTitle}
          note={runNote(t, checks.tests, true)}
          action={checks.tests.hasLog ? { label: t('rvd.log'), onPress: onLog } : undefined}
        />
        {inv && (
          <Tile
            tone={inv.after >= inv.before ? 'ok' : 'warn'}
            title={
              inv.after > inv.before
                ? t('rvd.invMore')
                : inv.after === inv.before
                  ? t('rvd.invSame')
                  : t('rvd.invLess')
            }
            note={t('rvd.invNote', { b: inv.before, a: inv.after, n: inv.added, r: inv.reenabled })}
          />
        )}
        <Tile
          tone={open > 0 ? 'warn' : 'ok'}
          title={open > 0 ? t('rvd.findingsOpen', { n: open }) : t('rvd.findingsNone')}
          note={
            checks.findings.resolved > 0
              ? t('rvd.findingsDismissed', { n: checks.findings.resolved })
              : undefined
          }
          action={{ label: t('review.tabFindings'), onPress: onFindings }}
        />
      </View>
    </ChecksFold>
  )
}

interface Mark {
  tone: Tone
  label: string
  /** The whole sentence, for the screen reader. */
  full: string
}

/** The folded line of marks — «✓ Build · ✓ Tests · +7 tests · ⚠ Findings: 2» — and the tiles. */
function ChecksFold({
  marks,
  startOpen,
  children,
}: {
  marks: Mark[]
  startOpen: boolean
  children: ReactNode
}) {
  const t = useT()
  const theme = useTheme()
  const [open, setOpen] = useState(startOpen)
  return (
    <View style={{ gap: theme.space(2) }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${t('rvd.checksTitle')}: ${marks.map((m) => m.full).join(', ')}`}
        onPress={() => setOpen((was) => !was)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          minHeight: theme.touch,
          paddingHorizontal: theme.space(3),
          paddingVertical: theme.space(2),
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          opacity: pressed ? 0.7 : 1,
          ...theme.raised,
        })}
      >
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }}>
          {marks.map((m) => (
            <View key={m.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name={ICON[m.tone]} size={14} color={toneColors(theme, m.tone).fg} />
              <Text variant="label">{m.label}</Text>
            </View>
          ))}
        </View>
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={18}
          color={theme.colors.mutedForeground}
        />
      </Pressable>
      {open && children}
    </View>
  )
}
