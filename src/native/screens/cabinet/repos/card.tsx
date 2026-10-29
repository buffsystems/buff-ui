/** @jsxRuntime automatic */
/*
  One repository (#629): its upstream, the pointer line, the branches with their drift,
  «Check» / «Sync», and «Remove».
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button, IconButton } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout } from '../../../Feedback.tsx'
import type { Translate } from '../../../i18n.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { driftOf, type Repo, type RepoBranch } from './model.ts'

const PROVIDER = { github: 'GitHub', gitlab: 'GitLab', bitbucket: 'Bitbucket', gitea: 'Gitea' }

export function branchBadge(t: Translate, b: RepoBranch): { label: string; tone: Tone } {
  switch (b.status) {
    case 'insync':
      return { label: t('repos.bInsync'), tone: 'ok' }
    case 'behind':
      return { label: t('repos.bBehind', { n: b.behind }), tone: 'warn' }
    case 'missing':
      return { label: t('repos.bMissing'), tone: 'info' }
    case 'ahead':
      return { label: t('repos.bAhead', { n: b.ahead }), tone: 'neutral' }
    case 'diverged':
      return { label: t('repos.bDiverged', { a: b.ahead, b: b.behind }), tone: 'crit' }
    default:
      return { label: b.reason ?? t('repos.bUnknown'), tone: 'neutral' }
  }
}

export function RepoCard({
  repo,
  canSync = true,
  disabled = false,
  onCheck,
  onSync,
  onRemove,
}: {
  repo: Repo
  canSync?: boolean
  disabled?: boolean
  onCheck?: () => void
  onSync?: () => void
  onRemove?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const drift = driftOf(repo)
  const usable = !!repo.provider && repo.hasToken && !repo.error
  const sorted = [...repo.branches].sort((a, b) =>
    a.name === repo.defaultBranch
      ? -1
      : b.name === repo.defaultBranch
        ? 1
        : a.name.localeCompare(b.name),
  )
  const pointer = repo.pointer
  const body = !repo.provider
    ? t('repos.internal')
    : !repo.hasToken
      ? t('repos.needToken')
      : repo.branches.length === 0 && !repo.error
        ? t('repos.noBranches')
        : undefined
  return (
    <Card style={{ gap: theme.space(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text variant="heading" style={{ flex: 1 }} numberOfLines={1}>
          {repo.name}
        </Text>
        {onRemove && (
          <IconButton
            icon="trash"
            label={t('repos.remove')}
            size="sm"
            onPress={onRemove}
            disabled={disabled}
          />
        )}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        <Badge tone={repo.provider ? 'info' : 'neutral'}>
          {repo.provider
            ? `${PROVIDER[repo.provider]} · ${repo.upstream ?? ''}`
            : t('repos.noUpstream')}
        </Badge>
        {usable && (
          <Badge tone={drift ? 'warn' : 'ok'}>
            {drift ? t('repos.drift', { n: drift }) : t('repos.inSync')}
          </Badge>
        )}
        {repo.syncing && <Badge tone="info">{t('repos.syncing')}</Badge>}
      </View>
      {pointer && (
        <Text variant="caption" tone="muted">
          {pointer.status === 'behind'
            ? t('repos.pointerBehind', { n: pointer.behind, branch: pointer.branch })
            : pointer.status === 'insync'
              ? t('repos.pointerInSync')
              : t('repos.pointerUnknown')}
        </Text>
      )}
      {repo.error ? (
        <Callout tone="crit">{repo.error}</Callout>
      ) : body ? (
        <Text variant="caption" tone="muted">
          {body}
        </Text>
      ) : (
        <RowGroup>
          {sorted.map((b) => {
            const badge = branchBadge(t, b)
            return (
              <Row
                key={b.name}
                icon="gitBranch"
                title={b.name}
                subtitle={b.name === repo.defaultBranch ? t('repos.default') : undefined}
                trailing={<Badge tone={badge.tone}>{badge.label}</Badge>}
              />
            )
          })}
        </RowGroup>
      )}
      {repo.provider && (
        <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
          <Button
            size="sm"
            leadingIcon="refreshCw"
            disabled={disabled || repo.syncing || !repo.hasToken}
            onPress={onCheck}
          >
            {t('repos.check')}
          </Button>
          {canSync && (
            <Button
              size="sm"
              variant="primary"
              leadingIcon="download"
              disabled={disabled || !usable || drift === 0 || repo.syncing}
              loading={repo.syncing}
              onPress={onSync}
            >
              {t('repos.sync')}
            </Button>
          )}
        </View>
      )}
    </Card>
  )
}
