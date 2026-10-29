/** @jsxRuntime automatic */
/*
  The status line of a research (#629): the label, the timer, the commit, the pause.
*/
import { View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Spinner } from '../../../Feedback.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { pauseLine } from '../dev/controls.tsx'
import type { Research } from './model.ts'

export function StatusLine({ research, canWrite }: { research: Research; canWrite: boolean }) {
  const t = useT()
  const theme = useTheme()
  const busy = research.status === 'researching'
  const label = busy
    ? (research.progressNote ?? t('research.stResearching'))
    : research.status === 'waiting'
      ? canWrite
        ? t('research.stWaiting')
        : t('research.stWaitingAuthor')
      : research.status === 'error'
        ? t('research.stError')
        : t('research.stIdle')
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {busy && !research.paused && <Spinner />}
        {!research.paused && (
          <Text
            variant="label"
            tone={research.status === 'error' ? 'destructive' : 'fg2'}
            style={{ flexShrink: 1 }}
          >
            {label}
          </Text>
        )}
        {research.timer && (
          <Text variant="mono" tone="muted">
            {research.timer}
          </Text>
        )}
        {research.baseCommit && (
          <Text variant="caption" tone="muted">
            {`· ${t('research.commit', { sha: research.baseCommit })}`}
          </Text>
        )}
        {research.paused && (
          <Badge tone="warn" icon="pause">
            {t('dev.paused')}
          </Badge>
        )}
      </View>
      {research.paused && (
        <Text variant="caption" tone="muted">
          {pauseLine(t, research.paused)}
        </Text>
      )}
      <View style={{ height: 1, backgroundColor: theme.colors.border }} />
    </View>
  )
}
