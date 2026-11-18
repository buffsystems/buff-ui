/** @jsxRuntime automatic */
import { Platform, ScrollView, TextInput, View } from 'react-native'
import { tokenColor } from './Code.tsx'
import { highlight } from './highlight.ts'
import { Text } from './Text.tsx'
import { useTheme } from './theme.tsx'

/** Past this many characters a file is shown plain: colouring it would stall the phone. */
const HIGHLIGHT_MAX = 200_000

/**
 * The source of a file as ONE piece of text (#936), so a fragment of several lines — or all of
 * it — can be selected and copied the system's way; a text per line let a selection reach only
 * the end of its line. The line numbers stand in a column of their own, out of the selection —
 * and out of the sideways scroll: a long line moves under them, they stay.
 *
 * Android selects inside a `selectable` text; iOS copies such a text only whole, and gives a
 * selection with handles to a read-only text field — so on iOS the source is one.
 */
export function SourceText({ code, language }: { code: string; language?: string }) {
  const theme = useTheme()
  const text = code.replace(/\r\n/g, '\n')
  const count = text.split('\n').length
  const mono = { ...theme.text.mono, fontFamily: theme.font.mono, color: theme.colors.foreground }
  const body =
    text.length > HIGHLIGHT_MAX
      ? text
      : highlight(text, language).map((tokens, i) => [
          i > 0 ? '\n' : '',
          ...tokens.map((tok, j) => (
            <Text key={`${i}.${j}`} variant="mono" style={{ color: tokenColor(theme, tok.kind) }}>
              {tok.text}
            </Text>
          )),
        ])
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text
        testID="file-lines"
        variant="mono"
        aria-hidden
        importantForAccessibility="no"
        style={{ color: theme.colors.mutedForeground, textAlign: 'right', marginRight: 10 }}
      >
        {Array.from({ length: count }, (_, i) => i + 1).join('\n')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        {Platform.OS === 'ios' ? (
          <TextInput
            testID="file-source"
            multiline
            editable={false}
            scrollEnabled={false}
            style={[mono, { padding: 0 }]}
          >
            {body}
          </TextInput>
        ) : (
          <Text testID="file-source" variant="mono" selectable>
            {body}
          </Text>
        )}
      </ScrollView>
    </View>
  )
}
