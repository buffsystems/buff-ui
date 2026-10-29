/** @jsxRuntime automatic */
/*
  The sheet that adds or edits a finding (#629) — also «Send for rework» when it starts one.
*/
import { Button } from '../../../Button.tsx'
import { Field, Input } from '../../../Field.tsx'
import { RowGroup } from '../../../Row.tsx'
import { Sheet } from '../../../Sheet.tsx'
import { useT } from '../../../theme.tsx'
import { AttachmentRow } from '../attachments.tsx'
import type { FindingDraft } from './model.ts'

/** Add / edit a finding — also «Send for rework» when it starts the rework. */
export function FindingSheet({
  mode,
  draft,
  busy = false,
  onTitle,
  onDetail,
  onAttach,
  onRemoveAttachment,
  onSave,
  onClose,
}: {
  mode: 'add' | 'edit' | 'rework'
  draft: FindingDraft
  busy?: boolean
  onTitle?: (text: string) => void
  onDetail?: (text: string) => void
  onAttach?: () => void
  onRemoveAttachment?: (id: string) => void
  onSave?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const title =
    mode === 'add'
      ? t('review.newFinding')
      : mode === 'edit'
        ? t('review.editFinding')
        : t('rvd.reworkSheet')
  return (
    <Sheet
      title={title}
      onClose={onClose}
      footer={
        <Button
          variant="primary"
          block
          loading={busy}
          disabled={draft.title.trim() === ''}
          onPress={onSave}
        >
          {mode === 'rework' ? t('rvd.reworkSend') : t('common.save')}
        </Button>
      }
    >
      <Input
        value={draft.title}
        placeholder={mode === 'rework' ? t('rvd.reworkWhat') : t('review.findingTitle')}
        onChangeText={onTitle}
      />
      <Input
        value={draft.detail}
        placeholder={t('review.findingDetail')}
        rows={3}
        onChangeText={onDetail}
      />
      {mode !== 'edit' && (
        <Field label={t('cabinet.attachments')} hint={t('review.findingAttachHint')}>
          {draft.attachments.length > 0 && (
            <RowGroup>
              {draft.attachments.map((a) => (
                <AttachmentRow
                  key={a.id}
                  attachment={a}
                  onRemove={() => onRemoveAttachment?.(a.id)}
                />
              ))}
            </RowGroup>
          )}
          <Button variant="ghost" leadingIcon="paperclip" onPress={onAttach}>
            {t('cabinet.attach')}
          </Button>
        </Field>
      )}
    </Sheet>
  )
}
