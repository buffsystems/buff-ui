# @buff/ui

The single design system of the Buff interfaces (autonomous-dev/cloud-front#561): the app,
the admin, the deploy wizard, the Buff Code desktop and the connector.

## What is inside

- **Tokens** — `src/tokens/tokens.ts`: platform-neutral data (light + dark palette, radius,
  fonts). The web gets `styles/tokens.css` (plain custom properties) and `styles/theme.css`
  (Tailwind colour map) generated from it; a native client imports the object itself.
- **Composite classes** — `styles/components/*.css`: the whole look of every component as
  `ui-*` classes (BEM: `ui-btn ui-btn--ghost ui-btn--sm`, `ui-card__title`). Plain CSS in
  `@layer components`, so any page can use them and a utility class still wins for layout.
- **React components** — `src/react/*`: thin wrappers that put those classes on the right
  elements; behaviour (focus, keyboard, portals) comes from Radix.

## Using it

```jsonc
// package.json
"@buff/ui": "git+https://github.com/buffsystems/buff-ui.git#v0.1.2"
```

A Tailwind v4 app:

```css
@import 'tailwindcss';
@import '@buff/ui/tailwind.css';
```

```tsx
import { Button } from '@buff/ui/react'
```

A page without a build (plain HTML): load `styles/ui.css` and write the same classes.

The package ships TypeScript sources, not a build: the app's Vite compiles them as is.

## Rules

- Screens compose components; utilities only lay them out (`flex`, `gap-2`, `mt-4`). A
  repeated look is a component or a modifier here, never a long utility string in a screen.
- Colours, radii and fonts come from tokens only — no raw hex, no `blue-500`.

## Icons

Icons are [lucide-react](https://lucide.dev) — the apps' choice; the package draws its own glyphs
(chevrons, checks, the search mark) from it too. It ships no icon set and no `<Icon name>`
component: components take a `LucideIcon` (`leadingIcon`, `icon`) or any node, and screens import
the glyphs they need from `lucide-react`. Marks that are not glyphs — brand logos, file-type,
provider and editor-app icons — belong to the app that shows them.

## Changing tokens

Edit `src/tokens/tokens.ts`, then `make gen`. A test fails if the generated CSS is stale.

## Checks

`make ci` — typecheck, lint, tests.
