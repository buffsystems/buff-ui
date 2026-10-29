/** @jsxRuntime automatic */
/*
  Picking the audit sections to (re)run (#629), with the confirm step before the launch.
*/
import { Pressable, View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Callout } from '../../../Feedback.tsx'
import { Icon } from '../../../Icon.tsx'
import { Row, RowGroup } from '../../../Row.tsx'
import { Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { isLocked, type AuditSection } from './model.ts'

/** Pick the sections to (re)run; `confirm` shows the second step. */
export function AuditPickSheet({
  mode,
  sections,
  picked,
  confirm = false,
  launching = false,
  error,
  onToggle,
  onToggleAll,
  onNext,
  onBack,
  onLaunch,
  onClose,
}: {
  mode: 'launch' | 'restart'
  sections: AuditSection[]
  picked: string[]
  confirm?: boolean
  launching?: boolean
  error?: string
  onToggle?: (id: string) => void
  onToggleAll?: () => void
  onNext?: () => void
  onBack?: () => void
  onLaunch?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const selectable = sections.filter((s) => !isLocked(s))
  const all = selectable.length > 0 && selectable.every((s) => picked.includes(s.id))
  const n = picked.length
  if (confirm)
    return (
      <Sheet
        title={t('audit.confirmTitle')}
        onClose={onClose}
        footer={
          <>
            <Button variant="primary" block loading={launching} onPress={onLaunch}>
              {launching ? t('audit.launching') : t('audit.yesLaunch', { n })}
            </Button>
            <Button variant="secondary" block disabled={launching} onPress={onBack}>
              {t('common.back')}
            </Button>
          </>
        }
      >
        <Callout tone="warn">{t('audit.confirmWarn')}</Callout>
        <Text variant="label">{t('audit.willForm', { n })}</Text>
        {sections
          .filter((s) => picked.includes(s.id))
          .map((s) => (
            <Text key={s.id} variant="caption" tone="fg2">
              {`• ${s.title}`}
            </Text>
          ))}
        {error && <Callout tone="crit">{error}</Callout>}
      </Sheet>
    )
  const note = (s: AuditSection) =>
    s.status === 'in_progress'
      ? t('audit.noteForming')
      : s.status === 'scheduled'
        ? t('audit.noteScheduled')
        : s.status === 'ready'
          ? t('audit.noteCurrent', { date: s.date ?? '' })
          : t('audit.noteMissing')
  return (
    <Sheet
      title={mode === 'launch' ? t('audit.pickLaunch') : t('audit.pickRestart')}
      onClose={onClose}
      footer={
        <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
          <Button variant="ghost" onPress={onToggleAll}>
            {all ? t('audit.clearAll') : t('audit.selectAll')}
          </Button>
          <Button variant="primary" disabled={n === 0} onPress={onNext} style={{ flex: 1 }}>
            {t('audit.launchN', { n })}
          </Button>
        </View>
      }
    >
      <Text variant="caption" tone="muted">
        {mode === 'launch' ? t('audit.pickLaunchText') : t('audit.pickRestartText')}
      </Text>
      <RowGroup>
        {sections.map((s) => {
          const on = picked.includes(s.id)
          const locked = isLocked(s)
          return (
            <Row
              key={s.id}
              leading={
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on, disabled: locked }}
                  accessibilityLabel={s.title}
                  disabled={locked}
                  onPress={() => onToggle?.(s.id)}
                  hitSlop={10}
                >
                  <Icon
                    name={on ? 'checkCircle' : 'square'}
                    size={20}
                    color={on ? c.primary : c.mutedForeground}
                  />
                </Pressable>
              }
              title={s.title}
              subtitle={`${note(s)} · ${s.about}`}
              onPress={() => onToggle?.(s.id)}
              disabled={locked}
              lines={2}
            />
          )
        })}
      </RowGroup>
    </Sheet>
  )
}
