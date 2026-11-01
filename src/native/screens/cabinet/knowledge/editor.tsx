/** @jsxRuntime automatic */
/*
  The knowledge editor (#629): title, address, one-line description, type, scope, the text
  with a preview, the two flags — and the conflict block when someone saved first.
*/
import { View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Card } from '../../../Card.tsx'
import { Callout } from '../../../Feedback.tsx'
import { Field, Input, SelectField, Segmented } from '../../../Field.tsx'
import type { InstallStatus } from '../../../model.ts'
import { Prose } from '../../../Prose.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import { typeLabel } from './row.tsx'
import { KNOWLEDGE_TYPES, type KnowledgeForm, type KnowledgeType } from './model.ts'
import { Check, EXAMPLE, NAME_RE } from './editor-parts.tsx'

export function KnowledgeEditorScreen({
  status,
  form,
  editing = false,
  preview = false,
  secretWarning = false,
  conflict,
  taskScope = false,
  busy = false,
  onBack,
  onType,
  onField,
  onPickScope,
  onTogglePreview,
  onTogglePinned,
  onTogglePermanent,
  onTakeCurrent,
  onOverwrite,
  onSave,
}: {
  status: InstallStatus
  form: KnowledgeForm
  editing?: boolean
  preview?: boolean
  secretWarning?: boolean
  /** The version saved by someone else meanwhile. */
  conflict?: { by: string; title: string; description: string; body: string }
  taskScope?: boolean
  busy?: boolean
  onBack?: () => void
  onType?: (type: KnowledgeType) => void
  /** A text field as typed: title, name, description or body. */
  onField?: (field: 'title' | 'name' | 'description' | 'body', text: string) => void
  onPickScope?: () => void
  onTogglePreview?: () => void
  onTogglePinned?: () => void
  onTogglePermanent?: () => void
  onTakeCurrent?: () => void
  onOverwrite?: () => void
  onSave?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const disabled = status.kind !== 'online' || busy
  const nameOk = NAME_RE.test(form.name)
  const ready = nameOk && !!form.title.trim() && !!form.description.trim() && !!form.body.trim()
  const ex = EXAMPLE[form.type]
  return (
    <>
      <TopBar title={editing ? t('kbe.edit') : t('kbe.new')} onBack={onBack} />
      <Screen
        padded
        footer={
          <View style={{ padding: theme.space(3) }}>
            <Button
              variant="primary"
              block
              loading={busy}
              disabled={disabled || !ready}
              onPress={onSave}
            >
              {t('common.save')}
            </Button>
          </View>
        }
      >
        <InstallBanner status={status} />
        <Text variant="caption" tone="muted">
          {t('kbe.intro')}
        </Text>
        {conflict && (
          <Card tone="muted" style={{ gap: theme.space(2) }}>
            <Text variant="caption" tone="warning">
              {t('kbe.conflict', { by: conflict.by })}
            </Text>
            <Text variant="label">{conflict.title}</Text>
            <Text variant="caption" tone="fg2">
              {conflict.description}
            </Text>
            <Prose markdown={conflict.body ?? ''} />
            <Button size="sm" onPress={onTakeCurrent}>
              {t('kbe.takeCurrent')}
            </Button>
            <Button size="sm" variant="destructive" onPress={onOverwrite}>
              {t('kbe.overwrite')}
            </Button>
          </Card>
        )}
        <Field label={t('kbe.title')} required>
          <Input
            value={form.title}
            placeholder={t('kbe.titlePlaceholder', { example: t(ex.title) })}
            editable={!disabled}
            onChangeText={(v) => onField?.('title', v)}
          />
        </Field>
        <Field
          label={t('kbe.name')}
          hint={nameOk || form.name === '' ? t('kbe.nameHint') : undefined}
          error={!nameOk && form.name !== '' ? t('kbe.nameHint') : undefined}
        >
          <Input
            value={form.name}
            placeholder="sborka-trebuet-tulcheyn"
            autoCapitalize="none"
            editable={!disabled}
            onChangeText={(v) => onField?.('name', v)}
          />
        </Field>
        <Field label={t('kbe.description')} hint={t('kbe.descriptionHint')} required>
          <Input
            value={form.description}
            placeholder={t('kbe.titlePlaceholder', { example: t(ex.description) })}
            editable={!disabled}
            onChangeText={(v) => onField?.('description', v)}
          />
        </Field>
        <Field
          label={t('kbe.type')}
          hint={t(`kb.hint${form.type[0].toUpperCase()}${form.type.slice(1)}`)}
        >
          <Segmented
            value={form.type}
            onChange={(id) => onType?.(id as KnowledgeType)}
            options={KNOWLEDGE_TYPES.map((k) => ({ id: k, label: typeLabel(t, k) }))}
          />
        </Field>
        <Field
          label={t('kbe.scope')}
          hint={taskScope ? t('kbe.scopeTaskHint') : t('kbe.scopeHint')}
        >
          <SelectField
            value={form.scope}
            placeholder={t('kbe.scopeOrg')}
            icon="folderGit"
            onPress={onPickScope}
            disabled={disabled}
          />
        </Field>
        <Field label={t('kbe.body')} hint={t('kbe.bodyHint')} required>
          <Button
            size="sm"
            variant="ghost"
            leadingIcon={preview ? 'pencil' : 'eye'}
            onPress={onTogglePreview}
          >
            {preview ? t('kbe.editText') : t('kbe.preview')}
          </Button>
          {preview ? (
            <Card>
              {form.body.trim() ? (
                <Prose markdown={form.body} />
              ) : (
                <Text tone="muted">{t('kbe.noText')}</Text>
              )}
            </Card>
          ) : (
            <Input
              value={form.body}
              placeholder={t('kbe.bodyPlaceholder', { example: t(ex.description) })}
              rows={8}
              editable={!disabled}
              onChangeText={(v) => onField?.('body', v)}
            />
          )}
        </Field>
        {secretWarning && <Callout tone="warn">{t('kbe.secret')}</Callout>}
        <Check
          label={t('kbe.pin')}
          hint={t('kbe.pinHint')}
          checked={form.pinned}
          disabled={disabled}
          onPress={onTogglePinned}
        />
        <Check
          label={t('kbe.permanent')}
          hint={t('kbe.permanentHint')}
          checked={form.permanent}
          disabled={disabled}
          onPress={onTogglePermanent}
        />
      </Screen>
    </>
  )
}
