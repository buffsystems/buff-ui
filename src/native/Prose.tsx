/** @jsxRuntime automatic */
import { ScrollView, View } from 'react-native'
import { CodeBlock, InlineCode } from './Code.tsx'
import { columnWidths, parseMarkdown } from './markdown.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** Inline: **bold** and `code`; the rest stays plain. Selectable, like every word of prose:
 *  an answer is there to be copied (#696). */
function Inline({ text, tone }: { text: string; tone?: 'fg' | 'fg2' }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean)
  return (
    <Text tone={tone} selectable>
      {parts.map((part, i) => {
        if (part.startsWith('**')) {
          return (
            <Text key={i} style={{ fontWeight: '600' }}>
              {part.slice(2, -2)}
            </Text>
          )
        }
        if (part.startsWith('`')) return <InlineCode key={i}>{part.slice(1, -1)}</InlineCode>
        return part
      })}
    </Text>
  )
}

/** The same words, case and spacing aside. */
const same = (a: string, b: string): boolean =>
  a.trim().toLowerCase().replace(/\s+/g, ' ') === b.trim().toLowerCase().replace(/\s+/g, ' ')

/**
  Rendered Markdown for a report, an answer, a knowledge entry. Its headings sit under the
  screen's title, never level with it (#692), and a leading heading that only repeats
  `title` is dropped.
*/
export function Prose({ markdown, title }: { markdown: string; title?: string }) {
  const theme = useTheme()
  const parsed = parseMarkdown(markdown)
  const lead = parsed[0]
  const blocks =
    title && lead?.kind === 'heading' && same(lead.text, title) ? parsed.slice(1) : parsed
  return (
    <View style={{ gap: theme.space(3) }}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return (
              <Text
                key={i}
                selectable
                variant={block.level === 1 ? 'heading' : 'label'}
                style={[
                  { marginTop: i === 0 ? 0 : theme.space(2) },
                  block.level > 1 && { fontSize: 15, lineHeight: 20, fontWeight: '600' },
                ]}
              >
                {block.text}
              </Text>
            )
          case 'list':
            return (
              <View key={i} style={{ gap: 4, paddingLeft: theme.space(2) }}>
                {block.items.map((item, j) => (
                  <View key={j} style={{ flexDirection: 'row', gap: 8 }}>
                    <Text tone="muted">{block.ordered ? `${j + 1}.` : '•'}</Text>
                    <View style={{ flex: 1 }}>
                      <Inline text={item} />
                    </View>
                  </View>
                ))}
              </View>
            )
          case 'code':
            return <CodeBlock key={i} code={block.code} language={block.language} />
          case 'table': {
            // A phone is narrower than most tables: the table scrolls sideways, the page does not.
            const widths = columnWidths([block.header, ...block.rows])
            return (
              <ScrollView key={i} horizontal showsHorizontalScrollIndicator>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.sm,
                  }}
                >
                  {[block.header, ...block.rows].map((row, r) => (
                    <View
                      key={r}
                      style={{
                        flexDirection: 'row',
                        borderTopWidth: r === 0 ? 0 : 1,
                        borderTopColor: theme.colors.border,
                        backgroundColor: r === 0 ? theme.colors.muted : undefined,
                      }}
                    >
                      {row.map((cell, c) => (
                        <View
                          key={c}
                          style={{
                            width: widths[c],
                            paddingVertical: theme.space(1.5),
                            paddingHorizontal: theme.space(2),
                            borderLeftWidth: c === 0 ? 0 : 1,
                            borderLeftColor: theme.colors.border,
                          }}
                        >
                          {r === 0 ? (
                            <Text selectable style={{ fontWeight: '600' }}>
                              {cell}
                            </Text>
                          ) : (
                            <Inline text={cell} />
                          )}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )
          }
          case 'quote':
            return (
              <View
                key={i}
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: theme.colors.borderStrong,
                  paddingLeft: theme.space(3),
                }}
              >
                <Inline text={block.text} tone="fg2" />
              </View>
            )
          default:
            return <Inline key={i} text={block.text} />
        }
      })}
    </View>
  )
}
