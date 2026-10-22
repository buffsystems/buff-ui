import type { Meta, StoryObj } from '@storybook/react-vite'
import { GitCommitHorizontal, SquareArrowOutUpRight } from 'lucide-react'
import { DropdownMenuItem, DropdownMenuSeparator, SplitButton } from '../src/react/index.ts'

const meta = { title: 'Actions/SplitButton', component: SplitButton } satisfies Meta<
  typeof SplitButton
>

export default meta
type Story = StoryObj<typeof meta>

const apps = (
  <>
    <DropdownMenuItem>Cursor</DropdownMenuItem>
    <DropdownMenuItem>Zed</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Показать в Finder</DropdownMenuItem>
  </>
)

const args = { children: '', menu: null, menuLabel: '' }

export const Variants: Story = {
  args,
  render: () => (
    <div className="sb-stack">
      <div className="sb-row">
        <SplitButton leadingIcon={SquareArrowOutUpRight} menu={apps} menuLabel="Другие приложения">
          Открыть в VS Code
        </SplitButton>
        <SplitButton
          variant="primary"
          leadingIcon={GitCommitHorizontal}
          menu={<DropdownMenuItem>Закоммитить и отправить</DropdownMenuItem>}
          menuLabel="Другие варианты"
        >
          Закоммитить
        </SplitButton>
        <SplitButton variant="secondary" menu={apps} menuLabel="Другие приложения">
          Открыть
        </SplitButton>
      </div>
      <div className="sb-row">
        <SplitButton size="sm" menu={apps} menuLabel="Другие приложения">
          Открыть в VS Code
        </SplitButton>
        <SplitButton size="sm" variant="primary" menu={apps} menuLabel="Другие варианты">
          Применить
        </SplitButton>
        <SplitButton size="sm" variant="primary" loading menu={apps} menuLabel="Другие варианты">
          Применяю
        </SplitButton>
        <SplitButton size="sm" disabled menu={apps} menuLabel="Другие приложения">
          Недоступно
        </SplitButton>
      </div>
    </div>
  ),
}

export const MenuOpen: Story = {
  args,
  render: () => (
    <div style={{ height: 200 }}>
      <SplitButton leadingIcon={SquareArrowOutUpRight} menu={apps} menuLabel="Другие приложения">
        Открыть в VS Code
      </SplitButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    canvasElement
      .querySelector('.ui-split-btn__toggle')
      ?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
  },
}
