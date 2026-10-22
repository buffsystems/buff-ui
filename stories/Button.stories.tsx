import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, IconButton } from '../src/react/index.ts'
import type { ButtonSize, ButtonVariant } from '../src/react/index.ts'

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Сохранить', variant: 'outline', size: 'md' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const variants: ButtonVariant[] = [
  'primary',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
]
const sizes = ['sm', 'md', 'lg'] as const satisfies ButtonSize[]

export const Variants: Story = {
  render: () => (
    <div className="sb-stack">
      {sizes.map((size) => (
        <div key={size} className="sb-row">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="sb-row">
      <Button variant="primary" leadingIcon={Plus}>
        Новая задача
      </Button>
      <Button trailingIcon={ArrowRight}>Дальше</Button>
      <Button variant="primary" loading>
        Сохранение
      </Button>
      <Button disabled>Недоступно</Button>
    </div>
  ),
}

export const Block: Story = { args: { block: true, variant: 'primary', children: 'Войти' } }

export const AsLink: Story = {
  render: () => (
    <Button asChild variant="link">
      <a href="#docs">Документация</a>
    </Button>
  ),
}

// A link inside a sentence: no height or padding, it takes the text's size and wraps with it.
export const InlineLink: Story = {
  render: () => (
    <p style={{ maxWidth: 360, fontSize: 14, lineHeight: 1.6 }}>
      Ключ не подошёл.{' '}
      <Button variant="link" size="inline" onClick={() => {}}>
        Открыть настройки провайдера
      </Button>{' '}
      или{' '}
      <Button asChild variant="link" size="inline">
        <a href="#docs">прочитать инструкцию</a>
      </Button>
      .
    </p>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <div className="sb-stack">
      {(['xs', ...sizes] as const).map((size) => (
        <div key={size} className="sb-row">
          <IconButton icon={Pencil} aria-label="Изменить" size={size} />
          <IconButton icon={Plus} aria-label="Добавить" variant="outline" size={size} />
          <IconButton icon={Plus} aria-label="Создать" variant="primary" size={size} />
          <IconButton icon={Trash2} aria-label="Удалить" variant="danger" size={size} />
        </div>
      ))}
    </div>
  ),
}
