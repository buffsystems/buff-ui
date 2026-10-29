/** @jsxRuntime automatic */
import { ScrollView, View } from 'react-native'
import { highlight, type TokenKind } from './highlight.ts'
import { Text } from './Text.tsx'
import { useTheme, type NativeTheme } from './theme.tsx'

/** A diff, line by line, with the cabinet's add/delete tints. */
export function DiffView({ lines, maxLines }: { lines: string[]; maxLines?: number }) {
  const theme = useTheme()
  const c = theme.colors
  const shown = maxLines ? lines.slice(0, maxLines) : lines
  return (
    <View
      style={{
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: c.codeBorder,
        backgroundColor: c.codeBlockBg,
        overflow: 'hidden',
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {shown.map((line, i) => {
            const kind = line.startsWith('+')
              ? 'add'
              : line.startsWith('-')
                ? 'del'
                : line.startsWith('@@')
                  ? 'hunk'
                  : 'ctx'
            const bg = kind === 'add' ? c.diffAddBg : kind === 'del' ? c.diffDelBg : 'transparent'
            const fg = kind === 'hunk' ? c.syntaxNumber : kind === 'ctx' ? c.fg2 : c.foreground
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  backgroundColor: bg,
                  paddingHorizontal: 10,
                  minWidth: '100%',
                }}
              >
                <Text variant="mono" style={{ color: c.mutedForeground, width: 32 }}>
                  {String(i + 1)}
                </Text>
                <Text variant="mono" style={{ color: fg }}>
                  {line || ' '}
                </Text>
              </View>
            )
          })}
          {maxLines && lines.length > maxLines && (
            <Text variant="caption" tone="muted" style={{ padding: 8 }}>
              … +{lines.length - maxLines}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

/** Terminal output: dark surface, the ANSI palette's foreground, a cursor at the end. */
export function Terminal({
  lines,
  cursor = false,
  height,
}: {
  lines: string[]
  cursor?: boolean
  height?: number
}) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        height,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: c.terminalBorder,
        backgroundColor: c.terminalBg,
        padding: 10,
      }}
    >
      <ScrollView>
        {lines.map((line, i) => (
          <Text
            key={i}
            variant="mono"
            style={{
              color: line.startsWith('$')
                ? c.ansiGreen
                : line.startsWith('!')
                  ? c.ansiRed
                  : c.terminalFg,
            }}
          >
            {line || ' '}
          </Text>
        ))}
        {cursor && (
          <Text variant="mono" style={{ color: c.ansiWhite }}>
            ▋
          </Text>
        )}
      </ScrollView>
    </View>
  )
}

function tokenColor(theme: NativeTheme, kind: TokenKind): string {
  const c = theme.colors
  switch (kind) {
    case 'comment':
      return c.syntaxComment
    case 'string':
      return c.syntaxString
    case 'number':
      return c.syntaxNumber
    case 'keyword':
      return c.syntaxKeyword
    case 'func':
      return c.syntaxFunc
    default:
      return c.foreground
  }
}

/** Code with the palette's syntax colours, line by line; `numbers` adds a gutter. */
export function HighlightedCode({
  code,
  language,
  numbers = false,
}: {
  code: string
  language?: string
  numbers?: boolean
}) {
  const theme = useTheme()
  const lines = highlight(code, language)
  const width = String(lines.length).length * 9 + 8
  return (
    <View>
      {lines.map((tokens, i) => (
        <View key={i} style={{ flexDirection: 'row' }}>
          {numbers && (
            <Text
              variant="mono"
              style={{
                color: theme.colors.mutedForeground,
                width,
                textAlign: 'right',
                marginRight: 10,
              }}
            >
              {String(i + 1)}
            </Text>
          )}
          <Text variant="mono" selectable>
            {tokens.length === 0
              ? ' '
              : tokens.map((tok, j) => (
                  <Text key={j} variant="mono" style={{ color: tokenColor(theme, tok.kind) }}>
                    {tok.text}
                  </Text>
                ))}
          </Text>
        </View>
      ))}
    </View>
  )
}

/** A block of code inside prose. */
export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: c.codeBorder,
        backgroundColor: c.codeBlockBg,
        padding: 10,
        gap: 4,
      }}
    >
      {language && (
        <Text variant="caption" style={{ color: c.mutedForeground }}>
          {language}
        </Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HighlightedCode code={code} language={language} />
      </ScrollView>
    </View>
  )
}

/** Inline code: `name`. */
export function InlineCode({ children }: { children: string }) {
  const theme = useTheme()
  const c = theme.colors
  return (
    <Text
      variant="mono"
      style={{ color: c.codeFg, backgroundColor: c.codeBg, paddingHorizontal: 4, borderRadius: 4 }}
    >
      {children}
    </Text>
  )
}
