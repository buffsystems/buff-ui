/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Callout } from '../../Feedback.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { Gutter, isLive, MachineShell, skeletonRows } from '../buffcode/shell.tsx'
import { groupKey, groupState, typeLabel, type NotificationGroup } from './model.ts'
import { Toggle } from './toggle.tsx'

/**
 * Which events of one install reach the phone: a switch per type, grouped as the cabinet's
 * web-push settings; the group's switch flips the whole group. Saved on the install.
 */
export function NotificationSettingsScreen({
  install,
  status,
  groups,
  enabled,
  pushAllowed = true,
  loading = false,
  error,
  canEdit = true,
  onRetry,
  onToggleType,
  onToggleGroup,
  onOpenSystem,
  onBack,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  groups: NotificationGroup[]
  enabled: ReadonlySet<string>
  /** The system lets the app notify; else only the list fills. */
  pushAllowed?: boolean
  loading?: boolean
  /** The install did not return its types: the reason, with a retry, in place of the switches. */
  error?: string
  /** May change the types here (#666); a demo install only shows them. */
  canEdit?: boolean
  onRetry?: () => void
  onToggleType?: (type: string, on: boolean) => void
  onToggleGroup?: (group: string, on: boolean) => void
  onOpenSystem?: () => void
  onBack?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  return (
    <MachineShell
      install={install}
      status={status}
      title={t('notif.settings')}
      onBack={onBack}
      onRepair={onRepair}
    >
      <View style={{ paddingTop: theme.space(3) }}>
        <Gutter gap={theme.space(4)}>
          {!pushAllowed && (
            <Callout
              tone="warn"
              icon="bellOff"
              title={t('notif.pushOff')}
              action={
                <Button size="sm" leadingIcon="settings" onPress={onOpenSystem}>
                  {t('notif.openSystem')}
                </Button>
              }
            >
              {t('notif.pushOffText')}
            </Callout>
          )}
          <View style={{ gap: 2 }}>
            <Text variant="heading">{t('notif.types')}</Text>
            <Text variant="caption" tone="muted">
              {t('notif.typesHint')}
            </Text>
          </View>
          {error ? (
            <Callout
              tone="crit"
              action={
                onRetry && (
                  <Button size="sm" leadingIcon="refreshCw" onPress={onRetry}>
                    {t('common.retry')}
                  </Button>
                )
              }
            >
              {error}
            </Callout>
          ) : loading ? (
            skeletonRows(theme, 4)
          ) : (
            groups.map((group) => {
              const state = groupState(group.types, enabled)
              return (
                <RowGroup key={group.key} title={t(groupKey(group.key))}>
                  {[
                    <Row
                      key="group"
                      title={t('notif.wholeGroup')}
                      trailing={
                        <Toggle
                          value={state === 'all'}
                          mixed={state === 'some'}
                          disabled={!live || !canEdit}
                          label={`${t(groupKey(group.key))}: ${t('notif.wholeGroup')}`}
                          onChange={(on) => onToggleGroup?.(group.key, on)}
                        />
                      }
                    />,
                    ...group.types.map((type) => (
                      <Row
                        key={type}
                        title={typeLabel(t, type)}
                        lines={2}
                        trailing={
                          <Toggle
                            value={enabled.has(type)}
                            disabled={!live || !canEdit}
                            label={typeLabel(t, type)}
                            onChange={(on) => onToggleType?.(type, on)}
                          />
                        }
                      />
                    )),
                  ]}
                </RowGroup>
              )
            })
          )}
        </Gutter>
      </View>
    </MachineShell>
  )
}
