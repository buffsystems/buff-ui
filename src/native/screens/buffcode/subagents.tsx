/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { StatusDot } from '../../Badge.tsx'
import { Icon } from '../../Icon.tsx'
import { Row, RowGroup } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { SubagentRef } from './model.ts'

const labelOf = (t: ReturnType<typeof useT>, n: number) =>
  `${t('buffcode.subagents')}: ${t('buffcode.subagentsRunning', { n: String(n) })}`

/** The working subagents in the composer's bottom row (#762): an icon with their count. */
export function SubagentsButton({
  count,
  disabled = false,
  onPress,
}: {
  count: number
  disabled?: boolean
  onPress?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={labelOf(t, count)}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Icon name="bot" size={16} color={c.fg2} />
      <View
        style={{
          position: 'absolute',
          top: 3,
          right: 2,
          minWidth: 16,
          height: 16,
          paddingHorizontal: 4,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: c.primary,
        }}
      >
        <Text
          style={{ color: c.primaryForeground, fontSize: 10, lineHeight: 12, fontWeight: '700' }}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  )
}

/** The same, as a line above a dock that took the composer's place (#762). */
export function SubagentsLine({ count, onPress }: { count: number; onPress?: () => void }) {
  const t = useT()
  const theme = useTheme()
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={labelOf(t, count)}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        minHeight: 40,
        paddingHorizontal: theme.space(4),
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    >
      <StatusDot tone="info" pulse />
      <Text variant="label" tone="fg2" style={{ flex: 1 }} numberOfLines={1}>
        {labelOf(t, count)}
      </Text>
      <Icon name="chevronRight" size={16} color={theme.colors.mutedForeground} />
    </Pressable>
  )
}

/** The working subagents (#762): a tap opens a subagent's session. */
export function SubagentsSheet({
  subagents,
  disabled = false,
  onOpen,
  onClose,
}: {
  subagents: SubagentRef[]
  disabled?: boolean
  onOpen?: (sessionID: string) => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('buffcode.subagents')} onClose={onClose}>
      <RowGroup>
        {subagents.map((s) => (
          <Row
            key={s.id}
            leading={<StatusDot tone="info" pulse />}
            title={s.title || t('buffcode.subagentDefault')}
            {...(s.agent ? { subtitle: s.agent } : {})}
            label={`${t('buffcode.subagentOpen')}: ${s.title || t('buffcode.subagentDefault')}`}
            chevron={!!s.sessionID && !!onOpen}
            disabled={disabled || !s.sessionID || !onOpen}
            onPress={() => s.sessionID && onOpen?.(s.sessionID)}
          />
        ))}
      </RowGroup>
    </Sheet>
  )
}
