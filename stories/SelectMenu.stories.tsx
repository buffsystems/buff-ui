import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, SelectMenu } from '../src/react/index.ts'
import type { SelectMenuOption } from '../src/react/index.ts'

const meta = {
  title: 'Inputs/SelectMenu',
  component: SelectMenu,
} satisfies Meta<typeof SelectMenu>

export default meta
type Story = StoryObj<typeof meta>

const modes: SelectMenuOption[] = [
  { value: 'ask', label: 'Спрашивать', description: 'Каждое действие ждёт подтверждения' },
  { value: 'edit', label: 'Править файлы', description: 'Команды — с подтверждением' },
  { value: 'auto', label: 'Автономно', description: 'Без вопросов, в песочнице' },
  { value: 'plan', label: 'Только план', disabled: true },
]

const models: SelectMenuOption[] = [
  { value: 'opus', label: 'Opus', group: 'Anthropic' },
  { value: 'sonnet', label: 'Sonnet', group: 'Anthropic' },
  { value: 'gpt', label: 'GPT', group: 'OpenAI' },
  { value: 'local', label: 'Локальная модель', group: 'Свои' },
]

function Fields() {
  const [mode, setMode] = useState('edit')
  return (
    <div className="sb-stack" style={{ maxWidth: 320 }}>
      <Field label="Режим доступа">
        <SelectMenu options={modes} value={mode} onValueChange={setMode} />
      </Field>
      <Field label="Модель">
        <SelectMenu options={models} placeholder="Выберите модель" />
      </Field>
      <Field label="С ошибкой" error="Выберите модель">
        <SelectMenu options={models} placeholder="Выберите модель" invalid />
      </Field>
      <Field label="Недоступно">
        <SelectMenu options={models} defaultValue="opus" disabled />
      </Field>
      <div className="sb-row">
        <SelectMenu aria-label="Вид" variant="ghost" compact options={modes} defaultValue="ask" />
        <div style={{ width: 140 }}>
          <SelectMenu aria-label="Модель" compact options={models} defaultValue="sonnet" />
        </div>
      </div>
    </div>
  )
}

export const Closed: Story = { args: { options: [] }, render: () => <Fields /> }

export const OpenWithDescriptions: Story = {
  args: { options: [] },
  render: () => (
    <div style={{ maxWidth: 320, height: 260 }}>
      <SelectMenu aria-label="Режим доступа" options={modes} defaultValue="edit" defaultOpen />
    </div>
  ),
}

export const OpenWithGroups: Story = {
  args: { options: [] },
  render: () => (
    <div style={{ maxWidth: 240, height: 280 }}>
      <SelectMenu aria-label="Модель" options={models} defaultValue="sonnet" defaultOpen />
    </div>
  ),
}
