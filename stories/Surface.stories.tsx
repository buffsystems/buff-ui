import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Checkbox, Count, EmptyState, Label, Panel } from '../src/react/index.ts'

const meta = { title: 'Layout/Surfaces & marks', component: Panel } satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Surfaces: Story = {
  render: () => (
    <div className="sb-stack" style={{ maxWidth: 520 }}>
      <Panel style={{ padding: 16 }}>Панель — поверхность карточки без своей раскладки.</Panel>
      <EmptyState>Задач пока нет — создайте первую.</EmptyState>
      <EmptyState inline>нет изменений</EmptyState>
      <div className="sb-row">
        <Label>
          <Checkbox defaultChecked /> Подробно
        </Label>
        <Label>
          <Checkbox /> Только мои
        </Label>
      </div>
      <div className="sb-row">
        Ревью <Count>6</Count>
        Уведомления <Count tone="primary">43</Count>
        Ждут <Count tone="warn">2</Count>
      </div>
      <div className="sb-row">
        <Badge size="sm">Правило</Badge>
        <Badge size="sm" tone="info">
          видно всегда
        </Badge>
        <Badge size="sm" tone="warn">
          пользовательское
        </Badge>
        <Badge size="sm" tone="ok">
          готово
        </Badge>
      </div>
    </div>
  ),
}
