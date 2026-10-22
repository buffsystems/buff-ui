import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogBody,
  DialogFooter,
  Field,
  Input,
} from '../src/react/index.ts'

const meta = { title: 'Overlays/Dialog', component: Dialog } satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

const noop = () => {}

function FormDialog() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Открыть</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Подключить репозиторий"
        description="Вставьте https-адрес — импорт продолжится в фоне."
      >
        <DialogBody>
          <div className="sb-stack">
            <Field label="Адрес репозитория">
              <Input placeholder="https://gitlab.com/org/project.git" />
            </Field>
            <Field label="Токен доступа" hint="Нужен для приватных репозиториев">
              <Input type="password" />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" size="sm">
            Подключить
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export const Form: Story = {
  args: { open: true, onOpenChange: noop, title: '' },
  render: () => <FormDialog />,
}

export const Confirm: Story = {
  args: { open: true, onOpenChange: noop, title: '' },
  render: () => (
    <ConfirmDialog
      open
      danger
      title="Удалить проект?"
      message="Задачи, ветки и история аудитов будут удалены. Это нельзя отменить."
      confirmLabel="Удалить"
      onConfirm={noop}
      onCancel={noop}
    />
  ),
}

export const ThreeWays: Story = {
  args: { open: true, onOpenChange: noop, title: '' },
  render: () => (
    <ConfirmDialog
      open
      title="Есть несохранённые изменения"
      message="Сохранить их перед уходом?"
      confirmLabel="Сохранить"
      secondaryLabel="Уйти без сохранения"
      onSecondary={noop}
      onConfirm={noop}
      onCancel={noop}
    />
  ),
}

const REPOS = [
  { name: 'acme/stocks-bot-with-a-very-long-repository-name-for-tests', size: '12 МБ' },
  { name: 'acme/infra-terraform-modules-shared-between-environments', size: '3 МБ' },
  { name: 'acme/site', size: '840 КБ' },
]

const row = { display: 'flex', alignItems: 'center', gap: 8 } as const
const truncate = {
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const

// Content wider than a phone (long names that truncate, an unbroken token) must not widen the
// dialog past the screen: it stays inside the viewport and its rows truncate (#561).
export const WideContent: Story = {
  args: { open: true, onOpenChange: noop, title: '' },
  render: () => (
    <Dialog open onOpenChange={noop} title="Организация — acme" size="lg">
      <DialogBody>
        <div className="sb-stack">
          {REPOS.map((r) => (
            <div key={r.name} style={row}>
              <span style={truncate}>{r.name}</span>
              <span className="sb-caption" style={{ margin: 0, flexShrink: 0 }}>
                {r.size}
              </span>
            </div>
          ))}
          <code style={{ whiteSpace: 'nowrap' }}>
            SHA256:Jr2dQ0cWp6c4mO1y8vY0bH3g7kZ9uT5sN2xA4eL6fR8qW1zP
          </code>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button size="sm" onClick={noop}>
          Закрыть
        </Button>
      </DialogFooter>
    </Dialog>
  ),
}
