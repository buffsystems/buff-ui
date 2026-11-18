/** @jsxRuntime automatic */
import { Animated, View } from 'react-native'
import { Button, IconButton } from '../Button.tsx'
import { Text } from '../Text.tsx'
import { useT, useTheme } from '../theme.tsx'
import type { Tour } from './use-tour.ts'

/** The bars over the tour: one per card, the current one filling as its time runs. */
export function TourProgress({ count, tour }: { count: number; tour: Tour }) {
  const t = useT()
  const theme = useTheme()
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={t('tour.card', { n: tour.index + 1, total: count })}
      style={{ flexDirection: 'row', gap: theme.space(1) }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: theme.radius.full,
            // A track a person can see and a fill that stands off it: 3:1 both ways, in both themes.
            backgroundColor: theme.scheme === 'dark' ? '#6f7684' : theme.colors.mutedForeground,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: 4,
              backgroundColor: theme.colors.foreground,
              width:
                i < tour.index
                  ? '100%'
                  : i > tour.index
                    ? '0%'
                    : tour.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
            }}
          />
        </View>
      ))}
    </View>
  )
}

/**
 * The brand and what it is in one line, and the tour's own controls as real buttons: back, pause
 * (while cards turn by themselves), next, «Skip» — what a tap, a hold and a drag do, for whoever
 * cannot or would not use gestures.
 */
export function TourHeader({ tour, onClose }: { tour: Tour; onClose?: (() => void) | undefined }) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ paddingTop: theme.space(1), gap: theme.space(1) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text variant="heading" style={{ flex: 1 }}>
          Buff
        </Text>
        <IconButton
          icon="chevronLeft"
          label={t('tour.back')}
          disabled={!tour.canBack}
          onPress={tour.back}
        />
        {tour.pausable && (
          <IconButton
            icon={tour.paused ? 'play' : 'pause'}
            label={t(tour.paused ? 'tour.play' : 'tour.pause')}
            onPress={tour.togglePause}
          />
        )}
        <IconButton icon="chevronRight" label={t('tour.next')} onPress={tour.next} />
        <Button variant="ghost" onPress={onClose}>
          {t('tour.skip')}
        </Button>
      </View>
      <Text variant="label" tone="fg2">
        {t('tour.tagline')}
      </Text>
    </View>
  )
}
