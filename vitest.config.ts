// The native components (#629) import `react-native`; under test they render through
// react-native-web into jsdom, exactly as the Storybook does.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: { __DEV__: 'true' },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.mjs', '.js', '.jsx', '.json'],
  },
})
