/** @jsxRuntime automatic */
import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Button } from '../../Button.tsx'
import { Card, KeyValue } from '../../Card.tsx'
import { DiffView } from '../../Code.tsx'
import { EmptyState } from '../../Feedback.tsx'
import { Icon } from '../../Icon.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { ChangedFile, Usage } from './model.ts'
import { Eyebrow } from './shell.tsx'

const STATUS_TONE = { modified: 'info', added: 'ok', deleted: 'crit' } as const

/** One changed file: the path, +/− counts; pressed, its diff unfolds. */

export function ChangedFileCard({
  file,
  disabled = false,
  onOpen,
}: {
  file: ChangedFile
  disabled?: boolean
  onOpen?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  return (
    <Card padded={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={file.path}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.space(2),
          minHeight: 48,
          paddingHorizontal: theme.space(3),
        }}
      >
        <Badge tone={STATUS_TONE[file.status]}>{file.status[0].toUpperCase()}</Badge>
        <Text variant="mono" numberOfLines={1} style={{ flex: 1 }}>
          {file.path}
        </Text>
        <Text variant="caption" tone="success">
          +{file.added}
        </Text>
        <Text variant="caption" tone="destructive">
          −{file.removed}
        </Text>
        <Icon
          name={open ? 'chevronDown' : 'chevronRight'}
          size={16}
          color={theme.colors.mutedForeground}
        />
      </Pressable>
      {open && (
        <View style={{ padding: theme.space(2), paddingTop: 0, gap: theme.space(2) }}>
          <DiffView lines={file.diff} maxLines={40} />
          <Button
            size="sm"
            variant="ghost"
            leadingIcon="fileText"
            onPress={onOpen}
            disabled={disabled}
          >
            {t('buffcode.openFile')}
          </Button>
        </View>
      )}
    </Card>
  )
}

/** The Changes view: the uncommitted files of the session's workspace with their diffs. */

export function ChangesView({
  files,
  loading = false,
  disabled = false,
  onOpenFile,
}: {
  files: ChangedFile[]
  loading?: boolean
  disabled?: boolean
  onOpenFile?: (path: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  if (loading) return <EmptyState loading title={t('common.loading')} />
  if (files.length === 0) return <EmptyState icon="checkCircle" title={t('buffcode.noChanges')} />
  return (
    <ScrollView contentContainerStyle={{ padding: theme.space(3), gap: theme.space(2) }}>
      <Eyebrow>{t('buffcode.filesChanged', { n: files.length })}</Eyebrow>
      {files.map((file) => (
        <ChangedFileCard
          key={file.path}
          file={file}
          disabled={disabled}
          onOpen={() => onOpenFile?.(file.path)}
        />
      ))}
    </ScrollView>
  )
}

/** The Usage view: the cost, the context window's fill and the tokens, then turn by turn. */

export function UsageView({ usage }: { usage: Usage }) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const total =
    usage.tokens.input + usage.tokens.output + usage.tokens.cache + usage.tokens.reasoning
  return (
    <ScrollView contentContainerStyle={{ padding: theme.space(4), gap: theme.space(3) }}>
      <View style={{ flexDirection: 'row', gap: theme.space(3) }}>
        {[
          [t('buffcode.usageCost'), usage.cost],
          [t('buffcode.usageContext'), `${usage.percent}%`],
          [t('buffcode.usageTokens'), total.toLocaleString('ru-RU')],
        ].map(([label, value]) => (
          <Card key={label} style={{ flex: 1 }}>
            <Text variant="caption" tone="muted">
              {label}
            </Text>
            <Text variant="heading" numberOfLines={1}>
              {value}
            </Text>
          </Card>
        ))}
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: c.muted2, overflow: 'hidden' }}>
        <View
          style={{
            width: `${Math.min(100, usage.percent)}%`,
            height: 8,
            backgroundColor: usage.percent > 80 ? c.warning : c.primary,
          }}
        />
      </View>
      <Card>
        <KeyValue
          label={t('buffcode.usageInput')}
          value={usage.tokens.input.toLocaleString('ru-RU')}
          mono
        />
        <KeyValue
          label={t('buffcode.usageOutput')}
          value={usage.tokens.output.toLocaleString('ru-RU')}
          mono
        />
        <KeyValue
          label={t('buffcode.usageCache')}
          value={usage.tokens.cache.toLocaleString('ru-RU')}
          mono
        />
        <KeyValue
          label={t('buffcode.usageReasoning')}
          value={usage.tokens.reasoning.toLocaleString('ru-RU')}
          mono
        />
      </Card>
      <Eyebrow>{t('buffcode.usageByTurn')}</Eyebrow>
      <Card padded={false}>
        {usage.turns.map((turn, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.space(2),
              paddingHorizontal: theme.space(4),
              paddingVertical: theme.space(2),
              borderTopWidth: i ? 1 : 0,
              borderTopColor: c.border,
            }}
          >
            <Text variant="label" numberOfLines={1} style={{ flex: 1 }}>
              {turn.title}
            </Text>
            <Text variant="mono" tone="muted">
              {turn.tokens.toLocaleString('ru-RU')}
            </Text>
            <Text variant="mono">{turn.cost}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  )
}
