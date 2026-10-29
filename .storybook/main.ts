// Storybook — the showcase of @buff/ui (#561). No Tailwind here on purpose: every story
// renders with the package's own CSS only, which proves the composite classes stand alone.
//
// The `Mobile/*` stories (#629) render the React Native screens of `@buff/ui/native` through
// react-native-web: `react-native` is aliased to it, `.web.tsx` wins over `.tsx` the way Metro
// resolves platform files, and the RN globals the modules expect are defined.
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-themes', '@storybook/addon-a11y'],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    define: { ...viteConfig.define, __DEV__: 'true', global: 'window' },
    resolve: {
      ...viteConfig.resolve,
      alias: { ...viteConfig.resolve?.alias, 'react-native': 'react-native-web' },
      extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.mjs', '.js', '.jsx', '.json'],
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include ?? []), 'react-native-web'],
    },
  }),
}

export default config
