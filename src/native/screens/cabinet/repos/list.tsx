/** @jsxRuntime automatic */
/*
  Repositories (#629): each with its upstream, the pointer line, the branches with their
  drift, «Check» / «Sync»; the token banner; the deferred development-tool merges.
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button, IconButton } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout, EmptyState } from '../../../Feedback.tsx'
import type { InstallStatus, LoadFailure } from '../../../model.ts'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import type { ProjectRef, ShellProps } from '../model.ts'
import { inProject, ListSkeleton, LoadError } from '../parts.tsx'
import { CabinetShell } from '../shell.tsx'
import { driftOf, type HoldStatus, type Repo, type RepoHold } from './model.ts'
import { RepoCard } from './card.tsx'

const HOLD_TONE: Record<HoldStatus, Tone> = {
  awaiting: 'warn',
  ready: 'info',
  merging: 'info',
  conflict: 'crit',
  merged: 'ok',
}

function HoldCard({ hold }: { hold: RepoHold }) {
  const t = useT()
  const theme = useTheme()
  const key = `repos.h${hold.status[0].toUpperCase()}${hold.status.slice(1)}`
  return (
    <Card tone="muted" style={{ gap: theme.space(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Text variant="label">{t('repos.holdTask', { n: hold.task })}</Text>
        <Badge tone={HOLD_TONE[hold.status]}>{t(key, { m: hold.merged, t: hold.total })}</Badge>
      </View>
      {hold.repos.map((r) => (
        <View key={r.repo} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text variant="caption" style={{ flex: 1 }} numberOfLines={1}>
            {`${r.repo} → ${r.upstream}${r.pr ? ` · PR #${r.pr}` : ''}`}
          </Text>
          <Badge tone={r.merged ? 'ok' : 'warn'}>
            {r.merged ? t('repos.accepted') : t('repos.pending')}
          </Badge>
        </View>
      ))}
    </Card>
  )
}

export function ReposListScreen({
  shell,
  status,
  repos,
  holds = [],
  loading = false,
  error = false,
  canSync = true,
  canAdd = true,
  onCheck,
  onSync,
  onSyncAll,
  onRefresh,
  onAdd,
  onRemove,
  onAddTokens,
  onRetry,
  reloading,
  onReload,
  project,
}: {
  shell: ShellProps
  status: InstallStatus
  repos: Repo[]
  holds?: RepoHold[]
  loading?: boolean
  error?: LoadFailure
  canSync?: boolean
  canAdd?: boolean
  onCheck?: (name: string) => void
  onSync?: (name: string) => void
  onSyncAll?: () => void
  onRefresh?: () => void
  onAdd?: () => void
  onRemove?: (name: string) => void
  onAddTokens?: () => void
  onRetry?: () => void
  /** Pull to refresh (`onRefresh` re-checks the upstreams). */
  reloading?: boolean
  onReload?: () => void
  project?: ProjectRef
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  const withSource = repos.filter((r) => r.provider)
  const withToken = withSource.filter((r) => r.hasToken)
  const eligible = repos.filter(
    (r) => r.provider && r.hasToken && !r.error && driftOf(r) > 0,
  ).length
  const anySyncing = repos.some((r) => r.syncing)
  return (
    <CabinetShell
      refreshing={reloading}
      onRefresh={onReload}
      shell={shell}
      section="repos"
      subtitle={inProject(project, t('repos.count', { n: repos.length }))}
      actions={
        <>
          <IconButton
            icon="refreshCw"
            label={t('repos.refresh')}
            onPress={onRefresh}
            disabled={!live || loading}
          />
          <IconButton
            icon="plus"
            label={t('repos.add')}
            onPress={onAdd}
            disabled={!live || !canAdd}
          />
        </>
      }
    >
      <InstallBanner status={status} />
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError error={error} text={t('repos.error')} onRetry={onRetry} />
      ) : repos.length === 0 ? (
        <EmptyState
          icon="folderGit"
          title={t('repos.empty')}
          action={
            live && canAdd ? { label: t('repos.add'), icon: 'plus', onPress: onAdd } : undefined
          }
        />
      ) : (
        <View
          style={{
            paddingHorizontal: theme.space(4),
            paddingTop: theme.space(2),
            gap: theme.space(3),
          }}
        >
          <Text variant="caption" tone="muted">
            {t('repos.explainer')}
          </Text>
          {canSync && (
            <Button
              variant="primary"
              leadingIcon="download"
              block
              disabled={!live || anySyncing || eligible === 0}
              onPress={onSyncAll}
            >
              {eligible === 0 ? t('repos.nothingToSync') : t('repos.syncAll', { n: eligible })}
            </Button>
          )}
          {withToken.length < withSource.length && (
            <Callout
              tone="warn"
              icon="keyRound"
              action={
                onAddTokens ? (
                  <Button size="sm" disabled={!live} onPress={onAddTokens}>
                    {t('repos.addTokens')}
                  </Button>
                ) : undefined
              }
            >
              {[
                t('repos.tokenBanner', { x: withToken.length, y: withSource.length }),
                onAddTokens ? '' : t('repos.tokensWhere'),
              ]
                .filter(Boolean)
                .join(' ')}
            </Callout>
          )}
          {holds.length > 0 && (
            <>
              <Text variant="heading">{t('repos.holdsTitle')}</Text>
              {holds.map((h) => (
                <HoldCard key={h.task} hold={h} />
              ))}
            </>
          )}
          {repos.map((r) => (
            <RepoCard
              key={r.name}
              repo={r}
              canSync={canSync}
              disabled={!live}
              onCheck={() => onCheck?.(r.name)}
              onSync={() => onSync?.(r.name)}
              onRemove={onRemove && canAdd ? () => onRemove(r.name) : undefined}
            />
          ))}
        </View>
      )}
    </CabinetShell>
  )
}
