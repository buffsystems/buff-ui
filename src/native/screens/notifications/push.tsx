/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { makeTheme, useT, useTheme, type Scheme } from '../../theme.tsx'

/**
 * A mock of the system notification as it arrives on the lock screen: the app mark, the
 * install as the sender, the title, the body and where tapping leads. `scheme` forces one
 * appearance (a preview shows both); otherwise it follows the theme.
 */
export function PushNotificationMock({
  scheme,
  installName,
  title,
  body,
  when,
  target,
}: {
  scheme?: Scheme
  installName: string
  title: string
  body?: string
  when?: string
  target?: string
}) {
  const t = useT()
  const current = useTheme()
  const theme = scheme ? makeTheme(scheme) : current
  const c = theme.colors
  return (
    <View
      accessibilityRole="summary"
      style={{
        flexDirection: 'row',
        gap: theme.space(3),
        padding: theme.space(3),
        borderRadius: theme.radius.lg + 6,
        backgroundColor:
          theme.scheme === 'dark' ? 'rgba(30, 32, 40, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          // The app's own icon (#694): the blue brain on the brand's near-black.
          backgroundColor: '#11111b',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="brain" size={22} color="#2563eb" strokeWidth={2.25} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            variant="caption"
            style={{
              color: c.mutedForeground,
              flex: 1,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
            }}
            numberOfLines={1}
          >
            Buff · {installName}
          </Text>
          <Text variant="caption" style={{ color: c.mutedForeground }}>
            {when ?? t('notif.pushNow')}
          </Text>
        </View>
        <Text variant="label" style={{ color: c.foreground, fontWeight: '600' }} numberOfLines={2}>
          {title}
        </Text>
        {body && (
          <Text variant="label" style={{ color: c.fg2 }} numberOfLines={3}>
            {body}
          </Text>
        )}
        {target && (
          <Text variant="caption" style={{ color: c.primary }} numberOfLines={1}>
            {t('notif.pushOpens', { target })}
          </Text>
        )}
      </View>
    </View>
  )
}

/** The lock-screen preview: the same push in the light and in the dark appearance. */
export function PushPreview(props: {
  installName: string
  title: string
  body?: string
  when?: string
  target?: string
}) {
  const theme = useTheme()
  return (
    <View style={{ flex: 1 }}>
      {(['light', 'dark'] as const).map((scheme) => (
        <View
          key={scheme}
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: theme.space(3),
            backgroundColor: scheme === 'dark' ? '#1b2033' : '#cfd8ea',
          }}
        >
          <PushNotificationMock scheme={scheme} {...props} />
        </View>
      ))}
    </View>
  )
}
