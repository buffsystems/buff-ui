/*
  The design tokens — the single source of the Buff look (#561). Platform-neutral plain data:
  the web gets CSS custom properties generated from it (`styles/tokens.css`), a native client
  imports the same object. Values come from the cabinet palette (#270).
*/

const light = {
  background: '#ffffff',
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  popover: '#ffffff',
  popoverForeground: '#0f172a',
  primary: '#2563eb',
  primaryForeground: '#f8fafc',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  // Selected/active: a clearly visible light blue, so selection doesn't blend into a white sidebar.
  accent: '#dbeafe',
  accentForeground: '#1d4ed8',
  destructive: '#d3273e',
  destructiveForeground: '#f8fafc',
  success: '#0b7f55',
  warning: '#a15f00',
  // Text on a solid warning fill: the fill is dark here and light in the dark theme.
  warningForeground: '#ffffff',
  border: '#e8e9ee',
  input: '#e8e9ee',
  ring: '#2563eb',

  // A foreground step between `foreground` and `mutedForeground`: secondary but legible copy.
  fg2: '#3f4350',
  // A neutral surface above `muted`: pressed chips, segmented controls.
  muted2: '#eceef2',
  // A border that reads as an edge, not a hairline: inputs, outline buttons.
  borderStrong: '#d0d3dc',
  // Status "soft" pairs: a tinted background plus text that passes 4.5:1 on it.
  brandSoft: '#e8efff',
  brandSoftForeground: '#1e40af',
  successSoft: '#e3f7ee',
  successSoftForeground: '#0b6b49',
  warningSoft: '#fff3dc',
  warningSoftForeground: '#8a4b00',
  destructiveSoft: '#ffe6ea',
  destructiveSoftForeground: '#9b1c2e',
  // Chart bars: dimmer than `primary` so a row of bars does not shout, still ≥3:1 on a card.
  bar: '#5f86e8',

  // Code: GitHub prettylights syntax colours, inline/block code surfaces, diff tints.
  syntaxComment: '#59636e',
  syntaxString: '#0a3069',
  syntaxKeyword: '#cf222e',
  syntaxNumber: '#0550ae',
  syntaxFunc: '#8250df',
  syntaxVar: '#953800',
  codeBg: '#eef1f6',
  codeBorder: '#d9dde6',
  codeFg: '#9a3412',
  codeBlockBg: '#f6f8fa',
  diffAddBg: '#dafbe1',
  diffDelBg: '#ffebe9',

  // A console (a run's log, a terminal): dark in both themes, ANSI colours on it.
  terminalBg: '#0d1117',
  terminalFg: '#c9d1d9',
  terminalBorder: '#30363d',
  ansiBlack: '#6e7681',
  ansiRed: '#ff7b72',
  ansiGreen: '#3fb950',
  ansiYellow: '#d29922',
  ansiBlue: '#58a6ff',
  ansiMagenta: '#bc8cff',
  ansiCyan: '#39c5cf',
  ansiWhite: '#f0f6fc',
  ansiGray: '#8b949e',

  // Avatar and project colours (`avatarColors`): a fill under white initials, ≥3:1 in both themes.
  avatarOrange: '#e2620e',
  avatarYellow: '#b98100',
  avatarCyan: '#0e8fa3',
  avatarGreen: '#16924a',
  avatarRed: '#dc3434',
  avatarPink: '#d6407f',
  avatarBlue: '#2f6fe0',
  avatarPurple: '#8250df',
  avatarGray: '#6b7280',
}

export type ColorToken = keyof typeof light

/**
 * The fixed set of avatar and project colours, in picker order. Each is the palette token
 * `avatar<Name>` (CSS `--avatar-<name>`); a project stores the name, never the value.
 */
export const avatarColors = [
  'orange',
  'yellow',
  'cyan',
  'green',
  'red',
  'pink',
  'blue',
  'purple',
  'gray',
] as const
export type AvatarColor = (typeof avatarColors)[number]
export type Palette = Record<ColorToken, string>

// GitHub Primer-like dark: soft blue-gray, not harsh black.
const dark: Palette = {
  background: '#0b0d12',
  foreground: '#edeef2',
  card: '#10131a',
  cardForeground: '#edeef2',
  popover: '#10131a',
  popoverForeground: '#edeef2',
  // Light-on-dark accent: dark text sits on it, so it never glares.
  primary: '#5b8bff',
  primaryForeground: '#06070a',
  secondary: '#1a1e27',
  secondaryForeground: '#edeef2',
  muted: '#12151c',
  mutedForeground: '#9aa0ad',
  accent: '#16223f',
  accentForeground: '#a9c1ff',
  destructive: '#f87171',
  destructiveForeground: '#06070a',
  success: '#34d399',
  warning: '#fbbf24',
  warningForeground: '#1a1200',
  border: '#222633',
  input: '#222633',
  ring: '#7aa1ff',

  fg2: '#c3c7d1',
  muted2: '#1a1e27',
  borderStrong: '#323747',
  brandSoft: '#16223f',
  brandSoftForeground: '#a9c1ff',
  successSoft: '#0f2a20',
  successSoftForeground: '#7fe3bb',
  warningSoft: '#2e2208',
  warningSoftForeground: '#fcd67a',
  destructiveSoft: '#3a1519',
  destructiveSoftForeground: '#ffb3b3',
  bar: '#4f6fc0',

  syntaxComment: '#8b949e',
  syntaxString: '#a5d6ff',
  syntaxKeyword: '#ff7b72',
  syntaxNumber: '#79c0ff',
  syntaxFunc: '#d2a8ff',
  syntaxVar: '#ffa657',
  codeBg: '#1a1e27',
  codeBorder: '#323747',
  codeFg: '#ffb380',
  codeBlockBg: '#0d1117',
  diffAddBg: '#2ea04326',
  diffDelBg: '#f8514926',

  terminalBg: '#0d1117',
  terminalFg: '#c9d1d9',
  terminalBorder: '#30363d',
  ansiBlack: '#6e7681',
  ansiRed: '#ff7b72',
  ansiGreen: '#3fb950',
  ansiYellow: '#d29922',
  ansiBlue: '#58a6ff',
  ansiMagenta: '#bc8cff',
  ansiCyan: '#39c5cf',
  ansiWhite: '#f0f6fc',
  ansiGray: '#8b949e',

  avatarOrange: '#d9691f',
  avatarYellow: '#b58a12',
  avatarCyan: '#1a93a6',
  avatarGreen: '#24955a',
  avatarRed: '#d94848',
  avatarPink: '#cf4f8a',
  avatarBlue: '#4479e0',
  avatarPurple: '#8a63d8',
  avatarGray: '#717886',
}

export type Font = {
  /** The brand face, as a native client names it. */
  family: string
  /** The web fallback stack, used while the brand face loads or where it is missing. */
  fallback: string
}

export type Tokens = {
  light: Palette
  dark: Palette
  /** The base corner radius; the smaller and larger steps derive from it. */
  radius: string
  fonts: { sans: Font; mono: Font }
}

export const tokens: Tokens = {
  light,
  dark,
  radius: '0.625rem',
  fonts: {
    sans: {
      family: 'Geist',
      fallback:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    },
    mono: {
      family: 'Geist Mono',
      fallback:
        "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    },
  },
}
