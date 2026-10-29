/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { IconButton } from './Button.tsx'
import { useFollowEnd } from './follow-end.ts'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useT, useTheme } from './theme.tsx'

/** The screen container: background, safe areas, a scrolling body unless `scroll={false}`. */
export function Screen({
  children,
  scroll = true,
  footer,
  padded = false,
  refreshing = false,
  onRefresh,
  follow = false,
}: {
  children: ReactNode
  scroll?: boolean
  /** Pull to refresh: the screen asks for fresh data and shows the spinner while `refreshing`. */
  refreshing?: boolean
  onRefresh?: () => void
  /** Pinned under the body: a composer, a primary action. */
  footer?: ReactNode
  padded?: boolean
  /** A live chat (#703): opens at the latest and keeps up with what arrives while at the bottom. */
  follow?: boolean
}) {
  const theme = useTheme()
  const tail = useFollowEnd(follow ? 'end' : 'top')
  const pad = padded ? theme.space(4) : 0
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {scroll ? (
        <ScrollView
          ref={tail.ref}
          onScroll={follow ? tail.onScroll : undefined}
          onContentSizeChange={follow ? tail.onContentSizeChange : undefined}
          scrollEventThrottle={follow ? 100 : undefined}
          style={{ flex: 1 }}
          // A tap on a row while the keyboard is up acts at once, not just hides the keyboard.
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.mutedForeground}
              />
            ) : undefined
          }
          contentContainerStyle={{
            padding: pad,
            gap: theme.space(3),
            paddingBottom: theme.space(6),
          }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: pad }}>{children}</View>
      )}
      {footer && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.background,
          }}
        >
          {footer}
        </View>
      )}
    </View>
  )
}

/** The top bar: back, a title (with an optional subtitle), actions on the right. */
export function TopBar({
  title,
  subtitle,
  onBack,
  actions,
  leading,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
  actions?: ReactNode
  /** Replaces the back button: an install switcher, an avatar. */
  leading?: ReactNode
}) {
  const theme = useTheme()
  const t = useT()
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        minHeight: 52,
        paddingHorizontal: theme.space(2),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
      }}
    >
      {leading ??
        (onBack && <IconButton icon="arrowLeft" label={t('common.back')} onPress={onBack} />)}
      <View style={{ flex: 1, paddingHorizontal: leading || onBack ? 0 : theme.space(2) }}>
        <Text variant="heading" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: 2 }}>{actions}</View>
    </View>
  )
}

export interface TabItem {
  id: string
  label: string
  icon: IconName
  badge?: number
}

/** The bottom tab bar of an install: the sections. */
export function TabBar({
  items,
  selected,
  onSelect,
}: {
  items: TabItem[]
  selected: string
  onSelect?: (id: string) => void
}) {
  const theme = useTheme()
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        paddingBottom: 8,
      }}
    >
      {items.map((item) => {
        const active = item.id === selected
        const color = active ? theme.colors.primary : theme.colors.mutedForeground
        return (
          <Pressable
            key={item.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            onPress={() => onSelect?.(item.id)}
            style={{ flex: 1, alignItems: 'center', paddingTop: 8, gap: 2, minHeight: theme.touch }}
          >
            <View>
              <Icon name={item.icon} size={22} color={color} strokeWidth={active ? 2.25 : 1.75} />
              {item.badge ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    minWidth: 16,
                    height: 16,
                    paddingHorizontal: 4,
                    borderRadius: 8,
                    backgroundColor: theme.colors.destructive,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: theme.colors.destructiveForeground,
                      fontSize: 10,
                      lineHeight: 12,
                      fontWeight: '700',
                    }}
                  >
                    {String(item.badge)}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              variant="caption"
              style={{ color, fontSize: 10, lineHeight: 12 }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
