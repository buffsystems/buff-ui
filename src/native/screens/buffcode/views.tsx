/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

export type SessionView = 'session' | 'changes' | 'files' | 'terminal' | 'usage'
const TABS: SessionView[] = ['session', 'changes', 'files', 'terminal']
const VIEW_KEY: Record<SessionView, string> = {
  session: 'buffcode.viewSession',
  changes: 'buffcode.viewChanges',
  files: 'buffcode.viewFiles',
  terminal: 'buffcode.viewTerminal',
  usage: 'buffcode.viewUsage',
}

/** The window's phone view switcher: session / changes / files / terminal, and «…» for usage, details. */
export function ViewSwitcher({
  current,
  changes,
  onSelect,
  onMore,
}: {
  current: SessionView
  changes?: number
  onSelect?: (view: SessionView) => void
  onMore?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: c.border,
        backgroundColor: c.background,
      }}
    >
      <View
        accessibilityRole="tablist"
        style={{ flex: 1, flexDirection: 'row', paddingHorizontal: theme.space(1) }}
      >
        {TABS.map((view) => {
          const active = view === current
          return (
            <Pressable
              key={view}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect?.(view)}
              style={{
                flexGrow: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                height: 44,
                paddingHorizontal: 6,
                borderBottomWidth: 2,
                borderBottomColor: active ? c.primary : 'transparent',
              }}
            >
              <Text
                variant="label"
                tone={active ? 'fg' : 'muted'}
                numberOfLines={1}
                style={{ fontSize: 12.5 }}
              >
                {t(VIEW_KEY[view])}
              </Text>
              {view === 'changes' && changes ? (
                <Badge tone={active ? 'info' : 'neutral'}>{changes}</Badge>
              ) : null}
            </Pressable>
          )
        })}
      </View>
      <IconButton icon="ellipsis" label={t('common.more')} onPress={onMore} size="sm" />
    </View>
  )
}

/** The «…» of the switcher: usage and the session details, as a tiny menu under the bar. */
export function ViewMenu({
  onUsage,
  onDetails,
  onCompact,
  onUndo,
  onRedo,
  onRename,
  onClose,
}: {
  onUsage?: () => void
  onDetails?: () => void
  /** The session's palette (#653): what is offered is what can be done now. */
  onCompact?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onRename?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
      <Pressable
        accessibilityLabel={t('common.close')}
        onPress={onClose}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <View
        style={{
          position: 'absolute',
          top: 48,
          right: theme.space(2),
          minWidth: 200,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.popover,
          paddingVertical: 4,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {[
          { label: t(VIEW_KEY.usage), icon: 'zap' as const, onPress: onUsage },
          { label: t('buffcode.sessionDetails'), icon: 'info' as const, onPress: onDetails },
          ...(onCompact
            ? [{ label: t('buffcode.compact'), icon: 'archive' as const, onPress: onCompact }]
            : []),
          ...(onUndo
            ? [{ label: t('buffcode.undo'), icon: 'undo' as const, onPress: onUndo }]
            : []),
          ...(onRedo
            ? [{ label: t('buffcode.redo'), icon: 'redo' as const, onPress: onRedo }]
            : []),
          ...(onRename
            ? [{ label: t('buffcode.rename'), icon: 'pencil' as const, onPress: onRename }]
            : []),
        ].map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="menuitem"
            onPress={item.onPress}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.space(3),
              height: 44,
              paddingHorizontal: theme.space(4),
              backgroundColor: pressed ? c.muted : 'transparent',
            })}
          >
            <Icon name={item.icon} size={16} color={c.mutedForeground} />
            <Text variant="label">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
