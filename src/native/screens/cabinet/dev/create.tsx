/** @jsxRuntime automatic */
/*
  Starting work (#629): a new task — a project, a statement, attachments — and the sheet
  that makes a development project out of repositories and branches.
*/
import { Pressable, View } from 'react-native'
import { Button } from '../../../Button.tsx'
import { Callout, Spinner } from '../../../Feedback.tsx'
import { Field, Input, SelectField } from '../../../Field.tsx'
import { Icon } from '../../../Icon.tsx'
import type { Attachment, InstallStatus } from '../../../model.ts'
import { Row, RowGroup } from '../../../Row.tsx'
import { Screen, TopBar } from '../../../Screen.tsx'
import { Sheet } from '../../../Sheet.tsx'
import { Text } from '../../../Text.tsx'
import { useT, useTheme } from '../../../theme.tsx'
import { InstallBanner } from '../../status.tsx'
import type { ProjectRef } from '../model.ts'
import { AttachmentRow } from '../attachments.tsx'
import type { RepoBranchPick } from './model.ts'

/** «New task»: pick the project, write the statement, attach, create. */
export function CreateTaskScreen({
  status,
  project,
  statement = '',
  staged = [],
  busy = false,
  error,
  onBack,
  onPickProject,
  onAttach,
  onRemoveStaged,
  onCreate,
  onStatement,
}: {
  status: InstallStatus
  project?: ProjectRef
  statement?: string
  staged?: Attachment[]
  busy?: boolean
  error?: string
  onBack?: () => void
  onPickProject?: () => void
  onAttach?: () => void
  onRemoveStaged?: (id: string) => void
  onCreate?: () => void
  /** The statement as typed. */
  onStatement?: (text: string) => void
}) {
  const t = useT()
  const theme = useTheme()
  const disabled = status.kind !== 'online' || busy
  const ready = !!project && statement.trim() !== ''
  return (
    <>
      <TopBar title={t('devt.createTitle')} onBack={onBack} />
      <Screen
        padded
        footer={
          <View style={{ padding: theme.space(3) }}>
            <Button
              variant="primary"
              block
              loading={busy}
              disabled={disabled || !ready}
              onPress={onCreate}
            >
              {t('cabinet.create')}
            </Button>
          </View>
        }
      >
        <InstallBanner status={status} />
        <Field label={t('cabinet.project')} required>
          <SelectField
            value={project?.name}
            placeholder={t('cabinet.chooseProject')}
            icon="folderGit"
            onPress={onPickProject}
            disabled={disabled}
          />
        </Field>
        <Field label={t('devt.statement')} hint={t('devt.statementHint')} error={error} required>
          <Input
            value={statement}
            placeholder={t('devt.statementPlaceholder')}
            rows={6}
            editable={!disabled}
            onChangeText={onStatement}
          />
        </Field>
        {staged.length > 0 && (
          <RowGroup title={t('cabinet.attachments')}>
            {staged.map((a) => (
              <AttachmentRow
                key={a.id}
                attachment={a}
                onRemove={() => onRemoveStaged?.(a.id)}
                disabled={disabled}
              />
            ))}
          </RowGroup>
        )}
        <Button variant="ghost" leadingIcon="paperclip" onPress={onAttach} disabled={disabled}>
          {t('cabinet.attach')}
        </Button>
      </Screen>
    </>
  )
}

/** The web's «New development project» modal as a sheet: a name, repos with a branch each. */
export function AddDevProjectSheet({
  name = '',
  nameError,
  repos,
  picked,
  reposLoading = false,
  reposError,
  busy = false,
  statusText,
  onPickBranch,
  onToggleRepo,
  onCreate,
  onClose,
  onName,
}: {
  name?: string
  /** The project name as typed. */
  onName?: (text: string) => void
  nameError?: string
  repos: RepoBranchPick[]
  /** The chosen branch per repo name. */
  picked: Record<string, string>
  reposLoading?: boolean
  /** The repositories could not be read: said as such, not as «none». */
  reposError?: string
  busy?: boolean
  statusText?: string
  onPickBranch?: (repo: string) => void
  onToggleRepo?: (repo: string) => void
  onCreate?: () => void
  onClose?: () => void
}) {
  const t = useT()
  const theme = useTheme()
  const c = theme.colors
  const validName = /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(name.trim())
  const count = Object.keys(picked).length
  const missing = [!validName && t('devt.needName'), count === 0 && t('devt.needRepo')].filter(
    Boolean,
  )
  if (busy)
    return (
      <Sheet title={t('devt.createProjectTitle')} onClose={onClose}>
        <View style={{ alignItems: 'center', gap: theme.space(3), padding: theme.space(4) }}>
          <Spinner size="large" />
          <Text>{statusText ?? t('devt.creating')}</Text>
          <Text variant="caption" tone="muted" align="center">
            {t('devt.creatingHint')}
          </Text>
          <Button onPress={onClose}>{t('common.close')}</Button>
        </View>
      </Sheet>
    )
  return (
    <Sheet
      title={t('devt.createProjectTitle')}
      onClose={onClose}
      footer={
        <>
          {missing.length > 0 && (
            <Text variant="caption" tone="muted">
              {t('devt.needs', { what: missing.join(' · ') })}
            </Text>
          )}
          <Button variant="primary" block disabled={missing.length > 0} onPress={onCreate}>
            {t('cabinet.create')}
          </Button>
        </>
      }
    >
      <Field
        label={t('devt.projectName')}
        error={nameError ?? (name && !validName ? t('devt.projectNameError') : undefined)}
      >
        <Input value={name} placeholder="my-app" autoCapitalize="none" onChangeText={onName} />
      </Field>
      <Field label={t('devt.reposTitle')} hint={t('devt.selected', { n: count })}>
        {reposLoading ? (
          <Spinner />
        ) : reposError ? (
          <Callout tone="crit">{reposError}</Callout>
        ) : repos.length === 0 ? (
          <Callout tone="neutral">{t('devt.noRepos')}</Callout>
        ) : (
          <RowGroup>
            {repos.map((r) => {
              const on = r.name in picked
              return (
                <Row
                  key={r.name}
                  leading={
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: on, disabled: !!r.empty }}
                      accessibilityLabel={r.name}
                      disabled={r.empty}
                      onPress={() => onToggleRepo?.(r.name)}
                      hitSlop={10}
                    >
                      <Icon
                        name={on ? 'checkCircle' : 'square'}
                        size={20}
                        color={on ? c.primary : c.mutedForeground}
                      />
                    </Pressable>
                  }
                  title={r.name}
                  subtitle={
                    r.empty
                      ? t('devt.empty')
                      : `${picked[r.name] ?? r.defaultBranch} · ${t('devt.byDefault')}`
                  }
                  trailing={<Icon name="gitBranch" size={16} color={c.mutedForeground} />}
                  onPress={() => onPickBranch?.(r.name)}
                  disabled={r.empty}
                />
              )
            })}
          </RowGroup>
        )}
      </Field>
    </Sheet>
  )
}
