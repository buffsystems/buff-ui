/** @jsxRuntime automatic */
import { ScrollView, View } from 'react-native'
import { StatusDot } from '../../Badge.tsx'
import { Button, IconButton } from '../../Button.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Input } from '../../Field.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { SideMessage } from './model.ts'
import { isLive, MachineShell } from './shell.tsx'

/** One message of the side conversation; an answer offers «to the main conversation». */
function SideBubble({
  message,
  disabled,
  onQuote,
}: {
  message: SideMessage
  disabled: boolean
  onQuote?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  if (message.role === 'user') {
    return (
      <View
        style={{
          alignSelf: 'flex-end',
          maxWidth: '88%',
          backgroundColor: c.brandSoft,
          borderRadius: theme.radius.lg,
          borderBottomRightRadius: theme.radius.sm,
          padding: theme.space(3),
        }}
      >
        <Text selectable style={{ color: c.brandSoftForeground }}>
          {message.text}
        </Text>
      </View>
    )
  }
  return (
    <View style={{ gap: theme.space(2) }}>
      <Prose markdown={message.text} />
      {message.tools && message.tools.length > 0 && (
        <Text variant="caption" tone="muted">
          {t('buffcode.sideTools', { tools: message.tools.join(', ') })}
        </Text>
      )}
      <Button
        size="sm"
        variant="ghost"
        leadingIcon="messageSquare"
        disabled={disabled}
        onPress={onQuote}
      >
        {t('buffcode.sideToMain')}
      </Button>
    </View>
  )
}

/** A side conversation: a branch of the main session that does not change it. */
export function SideConversationScreen({
  install,
  status,
  title,
  messages,
  running = false,
  draft = '',
  onBack,
  onDraft,
  onSend,
  onStop,
  onQuote,
  onNew,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  title?: string
  messages: SideMessage[]
  running?: boolean
  draft?: string
  onBack?: () => void
  onDraft?: (text: string) => void
  onSend?: () => void
  onStop?: () => void
  onQuote?: (id: string) => void
  onNew?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  return (
    <MachineShell
      install={install}
      status={status}
      title={title ?? t('buffcode.sideTitle')}
      subtitle={t('buffcode.sideTitle')}
      onBack={onBack}
      onRepair={onRepair}
      scroll={false}
      actions={
        <IconButton icon="plus" label={t('buffcode.sideNew')} onPress={onNew} disabled={!live} />
      }
      footer={
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: theme.space(2),
            padding: theme.space(3),
          }}
        >
          <View style={{ flex: 1 }}>
            <Input
              rows={2}
              placeholder={t('buffcode.sidePlaceholder')}
              value={draft}
              onChangeText={onDraft}
              editable={live}
            />
          </View>
          {running ? (
            <IconButton
              icon="square"
              label={t('buffcode.stop')}
              variant="destructive"
              onPress={onStop}
              disabled={!live}
            />
          ) : (
            <IconButton
              icon="send"
              label={t('common.send')}
              variant="primary"
              onPress={onSend}
              disabled={!live || !draft.trim()}
            />
          )}
        </View>
      }
    >
      {messages.length === 0 ? (
        <EmptyState
          icon="messageSquare"
          title={t('buffcode.sideTitle')}
          text={t('buffcode.sideEmpty')}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: theme.space(4), gap: theme.space(4) }}>
          {messages.map((message) => (
            <SideBubble
              key={message.id}
              message={message}
              disabled={!live}
              onQuote={() => onQuote?.(message.id)}
            />
          ))}
          {running && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <StatusDot tone="info" pulse size={6} />
              <Text variant="caption" tone="muted">
                {t('buffcode.sideAnswering')}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </MachineShell>
  )
}
