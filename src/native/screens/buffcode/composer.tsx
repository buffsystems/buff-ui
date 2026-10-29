/** @jsxRuntime automatic */
import { TextInput, View } from 'react-native'
import { NO_WEB_OUTLINE } from '../../Field.tsx'
import { IconButton } from '../../Button.tsx'
import type { Attachment } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { AttachmentChip } from './composer-parts.tsx'

/**
 * The composer under the timeline: attachments, the text, the chips (model, mode, agent),
 * attach / commands / send — or stop while the agent runs. Every control is disabled offline.
 */
export function Composer({
  value = '',
  running = false,
  disabled = false,
  attachments = [],
  chips,
  onChange,
  onAttach,
  onRemoveAttachment,
  onCommands,
  onSend,
  onStop,
}: {
  value?: string
  running?: boolean
  disabled?: boolean
  attachments?: Attachment[]
  /** The model / mode / agent chips, built by the screen. */
  chips?: React.ReactNode
  onChange?: (text: string) => void
  onAttach?: () => void
  onRemoveAttachment?: (id: string) => void
  onCommands?: () => void
  onSend?: () => void
  onStop?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const canSend = !disabled && (value.trim().length > 0 || attachments.length > 0)
  return (
    <View style={{ padding: theme.space(3), gap: theme.space(2) }}>
      {attachments.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {attachments.map((a) => (
            <AttachmentChip
              key={a.id}
              attachment={a}
              disabled={disabled}
              onRemove={() => onRemoveAttachment?.(a.id)}
            />
          ))}
        </View>
      )}
      <View
        style={{
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: c.borderStrong,
          backgroundColor: c.card,
          padding: theme.space(2),
          gap: theme.space(2),
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <TextInput
          multiline
          editable={!disabled}
          value={value}
          onChangeText={onChange}
          placeholder={t('buffcode.promptPlaceholder')}
          placeholderTextColor={c.mutedForeground}
          accessibilityLabel={t('buffcode.promptPlaceholder')}
          style={{
            minHeight: 44,
            maxHeight: 120,
            paddingHorizontal: 6,
            paddingTop: 8,
            fontFamily: theme.font.sans,
            fontSize: 15,
            lineHeight: 21,
            color: c.foreground,
            ...NO_WEB_OUTLINE,
            textAlignVertical: 'top',
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <IconButton
            icon="paperclip"
            label={t('buffcode.attach')}
            onPress={onAttach}
            size="sm"
            disabled={disabled}
          />
          <IconButton
            icon="sparkles"
            label={t('buffcode.commands')}
            onPress={onCommands}
            size="sm"
            disabled={disabled}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 4,
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            {chips}
          </View>
          {running ? (
            <IconButton
              icon="square"
              label={t('buffcode.stop')}
              onPress={onStop}
              variant="destructive"
              size="sm"
              disabled={disabled}
            />
          ) : (
            <IconButton
              icon="send"
              label={t('common.send')}
              onPress={onSend}
              variant="primary"
              size="sm"
              disabled={!canSend}
            />
          )}
        </View>
      </View>
    </View>
  )
}

/** The attach menu: the camera, the gallery, a file. */
export function AttachSheet({
  onCamera,
  onGallery,
  onFile,
  onClose,
}: {
  onCamera?: () => void
  onGallery?: () => void
  onFile?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <Sheet title={t('buffcode.attach')} onClose={onClose}>
      <RowGroup>
        <Row icon="camera" title={t('buffcode.attachCamera')} onPress={onCamera} />
        <Row icon="image" title={t('buffcode.attachGallery')} onPress={onGallery} />
        <Row icon="fileText" title={t('buffcode.attachFile')} onPress={onFile} />
      </RowGroup>
    </Sheet>
  )
}
