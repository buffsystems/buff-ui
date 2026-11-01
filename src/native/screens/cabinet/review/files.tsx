import type { LoadFailure } from '../../../model.ts'
/** @jsxRuntime automatic */
/*
  The «Changes» tab of a review (#629): the land error, the development-tools summary, and
  one block per pull request with its files; a file opens its diff full screen.
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout, Skeleton } from '../../../Feedback.tsx'
import { Prose } from '../../../Prose.tsx'
import { Row, RowGroup } from '../../../Row.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import type { Review, ReviewFile, ReviewFileStatus, ReviewPr } from './model.ts'

const STATUS_TONE: Record<ReviewFileStatus, Tone> = {
  added: 'ok',
  modified: 'warn',
  deleted: 'crit',
  renamed: 'info',
  binary: 'neutral',
}

/** One file: folder muted, name bold, the status mark, the counts. */
export function ReviewFileRow({ file, onPress }: { file: ReviewFile; onPress?: () => void }) {
  const t = useT()
  const key = `review.f${file.status[0].toUpperCase()}${file.status.slice(1)}`
  const binary = file.status === 'binary'
  return (
    <Row
      title={file.path}
      subtitle={
        [file.oldPath && `← ${file.oldPath}`, !binary && `+${file.add} −${file.del}`]
          .filter(Boolean)
          .join(' · ') || undefined
      }
      trailing={<Badge tone={STATUS_TONE[file.status]}>{t(key)}</Badge>}
      chevron={!binary}
      onPress={binary ? undefined : onPress}
      lines={2}
    />
  )
}

function PrBlock({
  pr,
  disabled,
  onOpenFile,
  onPatch,
}: {
  pr: ReviewPr
  disabled: boolean
  onOpenFile?: (repo: string, path: string) => void
  onPatch?: (repo: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <View style={{ gap: theme.space(2) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label">{`${pr.repo} · #${pr.number}`}</Text>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {`${pr.title} · +${pr.add} −${pr.del} · ${t('review.files', { n: pr.files.length })}`}
          </Text>
        </View>
        <Button
          size="sm"
          variant="ghost"
          leadingIcon="download"
          disabled={disabled}
          onPress={() => onPatch?.(pr.repo)}
        >
          {t('review.patch')}
        </Button>
      </View>
      {pr.files.length === 0 ? (
        <Text variant="caption" tone="muted">
          —
        </Text>
      ) : (
        <RowGroup>
          {pr.files.map((f) => (
            <ReviewFileRow key={f.path} file={f} onPress={() => onOpenFile?.(pr.repo, f.path)} />
          ))}
        </RowGroup>
      )}
    </View>
  )
}

export function ChangesTab({
  review,
  loading = false,
  error = false,
  disabled = false,
  onOpenFile,
  onPatch,
  onRetry,
}: {
  review: Review
  loading?: boolean
  error?: LoadFailure
  disabled?: boolean
  onOpenFile?: (repo: string, path: string) => void
  onPatch?: (repo: string) => void
  onRetry?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const sp = review.superproject
  return (
    <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(4) }}>
      {review.landError && (
        <Callout tone="crit" title={t('review.landError')}>
          {`${review.landError}\n${t('review.landErrorHint')}`}
        </Callout>
      )}
      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <LoadError error={error} onRetry={onRetry} />
      ) : review.prs.length === 0 && !sp ? (
        <Text tone="muted">{review.closed ? t('review.prsClosed') : t('review.noPrs')}</Text>
      ) : (
        <>
          {review.superprojectOnly && <Callout tone="info">{t('review.superOnly')}</Callout>}
          {sp && (
            <Card style={{ gap: 8 }}>
              <Text variant="label">{t('review.devTools')}</Text>
              {sp.files > 0 && (
                <Text variant="caption" tone="muted">
                  {`${t('review.files', { n: sp.files })} · +${sp.add} −${sp.del}`}
                </Text>
              )}
              {sp.summary ? <Prose markdown={sp.summary} /> : <Skeleton width="80%" />}
            </Card>
          )}
          {review.prs.map((pr) => (
            <PrBlock
              key={`${pr.repo}#${pr.number}`}
              pr={pr}
              disabled={disabled}
              onOpenFile={onOpenFile}
              onPatch={onPatch}
            />
          ))}
        </>
      )}
    </View>
  )
}
