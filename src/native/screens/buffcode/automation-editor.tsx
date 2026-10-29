/** @jsxRuntime automatic */
import { View } from 'react-native'
import { Button } from '../../Button.tsx'
import { Chip } from '../../Chip.tsx'
import { Field, Input, Segmented, SelectField } from '../../Field.tsx'
import type { Install, InstallStatus } from '../../model.ts'
import { Text } from '../../Text.tsx'
import { useT, useTheme } from '../../theme.tsx'
import type { PermissionMode } from './model.ts'
import { MODE_KEY } from './new-session.tsx'
import { Gutter, isLive, MachineShell } from './shell.tsx'

export type ScheduleKind = 'daily' | 'weekly' | 'monthly'

export interface AutomationDraft {
  title: string
  schedule: ScheduleKind
  /** 0 = Monday … 6 = Sunday, for a weekly schedule. */
  days: number[]
  dayOfMonth: number
  time: string
  task: string
  projectName?: string
  mode: PermissionMode
  modelName?: string
  /** The preview line: «ежедневно в 09:00 · следующий запуск — завтра 09:00». */
  preview?: string
}

const DAY_LABELS = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
}

/** The automation editor: name, schedule, the task text, project, permissions, model. */
export function AutomationEditorScreen({
  install,
  status,
  draft,
  editing = false,
  locale = 'ru',
  onBack,
  onChange,
  onPickProject,
  onPickModel,
  onSave,
  onRepair,
}: {
  install: Install
  status: InstallStatus
  draft: AutomationDraft
  editing?: boolean
  locale?: 'ru' | 'en'
  onBack?: () => void
  onChange?: (draft: AutomationDraft) => void
  onPickProject?: () => void
  onPickModel?: () => void
  onSave?: () => void
  onRepair?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const live = isLive(status)
  const set = (patch: Partial<AutomationDraft>) => onChange?.({ ...draft, ...patch })
  const valid = draft.title.trim() && draft.task.trim() && draft.projectName
  return (
    <MachineShell
      install={install}
      status={status}
      title={t(editing ? 'buffcode.editAutomation' : 'buffcode.newAutomation')}
      onBack={onBack}
      onRepair={onRepair}
      footer={
        <View style={{ flexDirection: 'row', gap: theme.space(2), padding: theme.space(4) }}>
          <Button block onPress={onBack} style={{ flex: 1 }}>
            {t('common.cancel')}
          </Button>
          <Button
            block
            variant="primary"
            disabled={!live || !valid}
            onPress={onSave}
            style={{ flex: 1 }}
          >
            {t('common.save')}
          </Button>
        </View>
      }
    >
      <View style={{ paddingTop: theme.space(4) }} pointerEvents={live ? 'auto' : 'none'}>
        <Gutter gap={theme.space(4)}>
          <Field label={t('buffcode.name')} required>
            <Input
              placeholder={t('buffcode.namePlaceholder')}
              value={draft.title}
              onChangeText={(title) => set({ title })}
              editable={live}
            />
          </Field>
          <Field label={t('buffcode.schedule')} hint={draft.preview}>
            <View style={{ gap: theme.space(3) }}>
              <Segmented
                options={[
                  { id: 'daily', label: t('buffcode.daily') },
                  { id: 'weekly', label: t('buffcode.weekly') },
                  { id: 'monthly', label: t('buffcode.monthly') },
                ]}
                value={draft.schedule}
                onChange={(id) => set({ schedule: id as ScheduleKind })}
              />
              {draft.schedule === 'weekly' && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {DAY_LABELS[locale].map((label, day) => (
                    <Chip
                      key={day}
                      selected={draft.days.includes(day)}
                      onPress={() =>
                        set({
                          days: draft.days.includes(day)
                            ? draft.days.filter((d) => d !== day)
                            : [...draft.days, day],
                        })
                      }
                    >
                      {label}
                    </Chip>
                  ))}
                </View>
              )}
              <View style={{ flexDirection: 'row', gap: theme.space(3) }}>
                {draft.schedule === 'monthly' && (
                  <View style={{ flex: 1 }}>
                    <Field label={t('buffcode.dayOfMonth')}>
                      <Input
                        keyboardType="number-pad"
                        value={String(draft.dayOfMonth)}
                        onChangeText={(v) => set({ dayOfMonth: Number(v) || 1 })}
                        editable={live}
                      />
                    </Field>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Field label={t('buffcode.time')}>
                    <Input
                      icon="clock"
                      value={draft.time}
                      onChangeText={(time) => set({ time })}
                      editable={live}
                    />
                  </Field>
                </View>
              </View>
            </View>
          </Field>
          <Field label={t('buffcode.task')} hint={t('buffcode.taskHint')} required>
            <Input
              rows={4}
              placeholder={t('buffcode.taskPlaceholder')}
              value={draft.task}
              onChangeText={(task) => set({ task })}
              editable={live}
            />
          </Field>
          <Field label={t('buffcode.project')} required>
            <SelectField
              icon="folderGit"
              value={draft.projectName}
              placeholder={t('buffcode.chooseProject')}
              onPress={onPickProject}
              disabled={!live}
            />
          </Field>
          <Field label={t('buffcode.permissionsInRun')} hint={t('buffcode.permissionsInRunHint')}>
            <Segmented
              options={(['ask', 'edit', 'full'] as const).map((id) => ({
                id,
                label: t(MODE_KEY[id]),
              }))}
              value={draft.mode}
              onChange={(id) => set({ mode: id as PermissionMode })}
            />
          </Field>
          <Field label={t('buffcode.model')}>
            <SelectField
              icon="cpu"
              value={draft.modelName}
              placeholder={t('buffcode.projectDefault')}
              onPress={onPickModel}
              disabled={!live}
            />
          </Field>
          <Text variant="caption" tone="muted">
            {t('buffcode.taskHint')}
          </Text>
        </Gutter>
      </View>
    </MachineShell>
  )
}
