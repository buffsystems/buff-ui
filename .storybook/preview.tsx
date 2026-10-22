import type { Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import '../styles/ui.css'
import '../stories/stories.css'

const preview: Preview = {
  // The toolbar flips <html class="dark"> — the same switch the apps use.
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
  ],
  parameters: { layout: 'padded', a11y: { test: 'error' } },
}

export default preview
