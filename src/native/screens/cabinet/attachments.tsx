/** @jsxRuntime automatic */
/*
  Attachments (#629): a row with its transfer progress, the attach sheet with a phone's
  three sources, and the composer pinned under a thread.
*/
import { Image, View } from 'react-native'
import { Button, IconButton } from '../../Button.tsx'
import { Input } from '../../Field.tsx'
import { Icon } from '../../Icon.tsx'
import type { IconName } from '../../icons.ts'
import type { Translate } from '../../i18n.ts'
import type { Attachment, PicturePolicy } from '../../model.ts'
import { Row, RowGroup } from '../../Row.tsx'
import { Sheet } from '../../Sheet.tsx'
import { useT, useTheme } from '../../theme.tsx'

/** «12 КБ» / «1,4 МБ». */
export function formatSize(t: Translate, bytes: number): string {
  if (bytes >= 1024 * 1024) return t('cabinet.sizeMb', { n: (bytes / 1024 / 1024).toFixed(1) })
  if (bytes >= 1024) return t('cabinet.sizeKb', { n: Math.round(bytes / 1024) })
  return t('cabinet.sizeB', { n: bytes })
}

/** One attachment: its icon, name, size, and the transfer bar while it uploads. */
export function AttachmentRow({
  attachment,
  onOpen,
  onRemove,
  disabled = false,
}: {
  attachment: Attachment
  onOpen?: () => void
  onRemove?: () => void
  disabled?: boolean
}) {
  const t = useT()
  const theme = useTheme()
  const progress = attachment.progress
  const subtitle =
    progress !== undefined && progress < 1
      ? t('cabinet.uploading', { pct: Math.round(progress * 100) })
      : formatSize(t, attachment.size)
  // A picture shows itself once the host has its bytes (#27); until then — its icon.
  const thumb = attachment.kind === 'image' && attachment.preview
  return (
    <View>
      <Row
        leading={
          thumb ? (
            <Image
              source={{ uri: attachment.preview }}
              accessibilityIgnoresInvertColors
              style={{
                width: 56,
                height: 56,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.muted,
              }}
              resizeMode="cover"
            />
          ) : undefined
        }
        icon={attachment.kind === 'image' ? 'image' : 'fileText'}
        title={attachment.name}
        subtitle={subtitle}
        trailing={
          !onRemove && <Icon name="download" size={18} color={theme.colors.mutedForeground} />
        }
        actions={
          onRemove && (
            <IconButton
              icon="x"
              label={t('cabinet.remove')}
              size="sm"
              onPress={onRemove}
              disabled={disabled}
            />
          )
        }
        onPress={onOpen}
        disabled={disabled}
      />
      {progress !== undefined && progress < 1 && (
        <View
          style={{
            height: 3,
            marginHorizontal: theme.space(4),
            marginBottom: theme.space(2),
            borderRadius: 3,
            backgroundColor: theme.colors.muted2,
          }}
        >
          <View
            style={{
              width: `${Math.round(progress * 100)}%`,
              height: 3,
              borderRadius: 3,
              backgroundColor: theme.colors.primary,
            }}
          />
        </View>
      )}
    </View>
  )
}

/** Why the camera and the gallery are off here, naming the model when known (#27). */
export function noPicturesText(t: Translate, pictures: PicturePolicy): string {
  return pictures.model
    ? t('cabinet.noPictures', { model: pictures.model })
    : t('cabinet.noPicturesHere')
}

/** The attach sheet: the three sources a phone has. The camera and the gallery give pictures,
 *  so where the dialog's model does not see them they are off and say why (#27). */
export function AttachSourceSheet({
  onCamera,
  onGallery,
  onFile,
  onClose,
  pictures = { images: true, model: null },
}: {
  onCamera?: () => void
  onGallery?: () => void
  onFile?: () => void
  onClose?: () => void
  pictures?: PicturePolicy
}) {
  const t = useT()
  const off = pictures.images ? undefined : noPicturesText(t, pictures)
  const options: { icon: IconName; label: string; onPress?: () => void; off?: string }[] = [
    { icon: 'camera', label: t('cabinet.attachCamera'), onPress: onCamera, off },
    { icon: 'image', label: t('cabinet.attachGallery'), onPress: onGallery, off },
    { icon: 'paperclip', label: t('cabinet.attachFile'), onPress: onFile },
  ]
  return (
    <Sheet title={t('cabinet.attach')} onClose={onClose}>
      <RowGroup>
        {options.map((o) => (
          <Row
            key={o.icon}
            icon={o.icon}
            title={o.label}
            subtitle={o.off}
            lines={1}
            onPress={o.onPress}
            disabled={!!o.off}
            chevron={!o.off}
          />
        ))}
      </RowGroup>
    </Sheet>
  )
}

/** A text composer pinned under a thread: attach, the text, send. */
export function ThreadComposer({
  value = '',
  placeholder,
  staged = [],
  busy = false,
  disabled = false,
  canAttach = true,
  onAttach,
  onRemoveStaged,
  onSend,
  onValue,
}: {
  value?: string
  /** The message as typed. */
  onValue?: (text: string) => void
  placeholder: string
  staged?: Attachment[]
  busy?: boolean
  disabled?: boolean
  canAttach?: boolean
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  onSend?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const empty = value.trim() === '' && staged.length === 0
  return (
    <View style={{ padding: theme.space(3), gap: theme.space(2) }}>
      {staged.length > 0 && (
        <RowGroup>
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: theme.space(2) }}>
        {canAttach && (
          <IconButton
            icon="paperclip"
            label={t('cabinet.attach')}
            onPress={onAttach}
            disabled={disabled || busy}
          />
        )}
        <View style={{ flex: 1 }}>
          <Input
            value={value}
            placeholder={placeholder}
            rows={1}
            editable={!disabled && !busy}
            onChangeText={onValue}
          />
        </View>
        <Button
          variant="primary"
          leadingIcon="send"
          accessibilityLabel={t('common.send')}
          // While Buff answers the button just rests: the thinking line shows the wait, a
          // brain in a bare button read as a «brain» button (#692).
          disabled={disabled || busy || empty}
          onPress={onSend}
          style={{ paddingHorizontal: 12 }}
        >
          {''}
        </Button>
      </View>
    </View>
  )
}
