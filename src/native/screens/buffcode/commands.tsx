/** @jsxRuntime automatic */
import { Pressable, View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { SlashCommand } from './model.ts'

const SOURCE_KEY: Record<SlashCommand['source'], string> = {
  builtin: 'buffcode.srcBuiltin',
  project: 'buffcode.srcProject',
  skill: 'buffcode.srcSkill',
  agent: 'buffcode.srcAgent',
}
const SOURCE_ICON: Record<SlashCommand['source'], IconName> = {
  builtin: 'zap',
  project: 'folderGit',
  skill: 'sparkles',
  agent: 'bot',
}

/** The commands matching what was typed after `/`: name, source, description. */
export function filterCommands(commands: SlashCommand[], query: string): SlashCommand[] {
  const q = query.replace(/^\//, '').toLowerCase()
  return commands.filter(
    (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
  )
}

/**
 * The `/` autocomplete over the composer: built-in commands, the project's own, skills and
 * agents, filtered by the query. Presentational: the screen passes the query it has.
 */
export function SlashSuggestions({
  commands,
  query,
  onPick,
}: {
  commands: SlashCommand[]
  query: string
  onPick?: (name: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const items = filterCommands(commands, query).slice(0, 6)
  return (
    <View
      accessibilityRole="menu"
      style={{
        marginHorizontal: theme.space(3),
        marginBottom: theme.space(1),
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: c.borderStrong,
        backgroundColor: c.popover,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: theme.space(3),
          paddingTop: theme.space(2),
        }}
      >
        <Icon name="sparkles" size={14} color={c.mutedForeground} />
        <Text variant="caption" tone="muted">
          {t('buffcode.commands')} · {query || '/'}
        </Text>
      </View>
      {items.length === 0 ? (
        <Text variant="label" tone="muted" style={{ padding: theme.space(3) }}>
          {t('buffcode.noMatching')}
        </Text>
      ) : (
        items.map((cmd) => (
          <Pressable
            key={`${cmd.source}:${cmd.name}`}
            accessibilityRole="menuitem"
            accessibilityLabel={`/${cmd.name}`}
            onPress={() => onPick?.(cmd.name)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.space(3),
              minHeight: 44,
              paddingHorizontal: theme.space(3),
              backgroundColor: pressed ? c.muted : 'transparent',
            })}
          >
            <Icon name={SOURCE_ICON[cmd.source]} size={16} color={c.mutedForeground} />
            <View style={{ flex: 1 }}>
              <Text variant="label">/{cmd.name}</Text>
              <Text variant="caption" tone="muted" numberOfLines={1}>
                {cmd.description}
              </Text>
            </View>
            <Badge tone={cmd.source === 'builtin' ? 'neutral' : 'info'}>
              {t(SOURCE_KEY[cmd.source])}
            </Badge>
          </Pressable>
        ))
      )}
    </View>
  )
}

export type PaletteAction =
  'new' | 'compact' | 'undo' | 'redo' | 'rename' | 'share' | 'agent' | 'mode' | 'export'

const ACTIONS: { id: PaletteAction; icon: IconName; key: string }[] = [
  { id: 'new', icon: 'plus', key: 'buffcode.newSession' },
  { id: 'compact', icon: 'archive', key: 'buffcode.actCompact' },
  { id: 'undo', icon: 'undo', key: 'buffcode.actUndo' },
  { id: 'redo', icon: 'redo', key: 'buffcode.actRedo' },
  { id: 'rename', icon: 'pencil', key: 'common.rename' },
  { id: 'share', icon: 'share', key: 'common.share' },
  { id: 'agent', icon: 'bot', key: 'buffcode.actAgent' },
  { id: 'mode', icon: 'shieldCheck', key: 'buffcode.permissionMode' },
  { id: 'export', icon: 'download', key: 'buffcode.actExport' },
]

/** The action palette of a session — the window's command palette, as a sheet of rows. */
export function ActionPaletteSheet({
  disabled = [],
  onAction,
  onClose,
}: {
  disabled?: PaletteAction[]
  onAction?: (action: PaletteAction) => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('buffcode.actions')} onClose={onClose}>
      <RowGroup>
        {ACTIONS.map((action) => (
          <Row
            key={action.id}
            icon={action.icon}
            title={t(action.key)}
            disabled={disabled.includes(action.id)}
            onPress={() => onAction?.(action.id)}
          />
        ))}
      </RowGroup>
    </Sheet>
  )
}
