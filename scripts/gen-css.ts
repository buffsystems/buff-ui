// Regenerates the token stylesheets from src/tokens/tokens.ts (#561). Run via `make gen`.
import { writeFileSync } from 'node:fs'
import { tailwindThemeCss, tokens, tokensCss } from '../src/tokens/index.ts'

writeFileSync(new URL('../styles/tokens.css', import.meta.url), tokensCss(tokens))
writeFileSync(new URL('../styles/theme.css', import.meta.url), tailwindThemeCss(tokens))
