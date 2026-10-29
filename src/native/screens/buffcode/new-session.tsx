/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Chip } from '../../Chip.tsx'
import { Field, Input, Segmented, SelectField } from '../../Field.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { BcAgent, BcModel, BcProject, PermissionMode } from './model.ts'
import { Gutter, isLive, MachineShell } from './shell.tsx'

export const MODE_KEY: Record<PermissionMode, string> = {
  ask: 'buffcode.modeAsk',
  edit: 'buffcode.modeEdit',
  full: 'buffcode.modeFull',
  custom: 'buffcode.modeCustom',
}
const MODE_HINT: Record<PermissionMode, string> = {
  ask: 'buffcode.modeAskHint',
  edit: 'buffcode.modeEditHint',
  full: 'buffcode.modeFullHint',
  custom: 'buffcode.modeCustom',
}

/** The permission mode and the «Plan» mark, as the composer's control. */
export function PermissionModeControl({
  mode,
  plan = false,
  hasPlan = true,
  disabled = false,
  onMode,
  onPlan,
}: {
  mode: PermissionMode
  plan?: boolean
  hasPlan?: boolean
  disabled?: boolean
  onMode?: (mode: PermissionMode) => void
  onPlan?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const options = (['ask', 'edit', 'full'] as const).map((id) => ({ id, label: t(MODE_KEY[id]) }))
  return (
    <View
      style={{ gap: theme.space(2), opacity: disabled ? 0.5 : 1 }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <Segmented
        options={
          mode === 'custom' ? [{ id: 'custom', label: t(MODE_KEY.custom) }, ...options] : options
        }
        value={mode}
        onChange={(id) => onMode?.(id as PermissionMode)}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space(2) }}>
        <Text variant="caption" tone="muted" style={{ flex: 1 }}>
          {plan ? t('buffcode.planHint') : t(MODE_HINT[mode])}
        </Text>
        {hasPlan && (
          <Chip selected={plan} icon="listChecks" onPress={onPlan}>
            {t('buffcode.plan')}
          </Chip>
        )}
      </View>
    </View>
  )
}

/**
 * A new session: a project and a model from the service's lists, both mandatory; the agent too,
 * except under «Plan», which is the plan agent.
 */
export function NewSessionScreen({
  install,
  status,
  project,
  model,
  agent,
  mode = 'ask',
  plan = false,
  prompt = '',
  onBack,
  onPickProject,
  onPickModel,
  onPickAgent,
  onMode,
  onPlan,
  onPrompt,
  onStart,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  project?: BcProject
  model?: BcModel
  agent?: BcAgent
  mode?: PermissionMode
  plan?: boolean
  prompt?: string
  onBack?: () => void
  onPickProject?: () => void
  onPickModel?: () => void
  onPickAgent?: () => void
  onMode?: (mode: PermissionMode) => void
  onPlan?: () => void
  onPrompt?: (text: string) => void
  onStart?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  const ready = live && !!project && !!model
  return (
    <MachineShell
      install={install}
      status={status}
      title={t('buffcode.newSession')}
      onBack={onBack}
      onRepair={onRepair}
      footer={
        <View style={{ padding: theme.space(4), gap: theme.space(2) }}>
          <Button variant="primary" block leadingIcon="play" disabled={!ready} onPress={onStart}>
            {t('buffcode.start')}
          </Button>
          <Text variant="caption" tone="muted" align="center">
            {t('buffcode.startHint')}
          </Text>
        </View>
      }
    >
      <View style={{ paddingTop: theme.space(4) }}>
        <Gutter gap={theme.space(4)}>
          <Field label={t('buffcode.project')} required>
            <SelectField
              icon="folderGit"
              value={project?.name}
              placeholder={t('buffcode.chooseProject')}
              onPress={onPickProject}
              disabled={!live}
            />
          </Field>
          <Field label={t('buffcode.model')} required>
            <SelectField
              icon="cpu"
              value={model ? `${model.name} · ${model.provider}` : undefined}
              placeholder={t('buffcode.chooseModel')}
              onPress={onPickModel}
              disabled={!live}
            />
          </Field>
          <Field label={t('buffcode.agent')}>
            <SelectField
              icon="bot"
              value={plan ? 'plan' : agent?.name}
              placeholder="build"
              onPress={onPickAgent}
              disabled={!live || plan}
            />
          </Field>
          <Field label={t('buffcode.permissionMode')}>
            <PermissionModeControl
              mode={mode}
              plan={plan}
              disabled={!live}
              onMode={onMode}
              onPlan={onPlan}
            />
          </Field>
          <Input
            rows={4}
            placeholder={t('buffcode.promptPlaceholder')}
            value={prompt}
            onChangeText={onPrompt}
            editable={live}
          />
        </Gutter>
      </View>
    </MachineShell>
  )
}
