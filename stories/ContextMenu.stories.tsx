import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Columns2, Copy, Pencil, X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../src/react/index.ts'

const meta = { title: 'Overlays/ContextMenu', component: ContextMenu } satisfies Meta<
  typeof ContextMenu
>

export default meta
type Story = StoryObj<typeof meta>

function TabMenu() {
  const [pinned, setPinned] = useState(true)
  const [wrap, setWrap] = useState('soft')
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card tabIndex={0} style={{ maxWidth: 360 }} data-target>
          <CardHeader>
            <CardTitle>screen.tsx</CardTitle>
            <CardDescription>
              Правая кнопка, Shift+F10 или клавиша меню; на телефоне — долгое нажатие
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Вкладка</ContextMenuLabel>
        <ContextMenuItem shortcut="F2">
          <Pencil /> Переименовать
        </ContextMenuItem>
        <ContextMenuItem shortcut="⌥⌘C">
          <Copy /> Копировать путь
        </ContextMenuItem>
        <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Закрепить
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Columns2 /> Разделить
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Вправо</ContextMenuItem>
            <ContextMenuItem>Вниз</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuLabel>Перенос строк</ContextMenuLabel>
        <ContextMenuRadioGroup value={wrap} onValueChange={setWrap}>
          <ContextMenuRadioItem value="off">Без переноса</ContextMenuRadioItem>
          <ContextMenuRadioItem value="soft">По ширине окна</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem destructive shortcut="⌘W">
          <X /> Закрыть
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export const OnATab: Story = {
  render: () => (
    <div style={{ height: 460 }}>
      <TabMenu />
    </div>
  ),
  // Open it as a right click in the middle of the card would.
  play: async ({ canvasElement }) => {
    const target = canvasElement.querySelector<HTMLElement>('[data-target]')
    if (!target) return
    const box = target.getBoundingClientRect()
    target.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: box.left + 120,
        clientY: box.top + 40,
      }),
    )
  },
}
