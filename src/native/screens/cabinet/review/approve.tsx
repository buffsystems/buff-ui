/** @jsxRuntime automatic */
/*
  «Approve the task?» (#629): merge straight in, or a PR per changed repository with its
  target branch and the access check.
*/
import { View } from 'react-native'
import { Badge } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout, Spinner } from '../../../Feedback.tsx'
import { Field, SelectField } from '../../../Field.tsx'
import { Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { ApproveRepo } from './model.ts'

export const PROVIDER_LABEL = {
  github: 'GitHub PR',
  gitlab: 'GitLab MR',
  bitbucket: 'Bitbucket PR',
  gitea: 'Gitea PR',
}

/** «Approve the task?»: merge straight in, or a PR per changed repository with its branch. */
export function ApproveSheet({
  repos,
  loading = false,
  error,
  onPickBranch,
  onConfirm,
  onClose,
}: {
  repos: ApproveRepo[]
  loading?: boolean
  error?: string
  onPickBranch?: (repo: string) => void
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const publish = repos.some((r) => r.upstream)
  const missing = repos.filter((r) => r.access === 'noToken').map((r) => r.repo)
  const ready = !loading && repos.length > 0 && repos.every((r) => r.access === 'ok' || !r.upstream)
  const accessText = (r: ApproveRepo) =>
    r.access === 'noToken'
      ? t('rvd.noToken')
      : r.access === 'checking'
        ? t('rvd.checking')
        : r.access === 'ok'
          ? t('rvd.accessOk')
          : (r.reason ?? t('rvd.accessNo'))
  return (
    <Sheet
      title={t('rvd.approveTitle')}
      onClose={onClose}
      footer={
        <Button variant="primary" block disabled={!ready} onPress={onConfirm}>
          {publish ? t('rvd.approvePublish') : t('rvd.approveMerge')}
        </Button>
      }
    >
      <Text variant="caption" tone="fg2">
        {publish ? t('rvd.approvePublishText') : t('rvd.approveMergeText')}
      </Text>
      {error && <Callout tone="crit">{error}</Callout>}
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Spinner />
          <Text tone="muted">{t('rvd.checkingAccess')}</Text>
        </View>
      ) : repos.length === 0 ? (
        <Text tone="muted">{t('rvd.noRepos')}</Text>
      ) : (
        repos.map((r) => (
          <Card key={r.repo} style={{ gap: theme.space(2) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text variant="label">{r.repo}</Text>
              <Badge tone={r.upstream ? 'info' : 'neutral'}>
                {r.upstream && r.provider
                  ? `${PROVIDER_LABEL[r.provider]} · ${r.upstream}`
                  : t('rvd.internal')}
              </Badge>
            </View>
            {r.upstream && (
              <>
                <Text
                  variant="caption"
                  tone={
                    r.access === 'ok' ? 'success' : r.access === 'denied' ? 'destructive' : 'muted'
                  }
                >
                  {accessText(r)}
                </Text>
                <Field label={t('rvd.targetBranch')}>
                  <SelectField
                    value={r.branch ?? `${r.defaultBranch} · ${t('devt.byDefault')}`}
                    placeholder={t('rvd.targetPlaceholder')}
                    icon="gitBranch"
                    onPress={() => onPickBranch?.(r.repo)}
                  />
                </Field>
              </>
            )}
          </Card>
        ))
      )}
      {missing.length > 0 && (
        <Callout tone="warn">{t('rvd.missingTokens', { repos: missing.join(', ') })}</Callout>
      )}
    </Sheet>
  )
}
