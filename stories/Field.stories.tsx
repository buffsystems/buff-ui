import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, Input, Label, Select, Textarea } from '../src/react/index.ts'

const meta = { title: 'Inputs/Fields', component: Field } satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Form: Story = {
  args: { label: '', children: null },
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 380 }}>
      <Field label="Название" hint="Видно всем участникам организации">
        <Input placeholder="dev_project" />
      </Field>
      <Field label="Почта" error="Неверный адрес">
        <Input type="email" defaultValue="ada@" aria-invalid />
      </Field>
      <Field label="Роль">
        <Select defaultValue="dev">
          <option value="owner">Владелец</option>
          <option value="dev">Разработчик</option>
          <option value="viewer">Наблюдатель</option>
        </Select>
      </Field>
      <Field label="Описание">
        <Textarea placeholder="Что нужно сделать" />
      </Field>
      <Field label="Недоступно">
        <Input disabled defaultValue="только чтение" />
      </Field>
      <Label>
        <input type="checkbox" /> Отдельная подпись
      </Label>
    </div>
  ),
}
