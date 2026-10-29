/** @jsxRuntime automatic */
import type { IconName } from './icons.ts'
import { useIcons, useTheme } from './theme.tsx'

/** An icon by name from the host's set; defaults to the body size and foreground colour. */
export function Icon({
  name,
  size = 20,
  color,
  strokeWidth = 1.75,
}: {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
}) {
  const icons = useIcons()
  const { colors } = useTheme()
  const Component = icons[name]
  return <Component size={size} color={color ?? colors.foreground} strokeWidth={strokeWidth} />
}
