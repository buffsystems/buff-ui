/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { View } from 'react-native'
import type { IconName } from '../../icons.ts'
import type { Install, InstallStatus } from '../../model.ts'
import { IconButton } from '../../Button.tsx'
import { Screen, TopBar } from '../../Screen.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme, type NativeTheme } from '../../theme.tsx'
import { InstallBanner } from '../status.tsx'
import type { SessionOrigin } from './model.ts'

export type Translate = (key: string, vars?: Record<string, string | number>) => string

/** Every action of a machine section is live only while the service answers. */
export function isLive(status: InstallStatus): boolean {
  return status.kind === 'online'
}

export const ORIGIN_ICON: Record<SessionOrigin, IconName> = {
  window: 'appWindow',
  console: 'terminal',
  phone: 'smartphone',
}

export function originLabel(t: Translate, origin: SessionOrigin): string {
  return t(
    origin === 'window'
      ? 'buffcode.originWindow'
      : origin === 'console'
        ? 'buffcode.originConsole'
        : 'buffcode.originPhone',
  )
}

/**
 * The frame of every Buff Code machine screen: the top bar (the install switcher, or back
 * inside a section), the status banner, then the body. `scroll={false}` for screens that own
 * their scrolling (a timeline, a terminal).
 */
export function MachineShell({
  install,
  status,
  title,
  subtitle,
  onBack,
  onMenu,
  onRepair,
  actions,
  footer,
  scroll = true,
  padded = false,
  children,
}: {
  install: Install
  status: InstallStatus
  title: string
  subtitle?: string
  onBack?: () => void
  /** Opens the navigation drawer (the hamburger); shown when there is no back. */
  onMenu?: () => void
  onRepair?: () => void
  actions?: ReactNode
  footer?: ReactNode
  scroll?: boolean
  padded?: boolean
  children: ReactNode
}) {
  const t = useT()
  return (
    <>
      <TopBar
        title={title}
        subtitle={subtitle ?? install.name}
        onBack={onBack}
        leading={
          onBack ? undefined : <IconButton icon="menu" label={t('sidebar.open')} onPress={onMenu} />
        }
        actions={actions}
      />
      <Screen scroll={scroll} footer={footer} padded={padded}>
        <InstallBanner status={status} onRepair={onRepair} />
        {children}
      </Screen>
    </>
  )
}

/** A section of a scrolling screen with the standard side gutter. */
export function Gutter({ children, gap }: { children: ReactNode; gap?: number }) {
  const theme = useTheme()
  return (
    <View style={{ paddingHorizontal: theme.space(4), gap: gap ?? theme.space(3) }}>
      {children}
    </View>
  )
}

/** A small uppercase caption over a block. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <Text variant="caption" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {children}
    </Text>
  )
}

/** The grey placeholder rows of a loading list. */
export function skeletonRows(theme: NativeTheme, count: number): ReactNode {
  return (
    <View style={{ gap: theme.space(3), paddingHorizontal: theme.space(4) }}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            height: 64,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.muted2,
            opacity: 1 - i * 0.15,
          }}
        />
      ))}
    </View>
  )
}
