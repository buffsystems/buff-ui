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

/**
 * An MCP server's or the setup agent's form (#765): a message and its fields; «not now» leaves it
 * for later. A secret is typed unseen; a choice with own answers takes one; a multi-choice takes
 * several own entries, added one by one; a link is opened and then confirmed.
 */

export type McpValues = Record<string, string | boolean | string[]>

export function McpDock({
  request,
  disabled = false,
  onSend,
  onDecline,
  onOpen,
}: {
  request: McpRequest
  disabled?: boolean
  onSend?: (values: McpValues) => void
  onDecline?: () => void
  /** A link field: the app opens the address outside. */
  onOpen?: (url: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const [values, setValues] = useState<McpValues>(() =>
    Object.fromEntries(
      request.fields.map((f) => [
        f.key,
        f.kind === 'switch' || f.kind === 'link'
          ? false
          : f.kind === 'select'
            ? (f.options[0]?.value ?? '')
            : f.kind === 'multi'
              ? []
              : '',
      ]),
    ),
  )
  const [own, setOwn] = useState<Record<string, string>>({})
  const set = (key: string, value: string | boolean | string[]) =>
    setValues((v) => ({ ...v, [key]: value }))
  const picked = (key: string) => (Array.isArray(values[key]) ? (values[key] as string[]) : [])
  const toggle = (key: string, value: string) =>
    set(
      key,
      picked(key).includes(value)
        ? picked(key).filter((x) => x !== value)
        : [...picked(key), value],
    )
  const addOwn = (key: string) => {
    const text = (own[key] ?? '').trim()
    if (!text) return
    set(key, [...picked(key).filter((x) => x !== text), text])
    setOwn((o) => ({ ...o, [key]: '' }))
  }
  return (
    <DockFrame
      icon="plug"
      title={request.server}
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
      {request.message ? <Prose markdown={request.message} /> : null}
      <View style={{ gap: theme.space(3) }}>
        {request.fields.map((field) => {
          if (field.kind === 'switch')
            return (
              <Chip
                key={field.key}
                selected={!!values[field.key]}
                icon={values[field.key] ? 'check' : undefined}
                onPress={() => set(field.key, !values[field.key])}
              >
                {field.label}
              </Chip>
            )
          if (field.kind === 'link')
            return (
              <Field key={field.key} label={field.label}>
                <Button
                  size="sm"
                  variant={values[field.key] ? 'ghost' : 'primary'}
                  disabled={disabled}
                  onPress={() => (set(field.key, true), onOpen?.(field.url))}
                >
                  {t(values[field.key] ? 'buffcode.openLinkAgain' : 'buffcode.openLink')}
                </Button>
              </Field>
            )
          if (field.kind === 'select')
            return (
              <Field key={field.key} label={field.label}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
                  {field.options.map((o) => (
                    <Chip
                      key={o.value}
                      selected={values[field.key] === o.value}
                      onPress={() => set(field.key, o.value)}
                    >
                      {o.label}
                    </Chip>
                  ))}
                </View>
                {field.custom && (
                  <Input
                    editable={!disabled}
                    placeholder={t('buffcode.ownAnswer')}
                    value={
                      field.options.some((o) => o.value === values[field.key])
                        ? ''
                        : String(values[field.key] ?? '')
                    }
                    onChangeText={(v) => set(field.key, v)}
                  />
                )}
              </Field>
            )
          if (field.kind === 'multi') {
            const extra = picked(field.key).filter((v) => !field.options.some((o) => o.value === v))
            return (
              <Field key={field.key} label={field.label}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space(2) }}>
                  {field.options.map((o) => (
                    <Chip
                      key={o.value}
                      selected={picked(field.key).includes(o.value)}
                      icon={picked(field.key).includes(o.value) ? 'check' : undefined}
                      onPress={() => toggle(field.key, o.value)}
                    >
                      {o.label}
                    </Chip>
                  ))}
                  {extra.map((v) => (
                    <Chip key={`own:${v}`} selected icon="x" onPress={() => toggle(field.key, v)}>
                      {v}
                    </Chip>
                  ))}
                </View>
                {field.custom && (
                  <View style={{ flexDirection: 'row', gap: theme.space(2), alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Input
                        editable={!disabled}
                        placeholder={t('buffcode.ownAnswer')}
                        value={own[field.key] ?? ''}
                        onChangeText={(v) => setOwn((o) => ({ ...o, [field.key]: v }))}
                        onSubmitEditing={() => addOwn(field.key)}
                      />
                    </View>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={disabled}
                      onPress={() => addOwn(field.key)}
                    >
                      {t('buffcode.addOwn')}
                    </Button>
                  </View>
                )}
              </Field>
            )
          }
          return (
            <Field key={field.key} label={field.label} hint={field.hint}>
              <Input
                editable={!disabled}
                secureTextEntry={field.kind === 'secret'}
                autoCapitalize="none"
                autoCorrect={false}
                value={String(values[field.key] ?? '')}
                onChangeText={(v) => set(field.key, v)}
              />
            </Field>
          )
        })}
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
