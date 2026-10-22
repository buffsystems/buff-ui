import type { ColorToken, Font, Palette, Tokens } from './tokens.ts'

const generated = (what: string): string => `/*
  GENERATED from src/tokens/tokens.ts by \`make gen\` — do not edit by hand (#561).
  ${what}
*/
`

/** `mutedForeground` → `muted-foreground`, `fg2` → `fg-2`. */
export function cssVarName(token: string): string {
  return token.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()
}

function block(selector: string, lines: string[]): string {
  return `${selector} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}\n`
}

function paletteLines(palette: Palette): string[] {
  return Object.entries(palette).map(([token, value]) => `--${cssVarName(token)}: ${value};`)
}

function fontStack(font: Font): string {
  return `'${font.family}', ${font.fallback}`
}

/**
 * The tokens as plain custom properties — light on :root, dark on .dark. Framework-free, so a
 * page without Tailwind (the connector) uses the very same file.
 */
export function tokensCss(t: Tokens): string {
  return [
    generated('Plain custom properties: light on :root, dark on .dark (<html class="dark">).'),
    block(':root', [
      `--font-sans: ${fontStack(t.fonts.sans)};`,
      `--font-mono: ${fontStack(t.fonts.mono)};`,
      `--radius: ${t.radius};`,
      '--radius-sm: calc(var(--radius) - 4px);',
      '--radius-md: calc(var(--radius) - 2px);',
      '--radius-lg: var(--radius);',
      '--radius-xl: calc(var(--radius) + 4px);',
      ...paletteLines(t.light),
    ]),
    block('.dark', paletteLines(t.dark)),
  ].join('\n')
}

/**
 * The colours exposed to Tailwind v4 (`bg-primary`, `text-fg-2`, …). Fonts and radii need no
 * mapping: Tailwind's utilities read `--font-*` / `--radius-*`, which tokens.css overrides.
 */
export function tailwindThemeCss(t: Tokens): string {
  const colors = (Object.keys(t.light) as ColorToken[]).map((token) => {
    const name = cssVarName(token)
    return `--color-${name}: var(--${name});`
  })
  return [
    generated('Tailwind v4 colour utilities over the tokens in tokens.css.'),
    block('@theme inline', colors),
  ].join('\n')
}
