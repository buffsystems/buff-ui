/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Field, Input, Segmented } from '../../Field.tsx'
import { BranchesTab, HistoryTab } from './git-tabs.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { ComposerChip } from './composer-parts.tsx'
import type { GitState } from './model.ts'

/** The branch chip under the prompt: the branch, changed files, commits ahead / behind. */
export function GitChip({
  state,
  disabled = false,
  onPress,
}: {
  state: GitState
  disabled?: boolean
  onPress?: () => void
}) {
  const t = useT()
  const counts = [
    state.changes.length ? `±${state.changes.length}` : '',
    state.ahead ? `↑${state.ahead}` : '',
    state.behind ? `↓${state.behind}` : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <ComposerChip
      icon="gitBranch"
      label={`${state.branch ?? t('buffcode.gitNoBranch')}${counts ? ` ${counts}` : ''}`}
      disabled={disabled}
      onPress={onPress}
    />
  )
}

function syncLabel(
  t: (k: string, v?: Record<string, string | number>) => string,
  state: GitState,
): string {
  const parts = [
    state.ahead ? t('buffcode.gitAhead', { n: state.ahead }) : '',
    state.behind ? t('buffcode.gitBehind', { n: state.behind }) : '',
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : t('buffcode.gitSynced')
}

type GitTab = 'changes' | 'branches' | 'history'

/** The Git dialog as a sheet: changes (commit, push), branches (switch, create), history. */
export function GitSheet({
  state,
  busy,
  disabled = false,
  onCompose,
  onCommit,
  onCommitPush,
  onPush,
  onSwitchBranch,
  onCreateBranch,
  onClose,
}: {
  state: GitState
  busy?: 'commit' | 'push' | 'message'
  disabled?: boolean
  onCompose?: () => void
  onCommit?: (message: string) => void
  onCommitPush?: (message: string) => void
  onPush?: () => void
  onSwitchBranch?: (name: string) => void
  onCreateBranch?: (name: string) => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [tab, setTab] = useState<GitTab>('changes')
  const [message, setMessage] = useState('')
  const title = `Git · ${state.branch ?? t('buffcode.gitNoBranch')}`
  return (
    <Sheet title={title} onClose={onClose}>
      <Segmented
        options={[
          { id: 'changes', label: t('buffcode.gitChanges') },
          { id: 'branches', label: t('buffcode.gitBranches') },
          { id: 'history', label: t('buffcode.gitHistory') },
        ]}
        value={tab}
        onChange={(id) => setTab(id as GitTab)}
      />
      {tab === 'changes' &&
        (state.changes.length === 0 ? (
          <Text tone="muted" align="center" style={{ paddingVertical: theme.space(4) }}>
            {t('buffcode.gitClean')}
          </Text>
        ) : (
          <View style={{ gap: theme.space(3) }}>
            <View style={{ gap: 4 }}>
              {state.changes.map((change) => (
                <View
                  key={change.path}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Badge
                    tone={
                      change.status === 'added'
                        ? 'ok'
                        : change.status === 'deleted'
                          ? 'crit'
                          : 'info'
                    }
                  >
                    {change.status[0].toUpperCase()}
                  </Badge>
                  <Text variant="mono" numberOfLines={1} style={{ flex: 1 }}>
                    {change.path}
                  </Text>
                </View>
              ))}
            </View>
            <Field label={t('buffcode.gitMessage')}>
              <Input
                rows={2}
                placeholder={t('buffcode.gitMessagePlaceholder')}
                value={message}
                onChangeText={setMessage}
                editable={!disabled}
              />
            </Field>
            <Button
              size="sm"
              variant="ghost"
              leadingIcon="sparkles"
              loading={busy === 'message'}
              disabled={disabled}
              onPress={onCompose}
            >
              {t('buffcode.gitCompose')}
            </Button>
            <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
              <Button
                block
                disabled={disabled || !message.trim()}
                onPress={() => onCommitPush?.(message)}
                style={{ flex: 1 }}
              >
                {t('buffcode.gitCommitPush')}
              </Button>
              <Button
                block
                variant="primary"
                leadingIcon="gitCommit"
                loading={busy === 'commit'}
                disabled={disabled || !message.trim()}
                onPress={() => onCommit?.(message)}
                style={{ flex: 1 }}
              >
                {t('buffcode.gitCommit')}
              </Button>
            </View>
          </View>
        ))}
      {tab === 'changes' && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.space(2),
            paddingTop: theme.space(2),
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }}
        >
          <Text variant="caption" tone="muted" style={{ flex: 1 }}>
            {syncLabel(t, state)}
          </Text>
          <Button
            size="sm"
            leadingIcon="upload"
            loading={busy === 'push'}
            disabled={disabled || state.ahead === 0}
            onPress={onPush}
          >
            {t('buffcode.gitPush')}
          </Button>
        </View>
      )}
      {tab === 'branches' && (
        <BranchesTab
          state={state}
          disabled={disabled}
          onSwitchBranch={onSwitchBranch}
          onCreateBranch={onCreateBranch}
        />
      )}
      {tab === 'history' && <HistoryTab state={state} />}
    </Sheet>
  )
}
