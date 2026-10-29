/** @jsxRuntime automatic */
import type { ReactNode } from 'react'
import { Image, Pressable, ScrollView, View } from 'react-native'
import { Button, IconButton } from '../../Button.tsx'
import { HighlightedCode, Terminal } from '../../Code.tsx'
import { EmptyState, Spinner } from '../../Feedback.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { sizeLabel } from './composer-parts.tsx'
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

/** What a document is, for its card: PDF, Word, Excel, PowerPoint or just a file. */
function documentKind(mime: string): string {
  if (mime.includes('pdf')) return 'PDF'
  if (/wordprocessing|msword|opendocument\.text|rtf/.test(mime)) return 'Word'
  if (/spreadsheet|ms-excel/.test(mime)) return 'Excel'
  if (/presentation|ms-powerpoint/.test(mime)) return 'PowerPoint'
  return ''
}

/**
 * A file inside the project, read-only: its source, a picture, the host's preview of a document
 * (#710), or a document card that hands it to another app; «share» and «add to chat».
 */
export function FileViewer({
  path,
  content,
  image,
  preview,
  binary,
  loading = false,
  language,
  notFound = false,
  disabled = false,
  onBack,
  onShare,
  onPreview,
  onAddToChat,
}: {
  path: string
  content: string
  /** A picture file (#27): its data: URI — shown as the picture, not as «(image/png)». */
  image?: string
  /** The host's viewer of the whole file — a document or a zoomable picture (#710). */
  preview?: ReactNode
  /** A file the app does not draw and the host gave no preview of: its type and size. */
  binary?: { mime: string; bytes: number }
  /** The file is still on its way. */
  loading?: boolean
  language?: string
  notFound?: boolean
  disabled?: boolean
  onBack?: () => void
  onShare?: () => void
  /** The system's viewer of the whole file — Quick Look on iOS (#710). */
  onPreview?: () => void
  onAddToChat?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(1),
          paddingHorizontal: theme.space(2),
          height: 48,
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        }}
      >
        <IconButton icon="arrowLeft" label={t('buffcode.allFiles')} onPress={onBack} size="sm" />
        <Text variant="mono" numberOfLines={1} style={{ flex: 1 }}>
          {path}
        </Text>
        <IconButton
          icon="messageSquare"
          label={t('buffcode.addToChat')}
          onPress={onAddToChat}
          size="sm"
          disabled={disabled}
        />
        <IconButton icon="share" label={t('common.share')} onPress={onShare} size="sm" />
      </View>
      {notFound ? (
        <EmptyState icon="fileText" title={t('common.error')} text={path} />
      ) : loading ? (
        <View
          accessibilityLabel={t('common.loading')}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Spinner size="large" />
        </View>
      ) : preview ? (
        <View style={{ flex: 1 }}>{preview}</View>
      ) : binary ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.space(3),
            padding: theme.space(6),
          }}
        >
          <Icon name="file" size={40} color={c.mutedForeground} />
          <Text align="center" style={{ fontWeight: '500' }}>
            {path.split('/').pop()}
          </Text>
          <Text variant="caption" tone="muted">
            {[documentKind(binary.mime), sizeLabel(binary.bytes)].filter(Boolean).join(' · ')}
          </Text>
          {onPreview && (
            <Button variant="primary" leadingIcon="eye" onPress={onPreview}>
              {t('buffcode.preview')}
            </Button>
          )}
          <Button
            variant={onPreview ? 'secondary' : 'primary'}
            leadingIcon="externalLink"
            onPress={onShare}
          >
            {t('buffcode.openIn')}
          </Button>
        </View>
      ) : image ? (
        <ScrollView contentContainerStyle={{ padding: theme.space(3), alignItems: 'center' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('buffcode.preview')}
            disabled={!onPreview}
            onPress={onPreview}
            style={{ width: '100%' }}
          >
            <Image
              source={{ uri: image }}
              accessibilityLabel={path}
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              style={{ width: '100%', aspectRatio: 1, borderRadius: theme.radius.md }}
            />
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: theme.space(3) }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HighlightedCode code={content} language={language} numbers />
          </ScrollView>
        </ScrollView>
      )}
    </View>
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
