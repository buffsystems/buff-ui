/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Spinner } from '../../Feedback.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { GitState, PermissionMode } from './model.ts'
import { MODE_KEY } from './new-session.tsx'
import { variantLabel } from './variant.ts'
import { workModeLabel, type WorkMode } from './work-mode.tsx'

/**
 * One quiet line over the composer instead of a row of chips (owner's review): the model,
 * the branch with its counts, the permission mode — tap it for the session details sheet.
 */
export function SessionContextLine({
  model,
  variant,
  git,
  mode,
  plan = false,
  work,
  disabled = false,
  onPress,
}: {
  model?: string
  /** The model's thinking mode (#759) by its variant id; the default one is not named. */
  variant?: string
  git?: GitState
  mode?: PermissionMode
  plan?: boolean
  /** The work mode (#894): Plan and Setup are named first — it is what the agent is doing. */
  work?: WorkMode
  disabled?: boolean
  onPress?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const named = workModeLabel(work ?? (plan ? 'plan' : 'work'))
  const parts = [
    named && t(named),
    model && variant && variant !== 'default' ? `${model} · ${variantLabel(t, variant)}` : model,
    git?.branch &&
      [
        git.branch,
        git.changes.length ? `±${git.changes.length}` : '',
        git.ahead ? `↑${git.ahead}` : '',
      ]
        .filter(Boolean)
        .join(' '),
    mode && t(MODE_KEY[mode]),
  ].filter(Boolean)
  if (parts.length === 0) return null
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('buffcode.contextDetails')}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: theme.space(4),
        paddingVertical: 6,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Text variant="caption" tone="muted" numberOfLines={1} style={{ flex: 1 }}>
        {parts.join(' · ')}
      </Text>
      <Icon name="chevronRight" size={14} color={c.mutedForeground} />
    </Pressable>
  )
}

/** The floating «to the latest message» button, shown while the timeline is scrolled up. */
export function JumpToLatest({ onPress }: { onPress?: () => void }) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        position: 'absolute',
        right: theme.space(4),
        bottom: theme.space(3),
        alignItems: 'flex-end',
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('buffcode.toLatest')}
        onPress={onPress}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: c.foreground,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 0.92,
        })}
      >
        <Icon name="arrowDown" size={18} color={c.background} strokeWidth={2.25} />
      </Pressable>
    </View>
  )
}

/**
 * Under the latest turn while the machine works on it (#742): the brand's breathing brain,
 * «Working…» and how long the turn has run — as the window's «Working» and Ask's «thinking» line.
 * Stays until the turn ends: the phone sees the answer in snapshots, and a pause between them
 * must not read as a stall.
 */
export function WorkingLine({ elapsed }: { elapsed?: string }) {
  const t = useT()
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
    >
      <Spinner />
      <Text variant="label" tone="muted">
        {t('buffcode.working')}
      </Text>
      {elapsed && (
        <Text variant="mono" tone="muted">
          {elapsed}
        </Text>
      )}
    </View>
  )
}

/** In place of the composer while a dock waits for the person's answer. */
export function WaitingAboveNote() {
  const t = useT()
  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        padding: theme.space(3),
        paddingHorizontal: theme.space(4),
      }}
    >
      <Icon name="info" size={16} color={theme.colors.mutedForeground} />
      <Text variant="caption" tone="muted" style={{ flex: 1 }}>
        {t('buffcode.waitingAbove')}
      </Text>
    </View>
  )
}

/** A subagent's session (#753): the parent session answers, here one only reads. */
export function ReadOnlyNote() {
  const t = useT()
  const theme = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        padding: theme.space(3),
        paddingHorizontal: theme.space(4),
      }}
    >
      <Icon name="eye" size={16} color={theme.colors.mutedForeground} />
      <Text variant="caption" tone="muted" style={{ flex: 1 }}>
        {t('buffcode.subagentReadOnly')}
      </Text>
    </View>
  )
}
