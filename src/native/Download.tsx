/** @jsxRuntime automatic */
import { View } from 'react-native'
import { downloadLabel, downloadShare, type Download } from './download.ts'
import { Icon } from './Icon.tsx'
import { Text } from './Text.tsx'
import { useT, useTheme } from './theme.tsx'

/** A thin bar filled to the share that came (#809). */
export function ProgressBar({ value }: { value: number }) {
  const theme = useTheme()
  const c = theme.colors
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      aria-valuenow={percent}
      style={{ height: 6, borderRadius: 3, backgroundColor: c.muted2, overflow: 'hidden' }}
    >
      <View style={{ width: `${percent}%`, height: '100%', backgroundColor: c.primary }} />
    </View>
  )
}

/**
 * A file on its way (#809): its name, the bar, how much came of how much and how long is left —
 * so a big file does not look like a hang.
 */
export function DownloadProgress({ name, ...download }: Download & { name?: string }) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.space(3),
        padding: theme.space(6),
      }}
    >
      <Icon name="file" size={40} color={c.mutedForeground} />
      {name ? (
        <Text align="center" numberOfLines={2} style={{ fontWeight: '500' }}>
          {name}
        </Text>
      ) : null}
      <View style={{ alignSelf: 'stretch', gap: theme.space(2) }}>
        <ProgressBar value={downloadShare(download)} />
        <Text variant="caption" tone="muted" align="center">
          {downloadLabel(download, t)}
        </Text>
      </View>
    </View>
  )
}
