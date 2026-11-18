/** @jsxRuntime automatic */
import { useState, type ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { Segmented } from '../../Field.tsx'
import { SourceText } from '../../SourceText.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** The source of a file: scrolls both ways, selects as one text (#936). */
export function Source({ content, language }: { content: string; language?: string }) {
  const theme = useTheme()
  return (
    <ScrollView contentContainerStyle={{ padding: theme.space(3) }}>
      <SourceText code={content} language={language} />
    </ScrollView>
  )
}

export const isMarkdown = (path: string, language?: string): boolean =>
  language === 'markdown' || /\.(md|markdown|mdx)$/i.test(path)

/** A page (#808) or a Markdown document (#936): rendered by default, its source one tap away. */
export function PageOrSource({
  page,
  content,
  language,
  sourceLabel,
}: {
  page: ReactNode
  content: string
  language?: string
  /** What the source is called: «Code» for a page, «Text» for a document. */
  sourceLabel: string
}) {
  const t = useT()
  const theme = useTheme()
  const [view, setView] = useState<'page' | 'source'>('page')
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: theme.space(2) }}>
        <Segmented
          options={[
            { id: 'page', label: t('buffcode.preview') },
            { id: 'source', label: sourceLabel },
          ]}
          value={view}
          onChange={(id) => setView(id === 'source' ? 'source' : 'page')}
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
