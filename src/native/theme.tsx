/** @jsxRuntime automatic */
/*
  The native theme (#629): the same tokens the web paints with, shaped for React Native —
  numbers instead of CSS lengths, one font family name per face, and a 4px spacing grid.
  `NativeProvider` is the single context of `@buff/ui/native`: scheme, icons, locale.
*/
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { Platform, type ViewStyle } from 'react-native'
import { tokens, type Palette } from '../tokens/tokens.ts'
import type { IconSet } from './icons.ts'
import { type Locale, type Translate, makeTranslate } from './i18n.ts'

export type Scheme = 'light' | 'dark'

export interface TextStyleSpec {
  fontSize: number
  lineHeight: number
  fontWeight: '400' | '500' | '600' | '700'
}

export interface NativeTheme {
  scheme: Scheme
  colors: Palette
  /** Corner radii: the base is the web `radius` token (10px), the steps derive from it. */
  radius: { sm: number; md: number; lg: number; full: number }
  /** The spacing grid: `space(2)` = 8. */
  space: (steps: number) => number
  font: { sans: string; mono: string }
  text: {
    title: TextStyleSpec
    heading: TextStyleSpec
    body: TextStyleSpec
    label: TextStyleSpec
    caption: TextStyleSpec
    mono: TextStyleSpec
  }
  /** The touch target floor: every tappable control is at least this tall. */
  touch: number
  /** A card's lift off the screen: a soft shadow in light, none in dark (its tone does it). */
  raised: ViewStyle
}

const BASE_RADIUS = 10

/**
  The phone layers by tone, not by outline (#692): a grey screen with white cards in light, a
  near-black screen with lifted cards in dark. A sheet is
  a screen of its own: cards sit on it the same way. A 1.2:1 hairline round every card read as a
  wireframe. The field edge is stronger so an input is found at a glance.
*/
const SURFACES: Record<Scheme, Partial<Palette>> = {
  light: { background: '#f4f5f8', card: '#ffffff', popover: '#f4f5f8', borderStrong: '#c4c9d4' },
  dark: { background: '#0b0d12', card: '#1b202b', popover: '#13171f', borderStrong: '#3a4052' },
}

const RAISED: Record<Scheme, ViewStyle> = {
  light: { boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.05)' },
  dark: {},
}

export type FontWeight = TextStyleSpec['fontWeight']

/**
  The names a native client registers each face under, one per weight (#692): a custom font on
  iOS/Android is one file per weight, and `fontWeight` alone falls back to the 400 file — the
  app had no hierarchy. The 400 names are the tokens' families, so `theme.font` stays valid.
*/
export const NATIVE_FACES: Record<'sans' | 'mono', Record<FontWeight, string>> = {
  sans: { '400': 'Geist', '500': 'Geist-Medium', '600': 'Geist-SemiBold', '700': 'Geist-Bold' },
  mono: {
    '400': 'Geist Mono',
    '500': 'GeistMono-Medium',
    '600': 'GeistMono-SemiBold',
    '700': 'GeistMono-Bold',
  },
}

/** Any style weight onto the four the faces have: 'bold' is 700, lighter is 400, heavier 700. */
export function faceWeight(weight: string | number | undefined): FontWeight {
  if (weight === 'bold') return '700'
  const n = Number(weight)
  if (!Number.isFinite(n) || n < 500) return '400'
  if (n < 600) return '500'
  return n < 700 ? '600' : '700'
}

function fontFamily(face: { family: string; fallback: string }): string {
  // The web keeps a fallback stack while the brand face loads; a native client registers
  // the face under its single name.
  return Platform.OS === 'web' ? `${face.family}, ${face.fallback}` : face.family
}

export function makeTheme(scheme: Scheme): NativeTheme {
  return {
    scheme,
    colors: { ...(scheme === 'dark' ? tokens.dark : tokens.light), ...SURFACES[scheme] },
    radius: { sm: BASE_RADIUS - 4, md: BASE_RADIUS, lg: BASE_RADIUS + 6, full: 999 },
    space: (steps) => steps * 4,
    font: { sans: fontFamily(tokens.fonts.sans), mono: fontFamily(tokens.fonts.mono) },
    text: {
      title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
      heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
      body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
      label: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
      caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
      mono: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    },
    touch: 44,
    raised: RAISED[scheme],
  }
}

interface NativeContextValue {
  theme: NativeTheme
  icons: IconSet
  locale: Locale
  t: Translate
}

const NativeContext = createContext<NativeContextValue | null>(null)

export interface NativeProviderProps {
  scheme?: Scheme
  /** The icon implementation: lucide-react on the web showcase, lucide-react-native in the app. */
  icons: IconSet
  locale?: Locale
  children: ReactNode
}

/** Wrap the app (or a story) once; every `@buff/ui/native` component reads from it. */
export function NativeProvider({
  scheme = 'light',
  icons,
  locale = 'ru',
  children,
}: NativeProviderProps) {
  const value = useMemo<NativeContextValue>(
    () => ({ theme: makeTheme(scheme), icons, locale, t: makeTranslate(locale) }),
    [scheme, icons, locale],
  )
  return <NativeContext.Provider value={value}>{children}</NativeContext.Provider>
}

function useNative(): NativeContextValue {
  const value = useContext(NativeContext)
  if (!value) throw new Error('@buff/ui/native: wrap the tree in <NativeProvider>')
  return value
}

export function useTheme(): NativeTheme {
  return useNative().theme
}

export function useIcons(): IconSet {
  return useNative().icons
}

export function useLocale(): Locale {
  return useNative().locale
}

/** The translator of the provider's locale: `t('home.title')`. */
export function useT(): Translate {
  return useNative().t
}
