/** @jsxRuntime automatic */
import { View } from 'react-native'
import { avatarColors, type AvatarColor, type ColorToken } from '../tokens/tokens.ts'
import { Icon } from './Icon.tsx'
import type { IconName } from './icons.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** The colour a name always gets, so one person looks the same on every screen. */
export function avatarColorFor(name: string): AvatarColor {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** A person's initials, or an icon for a machine / an install. */
export function Avatar({
  name,
  icon,
  size = 36,
}: {
  name: string
  icon?: IconName
  size?: number
}) {
  const theme = useTheme()
  const color = avatarColorFor(name)
  const token = `avatar${color[0].toUpperCase()}${color.slice(1)}` as ColorToken
  const bg = theme.colors[token]
  return (
    <View
      accessibilityLabel={name}
      style={{
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon ? (
        <Icon name={icon} size={size * 0.5} color="#ffffff" />
      ) : (
        <Text
          variant="label"
          style={{
            color: '#ffffff',
            fontSize: size * 0.38,
            lineHeight: size * 0.5,
            fontWeight: '600',
          }}
        >
          {initials(name)}
        </Text>
      )}
    </View>
  )
}
