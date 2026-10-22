import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilePlus2, GitFork, Moon, Settings, SquarePen, Terminal } from 'lucide-react'
import { Badge, CommandList, Kbd, Panel } from '../src/react/index.ts'
import type { CommandItem } from '../src/react/index.ts'

const meta = { title: 'Inputs/CommandList', component: CommandList } satisfies Meta<
  typeof CommandList
>

export default meta
type Story = StoryObj<typeof meta>

const commands: CommandItem[] = [
  {
    value: 'new',
    label: 'Новая сессия',
    group: 'Сессия',
    icon: <SquarePen />,
    hint: <Kbd>⌘N</Kbd>,
  },
  {
    value: 'fork',
    label: 'Ответвить сессию',
    description: 'Новая сессия с историей до этого места',
    group: 'Сессия',
    icon: <GitFork />,
  },
  {
    value: 'terminal',
    label: 'Открыть терминал',
    group: 'Вид',
    icon: <Terminal />,
    hint: <Kbd>⌃`</Kbd>,
  },
  { value: 'theme', label: 'Сменить тему', group: 'Вид', icon: <Moon /> },
  { value: 'file', label: 'Новый файл', group: 'Файлы', icon: <FilePlus2 />, disabled: true },
  {
    value: 'settings',
    label: 'Настройки',
    group: 'Приложение',
    icon: <Settings />,
    hint: <Kbd>⌘,</Kbd>,
  },
]

const models: CommandItem[] = [
  { value: 'opus', label: 'Opus', group: 'Anthropic', description: 'Сложные задачи' },
  { value: 'sonnet', label: 'Sonnet', group: 'Anthropic', description: 'Быстро и точно' },
  { value: 'haiku', label: 'Haiku', group: 'Anthropic', hint: <Badge tone="ok">бесплатно</Badge> },
  { value: 'gpt', label: 'GPT', group: 'OpenAI' },
  { value: 'local', label: 'Локальная модель', group: 'Свои', keywords: ['ollama'] },
]

const args = { items: [], onSelect: () => {}, label: '' }

export const Palette: Story = {
  args,
  render: () => (
    <Panel style={{ maxWidth: 520 }}>
      <CommandList
        label="Команды"
        placeholder="Команда, сессия или файл"
        items={commands}
        onSelect={() => {}}
      />
    </Panel>
  ),
}

export const ModelPicker: Story = {
  args,
  render: () => (
    <Panel style={{ maxWidth: 320 }}>
      <CommandList
        label="Модель"
        placeholder="Найти модель"
        items={models}
        current="sonnet"
        onSelect={() => {}}
      />
    </Panel>
  ),
}

export const NothingFound: Story = {
  args,
  render: () => (
    <Panel style={{ maxWidth: 320 }}>
      <CommandList label="Модель" query="xyz" items={models} onSelect={() => {}} />
    </Panel>
  ),
}
