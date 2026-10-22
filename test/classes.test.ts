import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Every ui-* class a React component puts on an element must be defined in the CSS — the
// guard against a renamed or forgotten composite class (#561).

const dir = (path: string): URL => new URL(path, import.meta.url)
const read = (url: URL): string => readFileSync(url, 'utf8')

const css = readdirSync(dir('../styles/components/'))
  .map((file) => read(dir(`../styles/components/${file}`)))
  .concat(read(dir('../styles/base.css')))
  .join('\n')
const defined = new Set([...css.matchAll(/\.(ui-[a-z0-9_-]+)/g)].map((m) => m[1]))

const sources = readdirSync(dir('../src/react/')).filter((file) => file.endsWith('.tsx'))
const used = new Set(
  sources.flatMap((file) =>
    [...read(dir(`../src/react/${file}`)).matchAll(/(?<![\w-])(ui-[a-z0-9_-]+)/g)].map((m) => m[1]),
  ),
)

// Classes built from a prop (`ui-btn--${variant}`): every value the prop type allows.
const variants: Record<string, string[]> = {
  'ui-btn--': [
    'primary',
    'outline',
    'secondary',
    'ghost',
    'destructive',
    'link',
    'xs',
    'sm',
    'md',
    'lg',
    'inline',
  ],
  'ui-badge--': ['neutral', 'info', 'ok', 'warn', 'crit', 'primary', 'outline'],
  'ui-dot--': ['neutral', 'info', 'ok', 'warn', 'crit'],
  'ui-segmented--': ['3', '4'],
  'ui-dialog--': ['sm', 'md', 'lg', 'xl'],
  'ui-drawer--': ['bottom', 'left', 'right', 'sm', 'md', 'lg'],
  'ui-tabs--': ['underline', 'pill'],
  'ui-tabs-frame__more--': ['start', 'end'],
  'ui-toast--': ['success', 'error'],
  'ui-stat-grid--': ['3', '4'],
  'ui-stat__value--': ['ok', 'warn', 'crit'],
  'ui-callout--': ['neutral', 'info', 'ok', 'warn', 'crit'],
  'ui-count--': ['primary', 'warn'],
  'ui-panel--': ['info'],
  'ui-icon-tile--': ['info', 'ok', 'warn', 'crit', 'sm', 'lg', 'xl'],
  'ui-progress-ring--': ['ok', 'warn', 'crit'],
}

describe('composite classes', () => {
  it('defines every literal class the components use', () => {
    const literal = [...used].filter((name) => !name.endsWith('-') && !name.endsWith('_'))
    expect(literal.filter((name) => !defined.has(name))).toEqual([])
  })

  it('defines every class a variant prop can produce', () => {
    const prefixes = [...used].filter((name) => name.endsWith('--'))
    expect(prefixes.filter((prefix) => !variants[prefix])).toEqual([])
    const missing = Object.entries(variants).flatMap(([prefix, values]) =>
      values.map((value) => prefix + value).filter((name) => !defined.has(name)),
    )
    expect(missing).toEqual([])
  })
})

// The package ships source: an app's test runner may compile it without the React plugin, and
// esbuild's default is the classic runtime («React is not defined»). The pragma pins it.
describe('component sources', () => {
  it('every .tsx pins the automatic JSX runtime', () => {
    const unpinned = sources.filter(
      (file) => !read(dir(`../src/react/${file}`)).startsWith('/** @jsxRuntime automatic */'),
    )
    expect(unpinned).toEqual([])
  })
})
