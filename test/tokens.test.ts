import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  avatarColors,
  cssVarName,
  tailwindThemeCss,
  tokens,
  tokensCss,
} from '../src/tokens/index.ts'
import type { ColorToken } from '../src/tokens/index.ts'

const committed = (file: string): string =>
  readFileSync(new URL(`../styles/${file}`, import.meta.url), 'utf8')

describe('tokens', () => {
  it('defines every colour in both themes', () => {
    expect(Object.keys(tokens.dark).sort()).toEqual(Object.keys(tokens.light).sort())
  })
})

describe('avatar palette', () => {
  const token = (color: string): ColorToken =>
    `avatar${color[0].toUpperCase()}${color.slice(1)}` as ColorToken

  it('has a light and a dark value for every avatar colour', () => {
    for (const color of avatarColors) {
      expect(tokens.light[token(color)]).toMatch(/^#[0-9a-f]{6}$/)
      expect(tokens.dark[token(color)]).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('reaches CSS as --avatar-<name>', () => {
    expect(tokensCss(tokens)).toContain('--avatar-purple: #8250df;')
  })
})

describe('cssVarName', () => {
  it('kebab-cases a camelCase token', () => {
    expect(cssVarName('mutedForeground')).toBe('muted-foreground')
    expect(cssVarName('destructiveSoftForeground')).toBe('destructive-soft-foreground')
  })

  it('separates a trailing step digit', () => {
    expect(cssVarName('fg2')).toBe('fg-2')
    expect(cssVarName('muted2')).toBe('muted-2')
  })
})

describe('tokensCss', () => {
  const css = tokensCss(tokens)

  it('puts light values on :root and dark values on .dark', () => {
    expect(css).toMatch(/:root \{[^}]*--primary: #2563eb;/)
    expect(css).toMatch(/\.dark \{[^}]*--primary: #5b8bff;/)
  })

  it('derives the radius scale from one base', () => {
    expect(css).toContain('--radius: 0.625rem;')
    expect(css).toContain('--radius-sm: calc(var(--radius) - 4px);')
    expect(css).toContain('--radius-xl: calc(var(--radius) + 4px);')
  })

  it('declares the font stacks', () => {
    expect(css).toMatch(/--font-sans: 'Geist', /)
    expect(css).toMatch(/--font-mono: 'Geist Mono', /)
  })

  it('is plain CSS a page without Tailwind can load', () => {
    expect(css).not.toContain('@theme')
  })

  it('matches the committed stylesheet (run `make gen` after editing tokens)', () => {
    expect(committed('tokens.css')).toBe(css)
  })
})

describe('tailwindThemeCss', () => {
  const css = tailwindThemeCss(tokens)

  it('maps every colour into the Tailwind theme', () => {
    expect(css).toContain('--color-primary: var(--primary);')
    expect(css).toContain('--color-fg-2: var(--fg-2);')
    expect(css).toContain('--color-syntax-keyword: var(--syntax-keyword);')
    expect(css.match(/--color-/g)).toHaveLength(Object.keys(tokens.light).length)
  })

  it('matches the committed stylesheet (run `make gen` after editing tokens)', () => {
    expect(committed('theme.css')).toBe(css)
  })
})
