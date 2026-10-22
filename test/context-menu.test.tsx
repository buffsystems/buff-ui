// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
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
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

function TabMenu({ onClose, onSplit }: { onClose?: () => void; onSplit?: (to: string) => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button type="button">screen.tsx</button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Вкладка</ContextMenuLabel>
        <ContextMenuCheckboxItem checked>Закрепить</ContextMenuCheckboxItem>
        <ContextMenuRadioGroup value="left">
          <ContextMenuRadioItem value="left">Слева</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Разделить</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onSelect={() => onSplit?.('right')}>Вправо</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem destructive shortcut="⌘W" onSelect={onClose}>
          Закрыть
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe('ContextMenu', () => {
  test('a right click opens the menu in the shared look; an item runs and closes it', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TabMenu onClose={onClose} />)
    await user.pointer({ keys: '[MouseRight]', target: screen.getByText('screen.tsx') })
    expect(screen.getByRole('menu').className).toBe('ui-menu')
    expect(screen.getByText('Вкладка').className).toBe('ui-menu__label')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Закрепить' }).className).toBe(
      'ui-menu__item ui-menu__item--choice',
    )
    expect(screen.getByRole('menuitemradio', { name: 'Слева' }).getAttribute('aria-checked')).toBe(
      'true',
    )
    const close = screen.getByRole('menuitem', { name: 'Закрыть ⌘W' })
    expect(close.className).toBe('ui-menu__item ui-menu__item--destructive')
    await user.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('the keyboard opens it too: Shift+F10 and the menu key fire contextmenu on the focus', () => {
    render(<TabMenu />)
    const tab = screen.getByText('screen.tsx')
    tab.focus()
    fireEvent.contextMenu(tab)
    expect(screen.getByRole('menu')).toBeTruthy()
  })

  test('a long press on touch opens it', () => {
    vi.useFakeTimers()
    render(<TabMenu />)
    fireEvent.pointerDown(screen.getByText('screen.tsx'), { pointerType: 'touch' })
    expect(screen.queryByRole('menu')).toBeNull()
    act(() => vi.advanceTimersByTime(700))
    expect(screen.getByRole('menu')).toBeTruthy()
    vi.useRealTimers()
  })

  test('a submenu opens from the keyboard', async () => {
    const user = userEvent.setup()
    const onSplit = vi.fn()
    render(<TabMenu onSplit={onSplit} />)
    fireEvent.contextMenu(screen.getByText('screen.tsx'))
    screen.getByRole('menuitem', { name: 'Разделить' }).focus()
    await user.keyboard('{ArrowRight}')
    await user.click(await screen.findByRole('menuitem', { name: 'Вправо' }))
    expect(onSplit).toHaveBeenCalledWith('right')
  })
})
