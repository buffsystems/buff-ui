/** @jsxRuntime automatic */
/*
  A project's tests (#644): the toolbox's own list (`make list-tests`), captured on the main
  branch — what the cabinet's «Тесты» of the development tools shows — with when it was taken,
  a refresh, and why the last capture failed.
*/
import { View } from 'react-native'
import { IconButton } from '../../../Button.tsx'
import { Callout } from '../../../Feedback.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { TestsTab, type TestFilter } from './changes.tsx'
import type { TestEntry } from './model.ts'

export function ProjectTestsScreen({
  status,
  project,
  tests,
  capturedAt,
  refreshing = false,
  stale = false,
  failure,
  filter = 'all',
  loading = false,
  error = false,
  onFilter,
  onRefresh,
  onRetry,
  onBack,
}: {
  status: InstallStatus
  project: string
  tests: TestEntry[]
  /** When the list was taken, as a person reads it; none — never yet. */
  capturedAt?: string
  refreshing?: boolean
  /** Main moved since: a newer list is being taken. */
  stale?: boolean
  /** The last capture failed and none is running: why. */
  failure?: string
  filter?: TestFilter
  loading?: boolean
  error?: boolean
  onFilter?: (f: TestFilter) => void
  onRefresh?: () => void
  onRetry?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = status.kind === 'online'
  return (
    <>
      <TopBar
        title={t('devt.projectTests')}
        subtitle={project}
        onBack={onBack}
        actions={
          onRefresh && (
            <IconButton
              icon="refreshCw"
              label={t('devt.refreshTests')}
              onPress={onRefresh}
              disabled={!live || refreshing}
            />
          )
        }
      />
      <Screen>
        <InstallBanner status={status} />
        <View style={{ paddingHorizontal: theme.space(4), gap: theme.space(2) }}>
          <Text variant="caption" tone="muted">
            {refreshing
              ? t('devt.testsRefreshing')
              : capturedAt
                ? t('devt.testsCaptured', { when: capturedAt }) +
                  (stale ? ` · ${t('devt.testsStale')}` : '')
                : t('devt.testsNever')}
          </Text>
          {failure && !refreshing && (
            <Callout tone="crit">{t('devt.testsFailed', { why: failure })}</Callout>
          )}
        </View>
        <TestsTab
          tests={tests}
          filter={filter}
          loading={loading}
          error={error}
          onFilter={onFilter}
          onRetry={onRetry}
          emptyText={t('devt.projectTestsEmpty')}
        />
      </Screen>
    </>
  )
}
