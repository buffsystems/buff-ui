/** @jsxRuntime automatic */
import { Pressable, ScrollView, View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Terminal } from '../../Code.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { FileNode } from './model.ts'

/** The Files view: the project's tree as an indented list; a file opens in the viewer. */
export function FilesView({
  nodes,
  loading = false,
  onOpen,
}: {
  nodes: FileNode[]
  loading?: boolean
  onOpen?: (path: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  if (loading) return <EmptyState loading title={t('common.loading')} />
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: theme.space(2) }}>
      <Text
        variant="caption"
        tone="muted"
        style={{ paddingHorizontal: theme.space(4), paddingBottom: theme.space(2) }}
      >
        {t('buffcode.filesHint')}
      </Text>
      {nodes.map((node) => (
        <Pressable
          key={node.path}
          accessibilityRole="button"
          accessibilityLabel={node.path}
          onPress={() => onOpen?.(node.path)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.space(2),
            height: 44,
            paddingLeft: theme.space(4) + node.depth * theme.space(5),
            paddingRight: theme.space(4),
            backgroundColor: pressed ? c.muted : 'transparent',
          })}
        >
          <Icon
            name={node.kind === 'dir' ? 'folder' : 'file'}
            size={18}
            color={node.kind === 'dir' ? c.warning : c.mutedForeground}
          />
          <Text
            variant={node.kind === 'dir' ? 'label' : 'body'}
            numberOfLines={1}
            style={{ flex: 1 }}
          >
            {node.name}
          </Text>
          {node.kind === 'dir' && <Icon name="chevronRight" size={16} color={c.mutedForeground} />}
        </Pressable>
      ))}
    </ScrollView>
  )
}

/** The Terminal view: the output and a command row; the keyboard's return runs it. */
export function TerminalView({
  lines,
  command = '',
  running = false,
  disabled = false,
  onCommand,
  onRun,
  onInterrupt,
}: {
  lines: string[]
  command?: string
  running?: boolean
  disabled?: boolean
  onCommand?: (text: string) => void
  onRun?: () => void
  onInterrupt?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ padding: theme.space(3), gap: theme.space(2) }}>
      <Terminal lines={lines} cursor={!running} />
      <View style={{ flexDirection: 'row', gap: theme.space(2), alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Input
            icon="terminal"
            placeholder={t('buffcode.terminalPlaceholder')}
            value={command}
            onChangeText={onCommand}
            editable={!disabled}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ fontFamily: theme.font.mono }}
            onSubmitEditing={onRun}
          />
        </View>
        {running ? (
          <Button variant="danger" leadingIcon="square" onPress={onInterrupt} disabled={disabled}>
            {t('buffcode.stop')}
          </Button>
        ) : (
          <Button
            variant="primary"
            leadingIcon="play"
            onPress={onRun}
            disabled={disabled || !command.trim()}
          >
            {t('buffcode.run')}
          </Button>
        )}
      </View>
    </View>
  )
}

export { FileViewer } from './file-viewer.tsx'
