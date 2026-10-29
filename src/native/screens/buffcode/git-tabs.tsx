/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Field, Input } from '../../Field.tsx'
import { Row, RowGroup } from '../../Row.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { GitState } from './model.ts'

/** The Branches tab of the Git sheet: switch to one, or create one from the current state. */
export function BranchesTab({
  state,
  disabled = false,
  onSwitchBranch,
  onCreateBranch,
}: {
  state: GitState
  disabled?: boolean
  onSwitchBranch?: (name: string) => void
  onCreateBranch?: (name: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const [branch, setBranch] = useState('')
  return (
    <View style={{ gap: theme.space(3) }}>
      <RowGroup>
        {state.branches.map((name) => (
          <Row
            key={name}
            icon="gitBranch"
            title={name}
            trailing={
              name === state.branch ? (
                <Badge tone="info">{t('buffcode.gitCurrent')}</Badge>
              ) : (
                <Text variant="label" tone="primary">
                  {t('buffcode.gitSwitch')}
                </Text>
              )
            }
            onPress={name === state.branch ? undefined : () => onSwitchBranch?.(name)}
            disabled={disabled}
          />
        ))}
      </RowGroup>
      <Field label={t('buffcode.gitNewBranch')}>
        <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="feature/…"
              value={branch}
              onChangeText={setBranch}
              editable={!disabled}
              autoCapitalize="none"
            />
          </View>
          <Button
            variant="primary"
            disabled={disabled || !branch.trim()}
            onPress={() => onCreateBranch?.(branch)}
          >
            {t('buffcode.gitCreateSwitch')}
          </Button>
        </View>
      </Field>
    </View>
  )
}

/** The History tab: the latest commits, hash and subject. */
export function HistoryTab({ state }: { state: GitState }) {
  const t = useT()
  const theme = useTheme()
  if (state.history.length === 0) {
    return (
      <Text tone="muted" align="center" style={{ paddingVertical: theme.space(4) }}>
        {t('buffcode.gitNoCommits')}
      </Text>
    )
  }
  return (
    <RowGroup>
      {state.history.map((commit) => (
        <Row
          key={commit.hash}
          leading={
            <Text variant="mono" tone="muted">
              {commit.hash.slice(0, 7)}
            </Text>
          }
          title={commit.subject}
          subtitle={commit.when}
          lines={2}
        />
      ))}
    </RowGroup>
  )
}
