/** @jsxRuntime automatic */
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react'
import { Keyboard, Platform, ScrollView, TextInput, View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { IconButton } from '../../Button.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { useKeyboardShown } from '../../keyboard.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** The body's room above the keyboard's edge once a field is scrolled into view. */
const FIELD_GAP = 12

/**
 * The frame of a dock above the composer: a tinted card with a title row, body and actions.
 * A dock may be taller than what is left of the screen — a long question over an open keyboard
 * (#935) — so the title and the actions stay put and the body between them scrolls. The field
 * being typed in is kept in sight, and the keyboard can be put away: by the button in the title
 * row, by dragging the body, by a tap beside the field.
 */
export function DockFrame({
  icon,
  title,
  badge,
  warning = false,
  children,
  footer,
}: {
  icon: IconName
  title: string
  badge?: string
  warning?: boolean
  children?: ReactNode
  footer: ReactNode
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const keyboard = useKeyboardShown()
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  const content = useRef<ComponentRef<typeof View>>(null)
  const [viewport, setViewport] = useState(0)

  // The field being typed in comes into sight: when the keyboard takes its half of the screen
  // and whenever the body's room changes under it.
  useEffect(() => {
    if (!keyboard || !viewport) return
    const field = TextInput.State.currentlyFocusedInput?.()
    const inner = content.current
    if (!field || !inner) return
    field.measureLayout(
      inner,
      (_x, y, _w, height) =>
        scroll.current?.scrollTo({ y: Math.max(0, y + height + FIELD_GAP - viewport) }),
      () => undefined,
    )
  }, [keyboard, viewport])

  return (
    <View
      accessibilityRole="alert"
      style={{
        // With the keyboard up the dock may take all that is left; without it a part of the
        // conversation stays in sight above.
        flexShrink: 1,
        maxHeight: keyboard ? '100%' : '80%',
        marginHorizontal: theme.space(3),
        marginBottom: theme.space(2),
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: warning ? c.warning : c.borderStrong,
        backgroundColor: c.popover,
        padding: theme.space(3),
        gap: theme.space(3),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        <Icon name={icon} size={18} color={warning ? c.warning : c.primary} />
        <Text variant="label" style={{ flex: 1, fontWeight: '600' }}>
          {title}
        </Text>
        {badge && <Badge tone="neutral">{badge}</Badge>}
        {keyboard && (
          <IconButton
            icon="chevronDown"
            size="sm"
            label={t('common.hideKeyboard')}
            onPress={() => Keyboard.dismiss()}
          />
        )}
      </View>
      <ScrollView
        ref={scroll}
        testID="dock-body"
        style={{ flexGrow: 0, flexShrink: 1 }}
        onLayout={(e) => setViewport(e.nativeEvent.layout.height)}
        // A tap on an option or a button acts at once; a tap beside them puts the keyboard away.
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <View ref={content} style={{ gap: theme.space(3) }}>
          {children}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: theme.space(2),
          flexWrap: 'wrap',
        }}
      >
        {footer}
      </View>
    </View>
  )
}
