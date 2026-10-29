/*
  The app's own settings (#629): the installs on this phone, appearance and language, about,
  the demo install. Importing this module registers the area's strings.
*/
import '../../strings/settings.ts'

export { InstallSettingsScreen, InstallsSettingsScreen, RemoveInstallSheet } from './installs.tsx'
export { AppSettingsScreen } from './app.tsx'
export type { ThemeChoice } from './app.tsx'
export { DemoInstallScreen } from './demo.tsx'
export type { DemoState } from './demo.tsx'
