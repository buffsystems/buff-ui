import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, RadioGroup, RadioItem } from '../src/react/index.ts'

const meta = { title: 'Inputs/RadioGroup', component: RadioGroup } satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Choices: Story = {
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 380 }}>
      <Field label="Где открывать терминал" group>
        <RadioGroup aria-label="Где открывать терминал" defaultValue="bottom">
          <RadioItem value="bottom" label="Снизу" hint="Под лентой сессии" />
          <RadioItem value="right" label="Справа" hint="Рядом с файлами" />
          <RadioItem value="tab" label="Во вкладке" hint="Скоро" disabled />
        </RadioGroup>
      </Field>
      <Field label="Тема" group>
        <RadioGroup aria-label="Тема" orientation="horizontal" defaultValue="system">
          <RadioItem value="light" label="Светлая" />
          <RadioItem value="dark" label="Тёмная" />
          <RadioItem value="system" label="Как в системе" />
        </RadioGroup>
      </Field>
    </div>
  ),
}
