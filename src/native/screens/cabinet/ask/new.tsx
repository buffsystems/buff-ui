/** @jsxRuntime automatic */
/*
  A new question (#629): the intro for the kind of place asked (project / space / task
  review), the text and attachments. The cabinet never picks a model — only Buff Code does.
*/
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Callout } from '../../../Feedback.tsx'
import { Input } from '../../../Field.tsx'
import { RowGroup } from '../../../Row.tsx'
import type { Attachment, InstallStatus } from '../../../model.ts'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { AttachmentRow } from '../attachments.tsx'
import type { AskKind } from './model.ts'

const KIND_SUFFIX: Record<AskKind, string> = {
  project: 'Project',
  space: 'Space',
  review: 'Review',
}

export function NewQuestionScreen({
  status,
  kind = 'project',
  place,
  text = '',
  staged = [],
  canCreate = true,
  demo = false,
  busy = false,
  onBack,
  onAttach,
  onRemoveStaged,
  onSend,
  onText,
}: {
  status: InstallStatus
  kind?: AskKind
  /** «org · project» or «Ревью задачи #N». */
  place: string
  text?: string
  staged?: Attachment[]
  canCreate?: boolean
  demo?: boolean
  busy?: boolean
  onBack?: () => void
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  onSend?: () => void
  /** The question as typed. */
  onText?: (text: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const disabled = status.kind !== 'online' || busy || !canCreate
  const k = KIND_SUFFIX[kind]
  return (
    <>
      <TopBar title={t('ask.new')} subtitle={place} onBack={onBack} />
      <Screen
        padded
        footer={
          <View style={{ padding: theme.space(3) }}>
            <Button
              variant="primary"
              leadingIcon="send"
              block
              loading={busy}
              disabled={disabled || text.trim() === ''}
              onPress={onSend}
            >
              {t('common.send')}
            </Button>
          </View>
        }
      >
        <InstallBanner status={status} />
        {!canCreate && (
          <Callout tone="neutral">{demo ? t('ask.noCreateDemo') : t('ask.noCreateRight')}</Callout>
        )}
        <Text variant="title">{t(`ask.title${k}`)}</Text>
        <Text tone="fg2">{t(`ask.intro${k}`)}</Text>
        <Input
          value={text}
          placeholder={t(`ask.placeholder${k}`)}
          rows={5}
          editable={!disabled}
          onChangeText={onText}
        />
        {staged.length > 0 && (
          <RowGroup title={t('cabinet.attachments')}>
            {staged.map((a) => (
              <AttachmentRow
                key={a.id}
                attachment={a}
                onRemove={() => onRemoveStaged?.(a.id)}
                disabled={disabled}
              />
            ))}
          </RowGroup>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Button
            variant="ghost"
            leadingIcon="paperclip"
            onPress={onAttach}
            disabled={disabled || staged.length >= 3}
          >
            {t('cabinet.attach')}
          </Button>
          <Text variant="caption" tone="muted">
            {t('ask.attachHint')}
          </Text>
        </View>
      </Screen>
    </>
  )
}
