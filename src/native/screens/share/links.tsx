/*
  Settings → Public links (#821, epic #769): every link from every paired install and machine,
  with its state; open, copy, switch access off and on, edit, delete. The host aggregates.
*/
import { useState } from 'react'
import { View } from 'react-native'
import { Badge, type Tone } from '../../Badge.tsx'
import { Button, IconButton } from '../../Button.tsx'
import { Card } from '../../Card.tsx'
import { Choice } from '../../Choice.tsx'
import { Callout, EmptyState, Skeleton } from '../../Feedback.tsx'
import { Field, Input } from '../../Field.tsx'
import { Screen, TopBar } from '../../Screen.tsx'
import { ConfirmSheet, Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useLocale, useT, useTheme } from '../../theme.tsx'
import { Gutter } from '../buffcode/shell.tsx'
import {
  EXPIRY_PRESETS,
  expiresAtFor,
  linkState,
  type ExpiryPreset,
  type LinkPatch,
  type LinkState,
  type PublicLinkRow,
} from './model.ts'
import { EXPIRY_KEY } from './sheet.tsx'

const STATE_KEY: Record<LinkState, string> = {
  on: 'share.stateOn',
  off: 'share.stateOff',
  expired: 'share.stateExpired',
  pending: 'share.statePending',
}
const STATE_TONE: Record<LinkState, Tone> = {
  on: 'ok',
  off: 'neutral',
  expired: 'warn',
  pending: 'info',
}
const KIND_KEY: Record<PublicLinkRow['kind'], string> = {
  session: 'share.kindSession',
  messages: 'share.kindMessages',
  ask: 'share.kindAsk',
  research: 'share.kindResearch',
}

export function PublicLinksScreen({
  rows,
  loading = false,
  error,
  refreshing = false,
  onRefresh,
  onOpen,
  onCopy,
  onToggle,
  onEdit,
  onDelete,
  onBack,
}: {
  rows: PublicLinkRow[]
  loading?: boolean
  /** Installs that did not answer, by name: their links are not in the list right now. */
  error?: string
  refreshing?: boolean
  onRefresh?: () => void
  onOpen?: (row: PublicLinkRow) => void
  onCopy?: (row: PublicLinkRow) => void
  onToggle?: (row: PublicLinkRow, enabled: boolean) => void
  onEdit?: (row: PublicLinkRow, patch: LinkPatch) => void
  onDelete?: (row: PublicLinkRow) => void
  onBack?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const locale = useLocale()
  const [editing, setEditing] = useState<PublicLinkRow | null>(null)
  const [removing, setRemoving] = useState<PublicLinkRow | null>(null)
  const now = Date.now()
  const when = (ms: number) =>
    new Date(ms).toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  return (
    <>
      <TopBar title={t('share.links')} subtitle={t('share.linksHint')} onBack={onBack} />
      <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
        <View style={{ paddingTop: theme.space(3) }}>
          <Gutter gap={theme.space(3)}>
            <Text variant="caption" tone="muted">
              {t('share.linksIntro')}
            </Text>
            {error && <Callout tone="warn">{error}</Callout>}
            {loading && rows.length === 0 ? (
              <>
                <Skeleton height={96} />
                <Skeleton height={96} />
              </>
            ) : rows.length === 0 ? (
              <EmptyState icon="link" title={t('share.noLinks')} text={t('share.noLinksHint')} />
            ) : (
              rows.map((row) => {
                const state = linkState(row, now)
                const meta = [
                  row.installName,
                  t(KIND_KEY[row.kind]),
                  row.sourceTitle ?? t('share.deletedSource'),
                  row.hasPass ? t('share.withPass') : t('share.noPass'),
                  row.expiresAt === null
                    ? t('share.expiryNone')
                    : t('share.until', { when: when(row.expiresAt) }),
                ].join(' · ')
                return (
                  <Card key={`${row.installId}:${row.id}`} accessibilityLabel={row.title}>
                    <View style={{ gap: theme.space(2) }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}
                      >
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
                            {row.title}
                          </Text>
                          <Text variant="caption" tone="muted" numberOfLines={2}>
                            {meta}
                          </Text>
                        </View>
                        <Badge tone={STATE_TONE[state]}>{t(STATE_KEY[state])}</Badge>
                      </View>
                      <Text variant="mono" tone="muted" selectable numberOfLines={1}>
                        {row.link}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: theme.space(2),
                          alignItems: 'center',
                        }}
                      >
                        <IconButton
                          icon="copy"
                          label={t('share.copy')}
                          onPress={() => onCopy?.(row)}
                        />
                        <IconButton
                          icon="externalLink"
                          label={t('share.open')}
                          onPress={() => onOpen?.(row)}
                        />
                        <IconButton
                          icon="pencil"
                          label={t('share.edit')}
                          onPress={() => setEditing(row)}
                        />
                        <IconButton
                          icon="trash"
                          label={t('common.delete')}
                          onPress={() => setRemoving(row)}
                        />
                        <View style={{ flex: 1 }} />
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => onToggle?.(row, !row.enabled)}
                        >
                          {row.enabled ? t('share.disable') : t('share.enable')}
                        </Button>
                      </View>
                    </View>
                  </Card>
                )
              })
            )}
          </Gutter>
        </View>
      </Screen>
      {editing && (
        <EditLinkSheet
          row={editing}
          onSave={(patch) => {
            const row = editing
            setEditing(null)
            onEdit?.(row, patch)
          }}
          onClose={() => setEditing(null)}
        />
      )}
      {removing && (
        <ConfirmSheet
          title={t('share.deleteTitle')}
          text={t('share.deleteText')}
          confirmLabel={t('common.delete')}
          destructive
          onConfirm={() => {
            const row = removing
            setRemoving(null)
            onDelete?.(row)
          }}
          onClose={() => setRemoving(null)}
        />
      )}
    </>
  )
}

function EditLinkSheet({
  row,
  onSave,
  onClose,
}: {
  row: PublicLinkRow
  onSave: (patch: LinkPatch) => void
  onClose: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [title, setTitle] = useState(row.title)
  const [pass, setPass] = useState('')
  const [dropPass, setDropPass] = useState(false)
  const [expiry, setExpiry] = useState<ExpiryPreset | 'keep'>('keep')
  const [tools, setTools] = useState(row.tools)
  const [live, setLive] = useState(row.live)
  const save = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      ...(dropPass ? { pass: null } : pass ? { pass } : {}),
      ...(expiry === 'keep' ? {} : { expiresAt: expiresAtFor(expiry, Date.now()) }),
      tools,
      live,
    })
  }
  return (
    <Sheet
      title={t('share.editTitle')}
      onClose={onClose}
      footer={
        <Button block disabled={!title.trim()} onPress={save}>
          {t('common.save')}
        </Button>
      }
    >
      <View style={{ gap: theme.space(4) }}>
        <Field label={t('share.titleField')} required>
          <Input value={title} onChangeText={setTitle} maxLength={200} />
        </Field>
        <Field label={t('share.newPassword')}>
          <Input
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            autoCapitalize="none"
            editable={!dropPass}
          />
        </Field>
        {row.hasPass && (
          <Choice
            multiple
            picked={dropPass}
            label={t('share.removePassword')}
            onPress={() => setDropPass((v) => !v)}
          />
        )}
        <View style={{ gap: theme.space(1) }}>
          <Text variant="caption" tone="muted">
            {t('share.expires')}
          </Text>
          <Choice
            picked={expiry === 'keep'}
            label={t('share.keep')}
            onPress={() => setExpiry('keep')}
          />
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
      </View>
    </Sheet>
  )
}
