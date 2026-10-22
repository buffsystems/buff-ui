import type { Meta, StoryObj } from '@storybook/react-vite'
import { Filter, Gauge, Info } from 'lucide-react'
import {
  Button,
  Field,
  Input,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '../src/react/index.ts'

const meta = { title: 'Overlays/Popover', component: Popover } satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Sides: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        alignItems: 'start',
        justifyItems: 'start',
        height: 320,
      }}
    >
      <Popover open>
        <PopoverTrigger asChild>
          <Button leadingIcon={Gauge}>Расход</Button>
        </PopoverTrigger>
        <PopoverContent arrow align="start">
          <PopoverTitle>Расход сессии</PopoverTitle>
          <PopoverDescription>12 400 токенов · 0,42 $ · 3 инструмента</PopoverDescription>
        </PopoverContent>
      </Popover>
      <Popover open>
        <PopoverTrigger asChild>
          <Button leadingIcon={Filter}>Фильтр</Button>
        </PopoverTrigger>
        <PopoverContent align="start" style={{ width: 240 }}>
          <div className="sb-stack" style={{ gap: '0.75rem' }}>
            <PopoverTitle>Показывать файлы</PopoverTitle>
            <Field label="Маска">
              <Input compact defaultValue="src/**/*.tsx" />
            </Field>
            <div className="sb-row" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
              <PopoverClose asChild>
                <Button size="sm" variant="ghost">
                  Сбросить
                </Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button size="sm" variant="primary">
                  Применить
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div style={{ marginTop: 300 }}>
        <Popover open>
          <PopoverTrigger asChild>
            <Button leadingIcon={Info} variant="ghost">
              Модель
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" arrow>
            <PopoverDescription>Контекст 200k, рассуждения включены</PopoverDescription>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
}
