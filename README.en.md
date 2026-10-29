<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img src="assets/logo.svg" alt="Buff Development" width="420">
  </picture>
</p>

<p align="center">
  <b>@buff/ui — the design system of the Buff interfaces.</b><br>
  One look for the app, the admin, the deploy wizard, the Buff Code desktop and the connector.
</p>

<p align="center">
  <a href="https://github.com/buffsystems/buff-ui/tags"><img alt="Version" src="https://img.shields.io/github/v/tag/buffsystems/buff-ui?label=version&color=2563eb"></a>
  <a href="LICENSE"><img alt="Licence" src="https://img.shields.io/badge/licence-MIT-64748b"></a>
  <a href="https://buff.systems/en"><img alt="Buff" src="https://img.shields.io/badge/buff.systems-0b0d12"></a>
</p>

<p align="center">
  <a href="#what-is-inside">What is inside</a> ·
  <a href="#using-it">Using it</a> ·
  <a href="#rules">Rules</a> ·
  <a href="README.md">Русский</a>
</p>

---

## What is inside

- **Tokens** — `src/tokens/tokens.ts`: platform-neutral data (light + dark palette, radius,
  fonts). The web gets `styles/tokens.css` (plain custom properties) and `styles/theme.css`
  (Tailwind colour map) generated from it; a native client imports the object itself.
- **Composite classes** — `styles/components/*.css`: the whole look of every component as
  `ui-*` classes (BEM: `ui-btn ui-btn--ghost ui-btn--sm`, `ui-card__title`). Plain CSS in
  `@layer components`, so any page can use them and a utility class still wins for layout.
- **React components** — `src/react/*`: thin wrappers that put those classes on the right
- **Native layer** — `src/native/*` (`@buff/ui/native`, #629): the same tokens for React Native — the theme, primitives and presentational screens of the Buff mobile app (pairing, Home, cabinet sections, Buff Code, notifications, settings). The app injects the icons (`<NativeProvider icons=…>`: `lucide-react-native`), so the package carries no native dependency. Storybook renders the screens through `react-native-web` in a phone frame (the `Mobile` section, device and language toolbar switches).
  elements; behaviour (focus, keyboard, portals) comes from Radix.

## Using it

```jsonc
// package.json
"@buff/ui": "git+https://github.com/buffsystems/buff-ui.git#v0.1.4"
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

## Contributing and licence

Issues and pull requests are welcome — see [CONTRIBUTING.en.md](CONTRIBUTING.en.md) (including work with AI assistants). The repository is published as one snapshot per release: accepted changes ship in the next one. Licence — [MIT](LICENSE).
