/** @jsxRuntime automatic */
/*
  The code of a task (#629): the changed files, one file's diff, and the test inventory.
*/
import { View } from 'react-native'
import { Badge, type Tone } from '../../../Badge.tsx'
import { Button } from '../../../Button.tsx'
import { Chip, ChipRow } from '../../../Chip.tsx'
import { DiffView } from '../../../Code.tsx'
import { EmptyState } from '../../../Feedback.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { ListSkeleton, LoadError } from '../parts.tsx'
import type { ChangeKind, ChangedFile, TestEntry } from './model.ts'

const KIND_TONE: Record<ChangeKind, Tone> = { added: 'ok', modified: 'warn', deleted: 'crit' }
const KIND_KEY: Record<ChangeKind, string> = {
  added: 'devt.fileAdded',
  modified: 'devt.fileModified',
  deleted: 'devt.fileDeleted',
}

function FileRows({ files, onOpen }: { files: ChangedFile[]; onOpen?: (path: string) => void }) {
  const t = useT()
  return (
    <RowGroup>
      {files.map((f) => (
        <Row
          key={f.path}
          title={f.path}
          subtitle={f.add + f.del > 0 ? `+${f.add} −${f.del}` : '—'}
          trailing={<Badge tone={KIND_TONE[f.kind]}>{t(KIND_KEY[f.kind])}</Badge>}
          chevron
          onPress={() => onOpen?.(f.path)}
          lines={2}
        />
      ))}
    </RowGroup>
  )
}

/** The changed files, grouped when some lie outside the working tree. */
export function ChangesScreen({
  status,
  taskNumber,
  files,
  loading = false,
  error = false,
  onBack,
  onOpenFile,
  onRetry,
}: {
  status: InstallStatus
  taskNumber: number
  files: ChangedFile[]
  loading?: boolean
  error?: boolean
  onBack?: () => void
  onOpenFile?: (path: string) => void
  onRetry?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const inside = files.filter((f) => !f.outside)
  const outside = files.filter((f) => f.outside)
  const count = (k: ChangeKind) => files.filter((f) => f.kind === k).length
  const line = t('devt.changesLine', {
    total: files.length,
    added: count('added'),
    modified: count('modified'),
    deleted: count('deleted'),
    la: files.reduce((s, f) => s + f.add, 0),
    ld: files.reduce((s, f) => s + f.del, 0),
  })
  return (
    <>
      <TopBar title={t('devt.changesTitle')} subtitle={`#${taskNumber}`} onBack={onBack} />
      <Screen>
        <InstallBanner status={status} />
        {loading ? (
          <ListSkeleton />
        ) : error ? (
          <LoadError text={t('devt.filesError')} onRetry={onRetry} />
        ) : files.length === 0 ? (
          <EmptyState icon="fileText" title={t('devt.noFiles')} />
        ) : (
          <View
            style={{
              paddingHorizontal: theme.space(4),
              paddingTop: theme.space(2),
              gap: theme.space(3),
            }}
          >
            <Text variant="caption" tone="muted">
              {line}
            </Text>
            {outside.length === 0 ? (
              <FileRows files={inside} onOpen={onOpenFile} />
            ) : (
              <>
                <Text variant="label">{t('devt.projectFiles')}</Text>
                <FileRows files={inside} onOpen={onOpenFile} />
                <Text variant="label">{t('devt.outsideFiles')}</Text>
                <FileRows files={outside} onOpen={onOpenFile} />
              </>
            )}
          </View>
        )}
      </Screen>
    </>
  )
}

/** One file's diff, full screen. */
export function FileDiffScreen({
  status,
  path,
  lines,
  loading = false,
  error = false,
  total,
  onMore,
  onRetry,
  onBack,
}: {
  status: InstallStatus
  path: string
  lines: string[]
  loading?: boolean
  error?: boolean
  /** The file's whole diff, in lines, when it comes in pages. */
  total?: number
  /** Another page; absent once everything is here. */
  onMore?: () => void
  onRetry?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  return (
    <>
      <TopBar title={path.split('/').pop() ?? path} subtitle={path} onBack={onBack} />
      <Screen>
        <InstallBanner status={status} />
        <View style={{ paddingHorizontal: theme.space(3), gap: theme.space(2) }}>
          {lines.length > 0 && <DiffView lines={lines} />}
          {error ? (
            <LoadError onRetry={onRetry} />
          ) : loading ? (
            <ListSkeleton rows={4} />
          ) : (
            total !== undefined &&
            total > lines.length && (
              <View style={{ gap: theme.space(2), alignItems: 'center' }}>
                <Text variant="caption" tone="muted">
                  {t('devt.loadedOf', { n: lines.length, total })}
                </Text>
                {onMore && (
                  <Button variant="ghost" onPress={onMore}>
                    {t('devt.showMore')}
                  </Button>
                )}
              </View>
            )
          )}
        </View>
      </Screen>
    </>
  )
}

export type TestFilter = 'all' | 'active' | 'disabled'

/** The «Tests» tab: the inventory with its active / disabled chips. */
export function TestsTab({
  tests,
  filter = 'all',
  loading = false,
  error = false,
  onFilter,
  onRetry,
  emptyText,
}: {
  tests: TestEntry[]
  filter?: TestFilter
  loading?: boolean
  error?: boolean
  onFilter?: (f: TestFilter) => void
  onRetry?: () => void
  /** What an empty list means where it is shown (a task's branch, a project's main). */
  emptyText?: string
}) {
  const t = useT()
  const theme = useTheme()
  if (loading) return <ListSkeleton />
  if (error) return <LoadError text={t('devt.testsError')} onRetry={onRetry} />
  if (tests.length === 0)
    return (
      <EmptyState
        icon="listChecks"
        title={t('devt.testsEmpty')}
        text={emptyText ?? t('devt.testsEmptyText')}
      />
    )
  const shown = tests.filter((x) => filter === 'all' || x.status === filter)
  const badge = (x: TestEntry) =>
    x.status === 'active'
      ? t('devt.active')
      : x.scope === 'permanent'
        ? t('devt.disabledPermanent')
        : x.scope === 'task'
          ? t('devt.disabledTask')
          : t('devt.disabled')
  return (
    <View style={{ gap: theme.space(3) }}>
      <ChipRow>
        {(['all', 'active', 'disabled'] as TestFilter[]).map((f) => (
          <Chip
            key={f}
            selected={f === filter}
            count={tests.filter((x) => f === 'all' || x.status === f).length}
            onPress={() => onFilter?.(f)}
          >
            {t(`devt.tests${f[0].toUpperCase()}${f.slice(1)}`)}
          </Chip>
        ))}
      </ChipRow>
      <View style={{ paddingHorizontal: theme.space(4) }}>
        <RowGroup>
          {shown.map((x, i) => (
            <Row
              key={i}
              title={x.case === '*' ? t('devt.wholeFile', { file: x.file }) : x.case}
              subtitle={x.reason ? `${x.file} · ${t('devt.reason', { reason: x.reason })}` : x.file}
              trailing={<Badge tone={x.status === 'active' ? 'ok' : 'warn'}>{badge(x)}</Badge>}
              lines={2}
            />
          ))}
        </RowGroup>
      </View>
    </View>
  )
}
