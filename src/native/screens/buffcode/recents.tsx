/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Input } from '../../Field.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { BcSession } from './model.ts'
import { SessionGroups } from './sessions.tsx'
import { Gutter, skeletonRows } from './shell.tsx'

/** The «Recent» view of the machine's main screen (#938): a search over the sessions of all the projects, then the sessions. */
export function Recents({
  sessions,
  loading,
  query,
  onQuery,
  onOpen,
  onMore,
  onNew,
}: {
  sessions: BcSession[]
  loading: boolean
  query: string
  onQuery?: (text: string) => void
  onOpen?: (projectId: string, id: string) => void
  /** There are more sessions than shown: «Show more» asks for the next ones. */
  onMore?: () => void
  onNew?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  if (!loading && sessions.length === 0 && !query)
    return (
      <EmptyState
        icon="messageSquare"
        title={t('buffcode.noSessions')}
        text={t('buffcode.noSessionsText')}
        action={
          onNew ? { label: t('buffcode.newSession'), icon: 'plus', onPress: onNew } : undefined
        }
      />
    )
  return (
    <View style={{ paddingTop: theme.space(3), gap: theme.space(3) }}>
      <Gutter>
        <Input
          icon="search"
          placeholder={t('buffcode.searchRecent')}
          value={query}
          onChangeText={onQuery}
        />
      </Gutter>
      {loading ? (
        skeletonRows(theme, 5)
      ) : sessions.length === 0 ? (
        <Text tone="muted" align="center" style={{ padding: theme.space(6) }}>
          {t('buffcode.noResults')}
        </Text>
      ) : (
        <>
          <SessionGroups
            sessions={sessions}
            lead
            onOpen={(id) => {
              const found = sessions.find((s) => s.id === id)
              if (found) onOpen?.(found.projectId, id)
            }}
          />
          {onMore && (
            <Gutter>
              <Button variant="ghost" onPress={onMore}>
                {t('common.showMore')}
              </Button>
            </Gutter>
          )}
        </>
      )}
    </View>
  )
}
