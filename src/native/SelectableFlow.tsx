/** @jsxRuntime automatic */
import { Fragment, type ReactNode } from 'react'
import { Platform, TextInput, type TextStyle } from 'react-native'
import { InlineCode } from './Code.tsx'
import type { Block } from './markdown.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** The blocks that read as running text: they join one selectable text (#947). */
export type FlowBlock = Extract<Block, { kind: 'heading' | 'paragraph' | 'list' }>

export const isFlow = (block: Block): block is FlowBlock =>
  block.kind === 'heading' || block.kind === 'paragraph' || block.kind === 'list'

/** Inline: **bold** and `code`; the rest stays plain. */
export function InlineSpans({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean)
  return parts.map((part, i) => {
    if (part.startsWith('**'))
      return (
        <Text key={i} style={{ fontWeight: '600' }}>
          {part.slice(2, -2)}
        </Text>
      )
    if (part.startsWith('`')) return <InlineCode key={i}>{part.slice(1, -1)}</InlineCode>
    return <Fragment key={i}>{part}</Fragment>
  })
}

/**
 * Headings, paragraphs and lists in a row as ONE text (#947): a selection with handles runs from
 * any character to any other across them, as in Claude and ChatGPT; a text per block let it reach
 * only that block's end. The space between blocks is an empty line of its own height.
 *
 * Android selects inside a `selectable` text; iOS copies such a text only whole, and gives a
 * selection with handles to a read-only text field — so on iOS the flow is one (as #936's source).
 */
export function SelectableFlow({ blocks }: { blocks: FlowBlock[] }) {
  const theme = useTheme()
  const gap = (key: string, height: number): ReactNode => (
    <Text key={key} style={{ fontSize: height * 0.6, lineHeight: height }}>
      {'\n\n'}
    </Text>
  )
  const body = blocks.map((block, i) => {
    const lead =
      i > 0 ? gap(`g${i}`, block.kind === 'heading' ? theme.space(5) : theme.space(3)) : null
    switch (block.kind) {
      case 'heading': {
        const top = block.level === 1 ? theme.text.heading : { fontSize: 15, lineHeight: 20 }
        return (
          <Fragment key={i}>
            {lead}
            <Text style={{ ...top, fontWeight: '600' }}>{block.text}</Text>
          </Fragment>
        )
      }
      case 'list':
        return (
          <Fragment key={i}>
            {lead}
            {block.items.map((item, j) => (
              <Fragment key={j}>
                {j > 0 && '\n'}
                <Text tone="muted">{block.ordered ? `${j + 1}.\u00a0` : '•\u00a0\u00a0'}</Text>
                <InlineSpans text={item} />
              </Fragment>
            ))}
          </Fragment>
        )
      default:
        return (
          <Fragment key={i}>
            {lead}
            <InlineSpans text={block.text} />
          </Fragment>
        )
    }
  })
  if (Platform.OS === 'ios')
    return (
      <TextInput
        testID="prose-flow"
        multiline
        editable={false}
        scrollEnabled={false}
        style={[theme.text.body, { color: theme.colors.foreground, padding: 0 }]}
      >
        <Text>{body}</Text>
      </TextInput>
    )
  return (
    <Text testID="prose-flow" selectable>
      {body}
    </Text>
  )
}

/** Plain text with the same selection (#947): the person's own message in its bubble. */
export function SelectableText({ text, color }: { text: string; color: string }) {
  const theme = useTheme()
  const style: TextStyle = { color }
  if (Platform.OS === 'ios')
    return (
      <TextInput
        multiline
        editable={false}
        scrollEnabled={false}
        style={[theme.text.body, style, { padding: 0 }]}
      >
        <Text style={style}>{text}</Text>
      </TextInput>
    )
  return (
    <Text selectable style={style}>
      {text}
    </Text>
  )
}
