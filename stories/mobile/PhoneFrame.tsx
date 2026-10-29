// The phone frame every `Mobile/*` story renders in (#629): a device-sized viewport with the
// status bar and the home indicator, the native theme following the Storybook theme toolbar,
// and the locale / device size from the story toolbar globals.
import type { Decorator } from '@storybook/react-vite'
import { useEffect, useState, type ReactNode } from 'react'
import { View } from 'react-native'
import { NativeProvider, Text, useTheme, type Locale, type Scheme } from '../../src/native/index.ts'
import { storyIcons } from './icons.ts'

export const DEVICES = {
  iphone: { width: 390, height: 844, label: 'iPhone 390×844' },
  android: { width: 360, height: 800, label: 'Android 360×800' },
} as const

export type Device = keyof typeof DEVICES

function useHtmlScheme(): Scheme {
  const read = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  const [scheme, setScheme] = useState<Scheme>(read)
  useEffect(() => {
    const observer = new MutationObserver(() => setScheme(read()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return scheme
}

function StatusBar() {
  const theme = useTheme()
  return (
    <View
      style={{
        height: 44,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 8,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="label" style={{ fontWeight: '600' }}>
        9:41
      </Text>
      <Text variant="caption">●●●● 5G ▮</Text>
    </View>
  )
}

function HomeIndicator() {
  const theme = useTheme()
  return (
    <View
      style={{
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          width: 134,
          height: 5,
          borderRadius: 5,
          backgroundColor: theme.colors.foreground,
          opacity: 0.6,
        }}
      />
    </View>
  )
}

export function PhoneFrame({
  device,
  locale,
  children,
}: {
  device: Device
  locale: Locale
  children: ReactNode
}) {
  const scheme = useHtmlScheme()
  const { width, height } = DEVICES[device]
  return (
    <NativeProvider scheme={scheme} locale={locale} icons={storyIcons}>
      <View
        style={{
          width,
          height,
          borderRadius: 44,
          borderWidth: 8,
          borderColor: '#111318',
          backgroundColor: '#111318',
          overflow: 'hidden',
        }}
      >
        <StatusBar />
        <View style={{ flex: 1 }}>{children}</View>
        <HomeIndicator />
      </View>
    </NativeProvider>
  )
}

/** The decorator: reads `device` and `locale` from the toolbar globals (see preview.tsx). */
export const withPhone: Decorator = (Story, context) => (
  <PhoneFrame
    device={(context.globals.device as Device) ?? 'iphone'}
    locale={(context.globals.locale as Locale) ?? 'ru'}
  >
    <Story />
  </PhoneFrame>
)
