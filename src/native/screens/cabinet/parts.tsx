/** @jsxRuntime automatic */
/*
  The pieces several cabinet sections share (#629): a scrolling tab strip for a detail
  screen, attachments with their transfer progress, the attach sheet, a composer, and
  the loading / failed states of a list.
*/
import { useEffect, useRef, type ComponentRef } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Button } from '../../Button.tsx'
import { EmptyState, Skeleton } from '../../Feedback.tsx'
import { Segmented } from '../../Field.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { LoadFailure } from '../../model.ts'
import type { ProjectRef } from './model.ts'

export { ProjectLink, ProjectPickerSheet } from './project-pick.tsx'

export interface StripTab {
  id: string
  label: string
  count?: number
}

/** The tabs of a detail screen: more than fit a `Segmented`, so they scroll sideways. */
export function TabStrip({
  tabs,
  selected,
  onSelect,
}: {
  tabs: StripTab[]
  selected: string
  onSelect?: (id: string) => void
}) {
  const theme = useTheme()
  const c = theme.colors
  // The picked tab is always in view (#692): on a narrow phone the last ones sit off the edge.
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const starts = useRef<Record<string, number>>({})
  useEffect(() => {
    const x = starts.current[selected]
    if (x !== undefined) scroll.current?.scrollTo({ x: Math.max(0, x - theme.space(6)) })
  }, [selected, theme])
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: c.border }}>
      <ScrollView ref={scroll} horizontal showsHorizontalScrollIndicator={false}>
        <View
          accessibilityRole="tablist"
          style={{ flexDirection: 'row', paddingHorizontal: theme.space(2) }}
        >
          {tabs.map((tab) => {
            const active = tab.id === selected
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={tab.label}
                onPress={() => onSelect?.(tab.id)}
                onLayout={(e) => {
                  starts.current[tab.id] = e.nativeEvent.layout.x
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: theme.touch,
                  paddingHorizontal: theme.space(3),
                  borderBottomWidth: 2,
                  borderBottomColor: active ? c.primary : 'transparent',
                }}
              >
                <Text variant="label" tone={active ? 'fg' : 'muted'}>
                  {tab.label}
                </Text>
                {tab.count !== undefined && (
                  <Text variant="caption" tone="muted">
                    {String(tab.count)}
                  </Text>
                )}
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

/** Grey rows while a list loads. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  const theme = useTheme()
  return (
    <View
      accessibilityLabel={useT()('common.loading')}
      style={{ paddingHorizontal: theme.space(4), gap: theme.space(3) }}
    >
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={{ gap: 8 }}>
          <Skeleton width={i % 2 ? '70%' : '85%'} height={16} />
          <Skeleton width="45%" height={12} />
        </View>
      ))}
    </View>
  )
}

/** A list's «new …» in plain sight (#696): a full-width button over the list, not a «+» in
 *  the corner one has to look for. */
export function CreateButton({
  label,
  onPress,
  disabled,
}: {
  label: string
  onPress?: () => void
  disabled?: boolean
}) {
  const theme = useTheme()
  return (
    <View style={{ paddingHorizontal: theme.space(4) }}>
      <Button variant="primary" leadingIcon="plus" block disabled={disabled} onPress={onPress}>
        {label}
      </Button>
    </View>
  )
}

/** A list or a detail that failed to load: the reason the install gave (#739) when there is
 *  one, else the screen's sentence — and «Retry». */
export function LoadError({
  error,
  text,
  onRetry,
}: {
  error?: LoadFailure
  text?: string
  onRetry?: () => void
}) {
  const t = useT()
  return (
    <EmptyState
      icon="alertTriangle"
      title={t('cabinet.errorTitle')}
      text={typeof error === 'string' ? error : (text ?? t('common.error'))}
      action={{ label: t('common.retry'), icon: 'refreshCw', onPress: onRetry }}
    />
  )
}

/** The next page of a list (#739): shown while the install says there is one. */
export function MoreButton({
  onPress,
  loading = false,
}: {
  onPress?: () => void
  loading?: boolean
}) {
  const t = useT()
  return (
    <Button variant="ghost" loading={loading} onPress={onPress} style={{ alignSelf: 'center' }}>
      {t('common.showMore')}
    </Button>
  )
}

/** A section's screen heading (#696): the project its list belongs to, then what the list is —
 *  the project is picked in the drawer, so the page itself says whose list this is. */
export function inProject(project: ProjectRef | undefined, what?: string): string | undefined {
  return [project?.name, what].filter(Boolean).join(' · ') || undefined
}

/** Above a section's list (#644, #645, #646): the cabinet's «Все / Мои» switch, where the host
 *  gives it. */
export function ListHeader({ mine, onMine }: { mine?: boolean; onMine?: (mine: boolean) => void }) {
  const t = useT()
  const theme = useTheme()
  if (!onMine) return null
  return (
    <View style={{ paddingHorizontal: theme.space(4) }}>
      <Segmented
        value={mine ? 'mine' : 'all'}
        onChange={(id) => onMine(id === 'mine')}
        options={[
          { id: 'all', label: t('cabinet.all') },
          { id: 'mine', label: t('cabinet.mine') },
        ]}
      />
    </View>
  )
}
