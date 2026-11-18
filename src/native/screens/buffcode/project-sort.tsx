/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Choice } from '../../Choice.tsx'
import { Sheet } from '../../Sheet.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** The order of the projects (#938): the latest session first, or by name. */
export type ProjectSort = 'recent' | 'name'

const SORTS: { id: ProjectSort; label: string; hint: string }[] = [
  { id: 'recent', label: 'buffcode.sortRecent', hint: 'buffcode.sortRecentHint' },
  { id: 'name', label: 'buffcode.sortName', hint: 'buffcode.sortNameHint' },
]

/** The current order as a button: a tap opens the orders to pick from. */
export function ProjectSortButton({ sort, onPress }: { sort: ProjectSort; onPress: () => void }) {
  const t = useT()
  const label = t(SORTS.find((s) => s.id === sort)?.label ?? SORTS[0]!.label)
  return (
    <Button
      size="sm"
      variant="ghost"
      trailingIcon="chevronDown"
      accessibilityLabel={`${t('buffcode.sort')}: ${label}`}
      onPress={onPress}
    >
      {label}
    </Button>
  )
}

/** The orders of the projects: the picked one is marked; a pick closes the sheet. */
export function ProjectSortSheet({
  sort,
  onSort,
  onClose,
}: {
  sort: ProjectSort
  onSort?: (sort: ProjectSort) => void
  onClose: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <Sheet title={t('buffcode.sort')} onClose={onClose}>
      <View style={{ gap: theme.space(2) }}>
        {SORTS.map((s) => (
          <Choice
            key={s.id}
            label={t(s.label)}
            hint={t(s.hint)}
            picked={s.id === sort}
            onPress={() => {
              onClose()
              if (s.id !== sort) onSort?.(s.id)
            }}
          />
        ))}
      </View>
    </Sheet>
  )
}
