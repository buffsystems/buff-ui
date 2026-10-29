/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Chip } from '../../Chip.tsx'
import { Field, Input } from '../../Field.tsx'
import { Prose } from '../../Prose.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import { DockFrame } from './docks.tsx'
import type { McpRequest, WebSearchRequest } from './model.ts'

/** An MCP server's form: a message and its fields; «not now» leaves it for later. */

export type McpValues = Record<string, string | boolean>

export function McpDock({
  request,
  disabled = false,
  onSend,
  onDecline,
}: {
  request: McpRequest
  disabled?: boolean
  onSend?: (values: McpValues) => void
  onDecline?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [values, setValues] = useState<McpValues>(() =>
    Object.fromEntries(
      request.fields.map((f) => [
        f.key,
        f.kind === 'switch' ? false : f.kind === 'select' ? (f.options[0] ?? '') : '',
      ]),
    ),
  )
  const set = (key: string, value: string | boolean) => setValues((v) => ({ ...v, [key]: value }))
  return (
    <DockFrame
      icon="plug"
      title={t('buffcode.mcpTitle', { server: request.server })}
      footer={
        <>
          <Button size="sm" variant="ghost" disabled={disabled} onPress={onDecline}>
            {t('buffcode.notNow')}
          </Button>
          <Button size="sm" variant="primary" disabled={disabled} onPress={() => onSend?.(values)}>
            {t('common.send')}
          </Button>
        </>
      }
    >
      <Prose markdown={request.message} />
      <View style={{ gap: theme.space(3) }}>
        {request.fields.map((field) =>
          field.kind === 'switch' ? (
            <Chip
              key={field.key}
              selected={!!values[field.key]}
              icon={values[field.key] ? 'check' : undefined}
              onPress={() => set(field.key, !values[field.key])}
            >
              {field.label}
            </Chip>
          ) : field.kind === 'select' ? (
            <Field key={field.key} label={field.label}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
                {field.options.map((o) => (
                  <Chip
                    key={o}
                    selected={values[field.key] === o}
                    onPress={() => set(field.key, o)}
                  >
                    {o}
                  </Chip>
                ))}
              </View>
            </Field>
          ) : (
            <Field key={field.key} label={field.label} hint={field.hint}>
              <Input
                editable={!disabled}
                value={String(values[field.key] ?? '')}
                onChangeText={(v) => set(field.key, v)}
              />
            </Field>
          ),
        )}
      </View>
    </DockFrame>
  )
}

/** The first web search of a session: which provider, or none. */

export function WebSearchDock({
  request,
  disabled = false,
  onEnable,
  onDisable,
}: {
  request: WebSearchRequest
  disabled?: boolean
  onEnable?: (providerId: string) => void
  onDisable?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [chosen, setChosen] = useState('any')
  const empty = request.providers.length === 0
  return (
    <DockFrame
      icon="globe"
      title={t('buffcode.webSearchTitle')}
      footer={
        <>
          <Button size="sm" variant="ghost" disabled={disabled} onPress={onDisable}>
            {t('buffcode.webSearchDisable')}
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={disabled || empty}
            onPress={() => onEnable?.(chosen)}
          >
            {t('buffcode.webSearchEnable')}
          </Button>
        </>
      }
    >
      <Text variant="label" tone="fg2">
        {t('buffcode.webSearchText')}
      </Text>
      {empty ? (
        <Text variant="caption" tone="muted">
          {t('buffcode.webSearchEmpty')}
        </Text>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
          <Chip selected={chosen === 'any'} onPress={() => setChosen('any')}>
            {t('buffcode.webSearchAny')}
          </Chip>
          {request.providers.map((p) => (
            <Chip key={p.id} selected={chosen === p.id} onPress={() => setChosen(p.id)}>
              {p.name}
            </Chip>
          ))}
        </View>
      )}
    </DockFrame>
  )
}
