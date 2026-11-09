/*
  The share sheet (#821, epic #769): a public link to a dialog — the whole dialog or the messages
  picked here, a title, an optional password and expiry, whether tool calls show and whether the
  page follows the dialog live. Once made, the address with copy, open and the no-password warning.
*/
import { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Choice } from '../../Choice.tsx'
import { Callout } from '../../Feedback.tsx'
import { Field, Input, Segmented } from '../../Field.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import {
  EXPIRY_PRESETS,
  expiresAtFor,
  type ExpiryPreset,
  type MadeLink,
  type MessagePreview,
  type ShareForm,
} from './model.ts'

export const EXPIRY_KEY: Record<ExpiryPreset, string> = {
  none: 'share.expiryNone',
  '1h': 'share.expiry1h',
  '1d': 'share.expiry1d',
  '7d': 'share.expiry7d',
  '30d': 'share.expiry30d',
}

export function ShareSheet({
  sourceTitle,
  previews,
  preselect = [],
  busy = false,
  error,
  made,
  onCreate,
  onCopy,
  onOpen,
  onClose,
}: {
  sourceTitle: string
  previews: MessagePreview[]
  /** Messages picked from the start (the sheet opened from one of them). */
  preselect?: string[]
  busy?: boolean
  error?: string
  /** The link once the host made it: the sheet shows the address instead of the form. */
  made?: MadeLink
  onCreate?: (form: ShareForm) => void
  onCopy?: (link: string) => void
  onOpen?: (link: string) => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [mode, setMode] = useState<'all' | 'some'>(preselect.length ? 'some' : 'all')
  const [picked, setPicked] = useState<Set<string>>(() => new Set(preselect))
  const [title, setTitle] = useState(sourceTitle)
  const [pass, setPass] = useState('')
  const [expiry, setExpiry] = useState<ExpiryPreset>('none')
  const [tools, setTools] = useState(false)
  const [live, setLive] = useState(false)
  const [problem, setProblem] = useState<string | undefined>()

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const create = () => {
    if (!title.trim()) return setProblem(t('share.needTitle'))
    if (mode === 'some' && picked.size === 0) return setProblem(t('share.needSelection'))
    setProblem(undefined)
    onCreate?.({
      ...(mode === 'some'
        ? { messages: previews.filter((m) => picked.has(m.id)).map((m) => m.id) }
        : {}),
      title: title.trim(),
      ...(pass ? { pass } : {}),
      expiresAt: expiresAtFor(expiry, Date.now()),
      tools,
      live,
    })
  }

  if (made) {
    return (
      <Sheet
        title={t('share.ready')}
        onClose={onClose}
        footer={
          <Button block onPress={onClose}>
            {t('share.done')}
          </Button>
        }
      >
        <View style={{ gap: theme.space(3) }}>
          <Text variant="mono" selectable>
            {made.link}
          </Text>
          {!made.hasPass && <Callout tone="warn">{t('share.noPassWarning')}</Callout>}
          <View style={{ flexDirection: 'row', gap: theme.space(2) }}>
            <Button variant="outline" leadingIcon="copy" onPress={() => onCopy?.(made.link)}>
              {t('share.copy')}
            </Button>
            <Button
              variant="outline"
              leadingIcon="externalLink"
              onPress={() => onOpen?.(made.link)}
            >
              {t('share.open')}
            </Button>
          </View>
          <Text variant="caption" tone="muted">
            {t('share.managed')}
          </Text>
        </View>
      </Sheet>
    )
  }

  const shown = problem ?? error
  return (
    <Sheet
      title={t('share.title')}
      onClose={onClose}
      footer={
        <Button block loading={busy} onPress={create}>
          {t('share.create')}
        </Button>
      }
    >
      <View style={{ gap: theme.space(4) }}>
        <View style={{ gap: theme.space(2) }}>
          <Text variant="caption" tone="muted">
            {t('share.what')}
          </Text>
          <Segmented
            options={[
              { id: 'all', label: t('share.whole') },
              { id: 'some', label: t('share.some') },
            ]}
            value={mode}
            onChange={(id) => setMode(id as 'all' | 'some')}
          />
        </View>
        {mode === 'some' && (
          <View style={{ gap: theme.space(1) }}>
            {previews.length === 0 && (
              <Text variant="caption" tone="muted">
                {t('share.noMessages')}
              </Text>
            )}
            {previews.map((m) => (
              <Choice
                key={m.id}
                multiple
                picked={picked.has(m.id)}
                label={`${m.role === 'user' ? t('share.you') : t('share.assistant')}: ${m.text}`}
                onPress={() => toggle(m.id)}
              />
            ))}
          </View>
        )}
        <Field label={t('share.titleField')} required>
          <Input value={title} onChangeText={setTitle} maxLength={200} />
        </Field>
        <Field label={t('share.password')} hint={t('share.passwordHint')}>
          <Input value={pass} onChangeText={setPass} secureTextEntry autoCapitalize="none" />
        </Field>
        <View style={{ gap: theme.space(1) }}>
          <Text variant="caption" tone="muted">
            {t('share.expires')}
          </Text>
          {EXPIRY_PRESETS.map((p) => (
            <Choice
              key={p.id}
              picked={expiry === p.id}
              label={t(EXPIRY_KEY[p.id])}
              onPress={() => setExpiry(p.id)}
            />
          ))}
        </View>
        <Choice
          multiple
          picked={tools}
          label={t('share.tools')}
          onPress={() => setTools((v) => !v)}
        />
        <Choice multiple picked={live} label={t('share.live')} onPress={() => setLive((v) => !v)} />
        {shown && <Callout tone="crit">{shown}</Callout>}
      </View>
    </Sheet>
  )
}
