// Storybook — the showcase of @buff/ui (#561). No Tailwind here on purpose: every story
// renders with the package's own CSS only, which proves the composite classes stand alone.
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-themes', '@storybook/addon-a11y'],
}

export default config
