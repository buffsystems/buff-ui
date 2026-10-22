import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// A path, not a URL: under jsdom `URL` is the DOM's, which node:fs does not take.
const here = dirname(fileURLToPath(import.meta.url))

/** The declarations of the first rule in `styles/components/<file>` whose selector is exactly `selector`. */
export function cssRule(file: string, selector: string): string {
  const css = readFileSync(join(here, '../styles/components', file), 'utf8')
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`(?:^|[}\\s])${escaped}\\s*\\{([^}]*)\\}`).exec(css)
  if (!match) throw new Error(`no rule for ${selector} in ${file}`)
  return match[1]
}
