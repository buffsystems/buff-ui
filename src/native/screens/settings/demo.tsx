/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Card } from '../../Card.tsx'
import { Callout, EmptyState } from '../../Feedback.tsx'
import { Icon } from '../../Icon.tsx'
import { Screen, TopBar } from '../../Screen.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { Gutter } from '../buffcode/shell.tsx'

export type DemoState = 'idle' | 'connecting' | 'connected' | 'failed'

/** The demo install for store reviewers: one tap pairs the phone with buff.systems' demo. */
export function DemoInstallScreen({
  state = 'idle',
  onConnect,
  onOpen,
  onBack,
}: {
  state?: DemoState
  onConnect?: () => void
  onOpen?: () => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  if (state === 'connected') {
    return (
      <>
        <TopBar title={t('settings.demo')} onBack={onBack} />
        <Screen scroll={false}>
          <EmptyState
            icon="checkCircle"
            title={t('settings.demoConnected')}
            text={t('settings.demoConnectedText')}
            action={{ label: t('common.open'), icon: 'externalLink', onPress: onOpen }}
          />
        </Screen>
      </>
    )
  }
  return (
    <>
      <TopBar title={t('settings.demo')} onBack={onBack} />
      <Screen
        footer={
          <View style={{ padding: theme.space(4) }}>
            <Button
              variant="primary"
              block
              leadingIcon="eye"
              loading={state === 'connecting'}
              onPress={onConnect}
            >
              {t(state === 'connecting' ? 'settings.demoConnecting' : 'settings.demoConnect')}
            </Button>
          </View>
        }
      >
        <View style={{ paddingTop: theme.space(6) }}>
          <Gutter gap={theme.space(4)}>
            <View style={{ alignItems: 'center', gap: theme.space(3) }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  backgroundColor: c.brandSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="eye" size={36} color={c.primary} strokeWidth={1.5} />
              </View>
              <Text variant="title" align="center">
                {t('settings.demoTitle')}
              </Text>
              <Text tone="fg2" align="center">
                {t('settings.demoText')}
              </Text>
            </View>
            {state === 'failed' && <Callout tone="crit">{t('settings.demoFailed')}</Callout>}
            <Card tone="muted">
              <Text variant="caption" tone="muted">
                {t('settings.demoNote')}
              </Text>
            </Card>
          </Gutter>
        </View>
      </Screen>
    </>
  )
}
