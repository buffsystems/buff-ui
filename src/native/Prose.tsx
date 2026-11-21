/** @jsxRuntime automatic */
import { ScrollView, View } from 'react-native'
import { CodeBlock } from './Code.tsx'
import { columnWidths, parseMarkdown, type Block } from './markdown.ts'
import { InlineSpans, isFlow, SelectableFlow, type FlowBlock } from './SelectableFlow.tsx'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** Inline text of a table cell or a quote — selectable, like every word of prose (#696). */
function Inline({ text, tone }: { text: string; tone?: 'fg' | 'fg2' }) {
  return (
    <Text tone={tone} selectable>
      <InlineSpans text={text} />
    </Text>
  )
}

/** Blocks in order, the runs of running text gathered into one flow each (#947). */
type Piece = { kind: 'flow'; blocks: FlowBlock[] } | Exclude<Block, FlowBlock>

function pieces(blocks: Block[]): Piece[] {
  const out: Piece[] = []
  for (const block of blocks) {
    const last = out[out.length - 1]
    if (!isFlow(block)) out.push(block)
    else if (last?.kind === 'flow') last.blocks.push(block)
    else out.push({ kind: 'flow', blocks: [block] })
  }
  return out
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
      {pieces(blocks).map((block, i) => {
        switch (block.kind) {
          case 'flow':
            return <SelectableFlow key={i} blocks={block.blocks} />
          case 'rule':
            // A thematic break (#948): a hairline in the border's colour, the text's whole width.
            return (
              <View
                key={i}
                testID="prose-rule"
                accessibilityRole="none"
                style={{
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginVertical: theme.space(1),
                }}
              />
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
        }
      })}
    </View>
  )
}
