/** @jsxRuntime automatic */
import { useState } from 'react'
import { Avatar } from '../../Avatar.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT } from '../../theme.tsx'
import { ListSkeleton } from '../cabinet/parts.tsx'

/**
 * The sheet a SelectField opens: a search field over a list with the chosen item marked,
 * or an empty state.
 */

export function PickerSheet({
  title,
  items,
  selectedId,
  icon,
  emptyTitle,
  emptyText,
  loading = false,
  onSelect,
  onClose,
}: {
  title: string
  items: { id: string; title: string; subtitle?: string }[]
  selectedId?: string
  icon: IconName
  emptyTitle: string
  emptyText: string
  /** The list is on its way (#696): a skeleton, not the empty state. */
  loading?: boolean
  onSelect?: (id: string) => void
  onClose?: () => void
}) {
  const t = useT()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = q
    ? items.filter((i) => `${i.title} ${i.subtitle ?? ''}`.toLowerCase().includes(q))
    : items
  return (
    <Sheet title={title} onClose={onClose}>
      {items.length > 0 && (
        <Input
          icon="search"
          placeholder={t('buffcode.pickerSearch')}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
      {items.length === 0 && loading ? (
        <ListSkeleton rows={3} />
      ) : items.length === 0 ? (
        <EmptyState icon={icon} title={emptyTitle} text={emptyText} />
      ) : shown.length === 0 ? (
        <Text tone="muted" align="center" style={{ paddingVertical: 24 }}>
          {t('buffcode.pickerNothing')}
        </Text>
      ) : (
        <RowGroup>
          {shown.map((item) => (
            <Row
              key={item.id}
              leading={<Avatar name={item.title} icon={icon} size={32} />}
              title={item.title}
              subtitle={item.subtitle}
              trailing={item.id === selectedId ? <Icon name="check" size={18} /> : undefined}
              onPress={() => onSelect?.(item.id)}
            />
          ))}
        </RowGroup>
      )}
    </Sheet>
  )
}
