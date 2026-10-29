/** @jsxRuntime automatic */
import { useState } from 'react'
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Field, Input, Segmented, SelectField } from '../../Field.tsx'
import { Sheet } from '../../Sheet.tsx'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { Workflow } from './model.ts'

/** «Run …»: the arguments by their type, the project, then Run. */

export function WorkflowStartSheet({
  workflow,
  projectName,
  disabled = false,
  onPickProject,
  onStart,
  onClose,
}: {
  workflow: Workflow
  projectName?: string
  disabled?: boolean
  onPickProject?: () => void
  onStart?: (values: Record<string, string>) => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const [values, setValues] = useState<Record<string, string>>({})
  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }))
  const missing = workflow.args.some((a) => a.required && !(values[a.name] ?? '').trim())
  return (
    <Sheet
      title={t('buffcode.runTitle', { name: workflow.name })}
      onClose={onClose}
      footer={
        <Button
          block
          variant="primary"
          leadingIcon="play"
          disabled={disabled || !projectName || missing}
          onPress={() => onStart?.(values)}
        >
          {t('buffcode.runWorkflow')}
        </Button>
      }
    >
      {workflow.args.length === 0 ? (
        <Text variant="label" tone="muted">
          {t('buffcode.noArgs')}
        </Text>
      ) : (
        <View style={{ gap: theme.space(3) }}>
          {workflow.args.map((arg) => (
            <Field
              key={arg.name}
              label={`${arg.name} · ${arg.type}${arg.required ? ` · ${t('buffcode.required')}` : ''}`}
              hint={arg.description}
            >
              {arg.type === 'boolean' ? (
                <Segmented
                  options={[
                    { id: '', label: t('buffcode.notSet') },
                    { id: 'true', label: t('common.yes') },
                    { id: 'false', label: t('common.no') },
                  ]}
                  value={values[arg.name] ?? ''}
                  onChange={(id) => set(arg.name, id)}
                />
              ) : (
                <Input
                  value={values[arg.name] ?? ''}
                  onChangeText={(v) => set(arg.name, v)}
                  keyboardType={arg.type === 'number' ? 'numeric' : 'default'}
                  editable={!disabled}
                />
              )}
            </Field>
          ))}
        </View>
      )}
      <Field label={t('buffcode.project')} hint={t('buffcode.runHint')} required>
        <SelectField
          icon="folderGit"
          value={projectName}
          placeholder={t('buffcode.chooseProject')}
          onPress={onPickProject}
          disabled={disabled}
        />
      </Field>
    </Sheet>
  )
}
