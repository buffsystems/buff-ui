/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Badge } from '../../Badge.tsx'
import { Chip } from '../../Chip.tsx'
import { Button } from '../../Button.tsx'
import { Card, KeyValue } from '../../Card.tsx'
import { Field, SelectField } from '../../Field.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useLocale, useT, useTheme } from '../../theme.tsx'
import type { SessionDetails } from './model.ts'
import { variantHint, variantLabel } from './variant.ts'
import { contextLabel } from './context.ts'
import { Eyebrow, originLabel } from './shell.tsx'

/** «Session details»: where it runs, its branch, the MCP servers and the LSPs, a way to review. */

export function SessionDetailsSheet({
  details,
  disabled = false,
  onReview,
  model,
  mode,
  variant,
  onModel,
  onMode,
  onVariant,
  context,
  modelWindow,
  onContext,
  setup,
  onSetup,
  onClose,
}: {
  details: SessionDetails
  disabled?: boolean
  onReview?: () => void
  /** The session's model and permission mode, changed from here (#653). */
  model?: string
  mode?: string
  onModel?: () => void
  onMode?: () => void
  /** The model's thinking mode (#759) by its variant id; no handler — the model has none. */
  variant?: string
  onVariant?: () => void
  /** The session's context window (#839): the cap in tokens, 0 — the model's window. */
  context?: number
  modelWindow?: number
  onContext?: () => void
  /** Setup mode (#765): the agent connects itself to services; switched here. */
  setup?: boolean
  onSetup?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const locale = useLocale()
  const theme = useTheme()
  return (
    <Sheet
      title={t('buffcode.sessionDetails')}
      onClose={onClose}
      footer={
        <Button block leadingIcon="gitPullRequest" disabled={disabled} onPress={onReview}>
          {t('buffcode.detailsReview')}
        </Button>
      }
    >
      <Card>
        <KeyValue label={t('buffcode.detailsDirectory')} value={details.directory} mono />
        <KeyValue
          label={t('buffcode.detailsBranch')}
          value={details.branch ?? t('buffcode.detailsNoBranch')}
          mono
        />
        {details.baseBranch && (
          <KeyValue label="" value={t('buffcode.detailsBase', { branch: details.baseBranch })} />
        )}
        <KeyValue label={t('buffcode.detailsOrigin')} value={originLabel(t, details.origin)} />
        <KeyValue label={t('buffcode.detailsCreated')} value={details.created} />
      </Card>
      {(onModel || onMode || onVariant || onContext) && (
        <Card style={{ gap: theme.space(2) }}>
          {onModel && (
            <Field label={t('buffcode.model')}>
              <SelectField
                value={model}
                placeholder={t('buffcode.chooseModel')}
                icon="sparkles"
                onPress={onModel}
                disabled={disabled}
              />
            </Field>
          )}
          {onVariant && (
            <Field label={t('buffcode.thinkingMode')} hint={variantHint(t, variant ?? 'default')}>
              <SelectField
                value={variantLabel(t, variant ?? 'default')}
                icon="brain"
                placeholder={t('buffcode.thinkingMode')}
                onPress={onVariant}
                disabled={disabled}
              />
            </Field>
          )}
          {onContext && (
            <Field label={t('buffcode.contextWindow')} hint={t('buffcode.contextHint')}>
              <SelectField
                value={contextLabel(locale, context ?? 0, modelWindow)}
                icon="layers"
                placeholder={t('buffcode.contextWindow')}
                onPress={onContext}
                disabled={disabled}
              />
            </Field>
          )}
          {onMode && (
            <Field label={t('buffcode.permissionMode')}>
              <SelectField
                value={mode}
                placeholder={t('buffcode.permissionMode')}
                icon="shieldCheck"
                onPress={onMode}
                disabled={disabled}
              />
            </Field>
          )}
          {onSetup && (
            <Field label={t('buffcode.setupGroup')} hint={t('buffcode.setupHint')}>
              <Chip selected={!!setup} icon={setup ? 'check' : undefined} onPress={onSetup}>
                {t(setup ? 'buffcode.setupOn' : 'buffcode.setupOff')}
              </Chip>
            </Field>
          )}
        </Card>
      )}
      <Eyebrow>{t('buffcode.detailsMcp')}</Eyebrow>
      <Card>
        {details.mcp.length === 0 ? (
          <Text variant="label" tone="muted">
            {t('buffcode.detailsMcpEmpty')}
          </Text>
        ) : (
          details.mcp.map((server) => (
            <View
              key={server.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.space(2),
                paddingVertical: 4,
              }}
            >
              <Text variant="label" style={{ flex: 1 }}>
                {server.name}
              </Text>
              <Badge tone={server.ok ? 'ok' : 'crit'}>
                {t(server.ok ? 'buffcode.detailsConnected' : 'buffcode.detailsFailed')}
              </Badge>
            </View>
          ))
        )}
      </Card>
      <Eyebrow>{t('buffcode.detailsLsp')}</Eyebrow>
      <Card>
        <Text variant="label" tone={details.lsp.length ? 'fg' : 'muted'}>
          {details.lsp.length ? details.lsp.join(' · ') : t('buffcode.detailsLspEmpty')}
        </Text>
      </Card>
    </Sheet>
  )
}
