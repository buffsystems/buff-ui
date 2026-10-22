import type { Meta, StoryObj } from '@storybook/react-vite'
import { CopyField, Field } from '../src/react/index.ts'

const meta = { title: 'Inputs/CopyField', component: CopyField } satisfies Meta<typeof CopyField>

export default meta
type Story = StoryObj<typeof meta>

// The story copies into a fake clipboard: the preview iframe may not have the permission.
const fakeCopy = (): boolean => true

export const Values: Story = {
  args: { value: '' },
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 380 }}>
      <Field label="Код подтверждения" hint="Введите его на странице провайдера">
        <CopyField value="WDJB-MJHT" mono copy={fakeCopy} />
      </Field>
      <Field label="Адрес вебхука">
        <CopyField
          value="https://buff.systems/hooks/b5a1c0e2-7f3d-4a8e-9c61-2d4f8e1a9b70"
          copy={fakeCopy}
        />
      </Field>
      <Field label="Токен (компактно, English labels)">
        <CopyField
          value="tok_live_4f2a9c"
          mono
          compact
          copyLabel="Copy"
          copiedLabel="Copied"
          copy={fakeCopy}
        />
      </Field>
      <Field label="Недоступно">
        <CopyField value="—" disabled copy={fakeCopy} />
      </Field>
    </div>
  ),
}

// A long key or fingerprint shown whole: it wraps anywhere, the copy button stays at the top end.
export const Multiline: Story = {
  args: { value: '' },
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 480 }}>
      <Field label="Публичный ключ">
        <CopyField
          value="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM2b7lq0x4Jr2dQ0cWp6c4mO1y8vY0bH3g7kZ9uT5sN2 deploy@buff"
          mono
          multiline
          copy={fakeCopy}
        />
      </Field>
      <Field label="Отпечаток">
        <CopyField
          value="SHA256:Jr2dQ0cWp6c4mO1y8vY0bH3g7kZ9uT5sN2xA4eL6fR8qW1zP"
          mono
          multiline
          copy={fakeCopy}
        />
      </Field>
      <Field label="Короткое значение — одна строка, как обычное поле">
        <CopyField value="WDJB-MJHT" mono multiline copy={fakeCopy} />
      </Field>
      <Field label="Для сравнения: в одну строку">
        <CopyField
          value="SHA256:Jr2dQ0cWp6c4mO1y8vY0bH3g7kZ9uT5sN2xA4eL6fR8qW1zP"
          mono
          copy={fakeCopy}
        />
      </Field>
    </div>
  ),
}
