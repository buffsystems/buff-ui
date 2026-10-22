import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InlineInput } from '../src/react/index.ts'

const meta = { title: 'Inputs/InlineInput', component: InlineInput } satisfies Meta<
  typeof InlineInput
>

export default meta
type Story = StoryObj<typeof meta>

function Titles() {
  const [title, setTitle] = useState('Рефакторинг входа через SSO')
  const [draft, setDraft] = useState(title)
  return (
    <div className="sb-stack" style={{ maxWidth: 480 }}>
      <p className="sb-caption">Заголовок сессии (наведите или кликните)</p>
      <div className="ui-title">
        <InlineInput
          aria-label="Название сессии"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onCommit={(value) => setTitle(value.trim() || title)}
          onCancel={() => setDraft(title)}
        />
      </div>
      <p className="sb-caption">В фокусе</p>
      <div className="ui-title--sm" style={{ fontWeight: 500 }}>
        <InlineInput aria-label="Название вкладки" defaultValue="screen.tsx" data-focus />
      </div>
      <p className="sb-caption">Недоступно, пока сохраняется</p>
      <div className="ui-note">
        <InlineInput aria-label="Проект" defaultValue="acme" disabled />
      </div>
    </div>
  )
}

export const Rename: Story = {
  render: () => <Titles />,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('[data-focus]')?.focus()
  },
}

// Bare: the field's text sits exactly where the plain words would — compare with the line above.
export const Bare: Story = {
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 480 }}>
      <p className="sb-caption">Обычный текст и bare-поле под ним — буквы на одной вертикали</p>
      <div className="ui-title--sm" style={{ fontWeight: 500 }}>
        <div>Рефакторинг входа через SSO</div>
        <InlineInput bare aria-label="Название сессии" defaultValue="Рефакторинг входа через SSO" />
      </div>
      <p className="sb-caption">Вкладки: переименование в фокусе</p>
      <div className="sb-row" style={{ gap: '1.5rem', fontSize: 13, padding: '0.5rem' }}>
        <span>session.ts</span>
        <InlineInput bare aria-label="Название вкладки" defaultValue="screen.tsx" data-focus />
        <span>README.md</span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLInputElement>('[data-focus]')?.select()
  },
}
