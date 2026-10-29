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
  // The `Mobile/*` stories (#629) read these: the phone size and the app language.
  globalTypes: {
    device: {
      description: 'Phone size of the Mobile stories',
      toolbar: {
        title: 'Device',
        icon: 'mobile',
        items: [
          { value: 'iphone', title: 'iPhone 390×844' },
          { value: 'android', title: 'Android 360×800' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Language of the Mobile stories',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: [
          { value: 'ru', title: 'Русский' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { device: 'iphone', locale: 'ru' },
  parameters: { layout: 'padded', a11y: { test: 'error' } },
}

export default preview
