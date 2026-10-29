/*
  Icons by injection (#629): the package names the icons it uses, the host supplies the
  implementation — `lucide-react` in the Storybook showcase, `lucide-react-native` in the app.
  Both ship components with the same `size` / `color` / `strokeWidth` props, so the package
  carries neither dependency.
*/
import type { ComponentType } from 'react'

export interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
}

export type IconComponent = ComponentType<IconProps>

/** Every icon a native screen may ask for — the host's set must cover all of them. */
export const ICON_NAMES = [
  'alertTriangle',
  'appWindow',
  'archive',
  'arrowDown',
  'arrowLeft',
  'ban',
  'bell',
  'bellOff',
  'bookOpen',
  'bot',
  'brain',
  'calendar',
  'camera',
  'check',
  'checkCircle',
  'chevronDown',
  'chevronRight',
  'circleHelp',
  'clock',
  'copy',
  'cpu',
  'download',
  'ellipsis',
  'externalLink',
  'eye',
  'file',
  'fileText',
  'filter',
  'folder',
  'folderGit',
  'folderOpen',
  'gitBranch',
  'gitCommit',
  'gitPullRequest',
  'globe',
  'history',
  'image',
  'inbox',
  'info',
  'keyRound',
  'languages',
  'link',
  'listChecks',
  'lock',
  'menu',
  'messageSquare',
  'microscope',
  'moon',
  'paperclip',
  'pause',
  'pencil',
  'play',
  'plug',
  'plus',
  'qrCode',
  'redo',
  'refreshCw',
  'scale',
  'search',
  'send',
  'server',
  'settings',
  'share',
  'shieldCheck',
  'smartphone',
  'sparkles',
  'square',
  'sun',
  'terminal',
  'trash',
  'undo',
  'unplug',
  'upload',
  'user',
  'wifiOff',
  'workflow',
  'wrench',
  'x',
  'zap',
] as const

export type IconName = (typeof ICON_NAMES)[number]
export type IconSet = Record<IconName, IconComponent>
