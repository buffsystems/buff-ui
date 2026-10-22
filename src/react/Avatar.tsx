/** @jsxRuntime automatic */
import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { avatarColors } from '../tokens/tokens.ts'
import type { AvatarColor } from '../tokens/tokens.ts'
import { cx } from './cx.ts'

/** One of the fixed avatar/project colours as a CSS value that follows the theme. */
export function avatarColor(color: AvatarColor): string {
  return `var(--avatar-${color})`
}

// A name maps to a hue; gray is left for «no colour chosen».
const NAME_COLORS = avatarColors.filter((color) => color !== 'gray')

/** A stable avatar colour for a name: the same name, the same colour from the palette. */
export function nameColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return avatarColor(NAME_COLORS[h % NAME_COLORS.length])
}

export interface AvatarProps {
  src?: string
  alt?: string
  /** Who it is: gives the initial and a stable colour when those are not passed. */
  name?: string
  /** Shown while the image loads or when there is none; the first two letters are used. */
  initials?: string
  icon?: LucideIcon
  /** Edge length in px. */
  size?: number
  /** Rounded square for bots and organisations, a circle for people. */
  square?: boolean
  /** Background of the fallback — any CSS colour: `avatarColor('blue')`, a gradient. */
  color?: string
  className?: string
}

/** A picture of a person, bot or organisation, falling back to initials or an icon. */
export function Avatar({
  src,
  alt = '',
  name,
  initials,
  icon: Icon,
  size = 24,
  square = false,
  color,
  className,
}: AvatarProps) {
  const fill = color ?? (name ? nameColor(name) : undefined)
  const letters = initials ?? name?.trim().charAt(0)
  const style = {
    '--ui-avatar-size': `${size}px`,
    ...(fill ? { '--ui-avatar-color': fill } : {}),
  } as CSSProperties
  return (
    <AvatarPrimitive.Root
      style={style}
      className={cx(
        'ui-avatar',
        square && 'ui-avatar--square',
        !fill && 'ui-avatar--plain',
        className,
      )}
    >
      {src && <AvatarPrimitive.Image src={src} alt={alt} className="ui-avatar__image" />}
      <AvatarPrimitive.Fallback className="ui-avatar__fallback">
        {Icon ? <Icon aria-hidden /> : letters?.slice(0, 2) || '?'}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
