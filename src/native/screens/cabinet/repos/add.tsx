/** @jsxRuntime automatic */
/*
  Adding and removing a repository (#629): the web's «Add a repository» modal as a sheet —
  URL, name, token, the optional development project — and the remove confirmation.
*/
import { Pressable, View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Spinner } from '../../../Feedback.tsx'
import { Field, Input } from '../../../Field.tsx'
import { Icon } from '../../../Icon.tsx'
import { ConfirmSheet, Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import type { AddRepoForm } from './model.ts'

const DEV_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

export function urlValid(url: string): boolean {
  try {
    const u = new URL(url.trim())
    return (
      (u.protocol === 'https:' || u.protocol === 'http:') &&
      u.pathname.split('/').filter(Boolean).length >= 2
    )
  } catch {
    return false
  }
}

/** The default development-project name: the repo name, or the URL's last segment, + `_dev`. */
export function defaultDevName(form: AddRepoForm): string {
  const base =
    form.name.trim() ||
    form.url
      .trim()
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/\.git$/, '') ||
    'project'
  return `${base}_dev`
}

export function AddRepoSheet({
  form,
  busy = false,
  statusText,
  error,
  onToggleCreateDev,
  onField,
  onImport,
  onClose,
}: {
  form: AddRepoForm
  busy?: boolean
  statusText?: string
  error?: string
  onToggleCreateDev?: () => void
  /** A field as typed. */
  onField?: (field: 'url' | 'name' | 'token' | 'devName', text: string) => void
  onImport?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const url = form.url.trim()
  const urlOk = urlValid(url)
  const devName = form.devName.trim() || defaultDevName(form)
  const devOk = !form.createDev || DEV_NAME_RE.test(devName)
  if (busy)
    return (
      <Sheet title={t('repos.add')} onClose={onClose}>
        <View style={{ alignItems: 'center', gap: theme.space(3), padding: theme.space(4) }}>
          <Spinner size="large" />
          <Text>{statusText ?? t('repos.importing')}</Text>
          <Text variant="caption" tone="muted" align="center">
            {t('repos.importingHint')}
          </Text>
          <Button onPress={onClose}>{t('common.close')}</Button>
        </View>
      </Sheet>
    )
  return (
    <Sheet
      title={t('repos.add')}
      onClose={onClose}
      footer={
        <Button
          variant="primary"
          leadingIcon="download"
          block
          disabled={!urlOk || !devOk}
          onPress={onImport}
        >
          {t('repos.import')}
        </Button>
      }
    >
      <Field label={t('repos.url')} error={url && !urlOk ? t('repos.urlError') : error} required>
        <Input
          value={form.url}
          placeholder="https://gitlab.com/group/project"
          autoCapitalize="none"
          keyboardType="url"
          onChangeText={(v) => onField?.('url', v)}
        />
      </Field>
      <Field label={t('repos.name')}>
        <Input
          value={form.name}
          placeholder="project"
          autoCapitalize="none"
          onChangeText={(v) => onField?.('name', v)}
        />
      </Field>
      <Field label={t('repos.token')}>
        <Input
          value={form.token}
          placeholder={t('repos.tokenPlaceholder')}
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(v) => onField?.('token', v)}
        />
      </Field>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: form.createDev }}
        accessibilityLabel={t('repos.createDev')}
        onPress={onToggleCreateDev}
        style={{
          flexDirection: 'row',
          gap: theme.space(3),
          minHeight: theme.touch,
          alignItems: 'flex-start',
        }}
      >
        <Icon
          name={form.createDev ? 'checkCircle' : 'square'}
          size={20}
          color={form.createDev ? c.primary : c.mutedForeground}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label">{t('repos.createDev')}</Text>
          <Text variant="caption" tone="muted">
            {t('repos.createDevHint')}
          </Text>
        </View>
      </Pressable>
      {form.createDev && (
        <Field label={t('repos.devName')} error={devOk ? undefined : t('devt.projectNameError')}>
          <Input
            value={form.devName}
            placeholder={defaultDevName(form)}
            autoCapitalize="none"
            onChangeText={(v) => onField?.('devName', v)}
          />
        </Field>
      )}
    </Sheet>
  )
}

export function RemoveRepoSheet({
  name,
  onConfirm,
  onClose,
}: {
  name: string
  onConfirm?: () => void
  onClose?: () => void
}) {
  const t = useT()
  return (
    <ConfirmSheet
      title={t('repos.removeTitle', { name })}
      text={t('repos.removeText')}
      confirmLabel={t('repos.remove')}
      destructive
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
