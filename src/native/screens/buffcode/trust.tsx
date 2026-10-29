/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Icon } from '../../Icon.tsx'
import { Row, RowGroup } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { TrustItem } from './model.ts'

/** The strip over the prompt: hooks or commands from the repository wait for review. */

export function TrustStrip({
  items,
  disabled = false,
  onCheck,
  onHide,
}: {
  items: TrustItem[]
  disabled?: boolean
  onCheck?: () => void
  onHide?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space(2),
        marginHorizontal: theme.space(3),
        marginBottom: theme.space(2),
        padding: theme.space(2),
        paddingLeft: theme.space(3),
        borderRadius: theme.radius.md,
        backgroundColor: c.warningSoft,
      }}
    >
      <Icon name="ban" size={16} color={c.warningSoftForeground} />
      <Text variant="caption" style={{ flex: 1, color: c.warningSoftForeground }} numberOfLines={2}>
        {t('buffcode.trustLine', { n: items.length })}
      </Text>
      <Button size="sm" disabled={disabled} onPress={onCheck}>
        {t('buffcode.trustCheck')}
      </Button>
      <Button size="sm" variant="ghost" onPress={onHide}>
        {t('buffcode.trustHide')}
      </Button>
    </View>
  )
}

/** The list the strip opens: each entry with its note and «Check». */

export function TrustSheet({
  items,
  disabled = false,
  onReview,
  onClose,
}: {
  items: TrustItem[]
  disabled?: boolean
  onReview?: (id: string) => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('buffcode.trustTitle')} onClose={onClose}>
      <Text variant="label" tone="fg2">
        {t('buffcode.trustText')}
      </Text>
      <RowGroup>
        {items.map((item) => (
          <Row
            key={item.id}
            icon={item.kind === 'hook' ? 'zap' : 'terminal'}
            title={item.title}
            subtitle={`${t(item.kind === 'hook' ? 'buffcode.trustHook' : 'buffcode.trustCommand')} · ${item.note}`}
            trailing={
              <Text variant="label" tone="primary">
                {t('buffcode.trustCheck')}
              </Text>
            }
            onPress={() => onReview?.(item.id)}
            disabled={disabled}
          />
        ))}
      </RowGroup>
    </Sheet>
  )
}
