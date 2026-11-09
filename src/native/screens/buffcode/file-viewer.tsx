/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import { Image, Pressable, ScrollView, View } from 'react-native'
import { Button, IconButton } from '../../Button.tsx'
import { HighlightedCode } from '../../Code.tsx'
import { DownloadProgress } from '../../Download.tsx'
import { sizeLabel, type Download } from '../../download.ts'
import { EmptyState, Spinner } from '../../Feedback.tsx'
import { Segmented } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** What a document is, for its card: PDF, Word, Excel, PowerPoint or just a file. */
function documentKind(mime: string): string {
  if (mime.includes('pdf')) return 'PDF'
  if (/wordprocessing|msword|opendocument\.text|rtf/.test(mime)) return 'Word'
  if (/spreadsheet|ms-excel/.test(mime)) return 'Excel'
  if (/presentation|ms-powerpoint/.test(mime)) return 'PowerPoint'
  return ''
}

/**
 * A file, read-only: its source, a picture, a page shown rendered or as code (#808), the host's
 * preview of a document (#710), or a document card that hands it to another app; while it comes,
 * how much came and how long is left (#809). «Share» and, in a session, «add to chat».
 */
export function FileViewer({
  path,
  content,
  image,
  page,
  preview,
  binary,
  loading = false,
  progress,
  language,
  notFound = false,
  disabled = false,
  backLabel,
  onBack,
  onShare,
  onPreview,
  onAddToChat,
}: {
  path: string
  content: string
  /** A picture file (#27): its data: URI — shown as the picture, not as «(image/png)». */
  image?: string
  /** A page (#808): the host's rendering of it; «Code» shows `content`. */
  page?: ReactNode
  /** The host's viewer of the whole file — a document or a zoomable picture (#710). */
  preview?: ReactNode
  /** A file the app does not draw and the host gave no preview of: its type and size. */
  binary?: { mime: string; bytes: number }
  /** The file is still on its way. */
  loading?: boolean
  /** How much of it came (#809); without it — a spinner. */
  progress?: Download
  language?: string
  notFound?: boolean
  disabled?: boolean
  /** What «back» leads to; in a session — all files. */
  backLabel?: string
  onBack?: () => void
  onShare?: () => void
  /** The system's viewer of the whole file — Quick Look on iOS (#710). */
  onPreview?: () => void
  /** In a session: the file goes into the message being written. */
  onAddToChat?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const name = path.split('/').pop() ?? path
  const body = (): ReactNode => {
    if (notFound) return <EmptyState icon="fileText" title={t('common.error')} text={path} />
    if (loading)
      return progress ? (
        <DownloadProgress name={name} {...progress} />
      ) : (
        <View
          accessibilityLabel={t('common.loading')}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Spinner size="large" />
        </View>
      )
    if (page) return <PageOrCode page={page} content={content} language={language} />
    if (preview) return <View style={{ flex: 1 }}>{preview}</View>
    if (binary)
      return (
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
            {name}
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
      )
    if (image)
      return (
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
      )
    return <Source content={content} language={language} />
  }
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
        <IconButton
          icon="arrowLeft"
          label={backLabel ?? t('buffcode.allFiles')}
          onPress={onBack}
          size="sm"
        />
        <Text variant="mono" numberOfLines={1} style={{ flex: 1 }}>
          {path}
        </Text>
        {onAddToChat && (
          <IconButton
            icon="messageSquare"
            label={t('buffcode.addToChat')}
            onPress={onAddToChat}
            size="sm"
            disabled={disabled}
          />
        )}
        <IconButton icon="share" label={t('common.share')} onPress={onShare} size="sm" />
      </View>
      {body()}
    </View>
  )
}

function Source({ content, language }: { content: string; language?: string }) {
  const theme = useTheme()
  return (
    <ScrollView contentContainerStyle={{ padding: theme.space(3) }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HighlightedCode code={content} language={language} numbers />
      </ScrollView>
    </ScrollView>
  )
}

/** A page (#808): rendered by default, its source one tap away. */
function PageOrCode({
  page,
  content,
  language,
}: {
  page: ReactNode
  content: string
  language?: string
}) {
  const t = useT()
  const theme = useTheme()
  const [view, setView] = useState<'page' | 'code'>('page')
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: theme.space(2) }}>
        <Segmented
          options={[
            { id: 'page', label: t('buffcode.preview') },
            { id: 'code', label: t('buffcode.viewCode') },
          ]}
          value={view}
          onChange={(id) => setView(id === 'code' ? 'code' : 'page')}
        />
      </View>
      {view === 'page' ? (
        <View style={{ flex: 1 }}>{page}</View>
      ) : (
        <Source content={content} language={language} />
      )}
    </View>
  )
}
