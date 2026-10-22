import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Copy, FolderInput, MoreHorizontal, Pencil, SlidersHorizontal, Trash2 } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  IconButton,
  Tooltip,
} from '../src/react/index.ts'

const meta = { title: 'Overlays/Menu & Tooltip', component: DropdownMenu } satisfies Meta<
  typeof DropdownMenu
>

export default meta
type Story = StoryObj<typeof meta>

export const Menu: Story = {
  render: () => (
    <div style={{ height: 220 }}>
      <DropdownMenu open>
        <DropdownMenuTrigger asChild>
          <IconButton icon={MoreHorizontal} aria-label="Действия" variant="outline" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Задача #42</DropdownMenuLabel>
          <DropdownMenuItem>
            <Pencil /> Переименовать
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy /> Копировать ссылку
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Архивировать</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>
            <Trash2 /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}

function ViewMenu() {
  const [wrap, setWrap] = useState(true)
  const [minimap, setMinimap] = useState(false)
  const [sort, setSort] = useState('date')
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger asChild>
        <Button leadingIcon={SlidersHorizontal}>Вид</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem shortcut="⌘R">Обновить</DropdownMenuItem>
        <DropdownMenuItem shortcut="⇧⌘C">
          <Copy /> Копировать путь
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Редактор</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap} shortcut="⌥Z">
          Переносить строки
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={minimap} onCheckedChange={setMinimap}>
          Мини-карта
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Сортировка</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="name">По имени</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">По дате</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub open>
          <DropdownMenuSubTrigger>
            <FolderInput /> Переместить
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>В архив</DropdownMenuItem>
            <DropdownMenuItem>В проект «auth»</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem destructive shortcut="⌘⌫">
          <Trash2 /> Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Choices: Story = {
  render: () => (
    <div style={{ height: 420 }}>
      <ViewMenu />
    </div>
  ),
}

export const Hint: Story = {
  render: () => (
    <div className="sb-row" style={{ padding: '3rem 0' }}>
      <Tooltip content="Скопировать в буфер">
        <Button leadingIcon={Copy}>Наведите</Button>
      </Tooltip>
      <Tooltip variant="popover" side="right" content="Задача остановлена: нужен ответ">
        <Button>Поповер</Button>
      </Tooltip>
    </div>
  ),
}
