/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Disclosure } from './Disclosure.tsx'
import { Text } from './Text.tsx'
import { useT, useTheme } from './theme.tsx'

/**
  The original words of an error (#929): folded under «Technical details», selectable so they can
  be copied for support. The sentence above says what happened and what to do.
*/
export function ErrorDetails({ details }: { details: string }) {
  const t = useT()
  const theme = useTheme()
  return (
    <Disclosure title={t('common.errorDetails')}>
      <View
        style={{
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.codeBorder,
          backgroundColor: theme.colors.codeBlockBg,
          padding: 10,
        }}
      >
        {/* An error line is read whole, not scrolled: it wraps, unlike code. */}
        <Text variant="mono" selectable>
          {details}
        </Text>
      </View>
      <Text variant="caption" tone="muted">
        {t('common.errorDetailsCopy')}
      </Text>
    </Disclosure>
  )
}
