// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../src/react/index.ts'
import type { DropdownMenuContentProps } from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

function View(props: Partial<DropdownMenuContentProps> & { onMove?: (to: string) => void }) {
  const { onMove, ...content } = props
  const [wrap, setWrap] = useState(false)
  const [sort, setSort] = useState('name')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Вид</DropdownMenuTrigger>
      <DropdownMenuContent {...content}>
        <DropdownMenuItem shortcut="⌘R">Обновить</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
          Переносить строки
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="name">По имени</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">По дате</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Переместить</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => onMove?.('archive')}>В архив</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  test('an item ends in its key hint', async () => {
    const user = userEvent.setup()
    render(<View />)
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    const item = screen.getByRole('menuitem', { name: 'Обновить ⌘R' })
    expect(item.lastElementChild?.className).toBe('ui-menu__shortcut')
  })

  test('a checkbox item toggles and shows its check', async () => {
    const user = userEvent.setup()
    render(<View />)
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    const wrap = screen.getByRole('menuitemcheckbox', { name: 'Переносить строки' })
    expect(wrap.className).toBe('ui-menu__item ui-menu__item--choice')
    expect(wrap.getAttribute('aria-checked')).toBe('false')
    await user.click(wrap)
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    const checked = screen.getByRole('menuitemcheckbox', { name: 'Переносить строки' })
    expect(checked.getAttribute('aria-checked')).toBe('true')
    expect(checked.querySelector('.ui-menu__indicator svg')).toBeTruthy()
  })

  test('radio items pick one value of their group', async () => {
    const user = userEvent.setup()
    render(<View />)
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'По дате' }))
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    expect(
      screen.getByRole('menuitemradio', { name: 'По дате' }).getAttribute('aria-checked'),
    ).toBe('true')
    expect(
      screen.getByRole('menuitemradio', { name: 'По имени' }).getAttribute('aria-checked'),
    ).toBe('false')
    expect(document.querySelector('[aria-checked="true"] .ui-menu__dot')).toBeTruthy()
  })

  test('the arrow key opens a submenu whose item can be chosen', async () => {
    const user = userEvent.setup()
    const onMove = vi.fn()
    render(<View onMove={onMove} />)
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    const sub = screen.getByRole('menuitem', { name: 'Переместить' })
    expect(sub.className).toBe('ui-menu__item ui-menu__sub')
    sub.focus()
    await user.keyboard('{ArrowRight}')
    const archive = await screen.findByRole('menuitem', { name: 'В архив' })
    expect(archive.closest('[role="menu"]')?.className).toBe('ui-menu')
    await user.click(archive)
    expect(onMove).toHaveBeenCalledWith('archive')
  })

  test('the content passes the open and close focus handlers through', async () => {
    const user = userEvent.setup()
    const onOpenAutoFocus = vi.fn()
    const onCloseAutoFocus = vi.fn()
    render(<View onOpenAutoFocus={onOpenAutoFocus} onCloseAutoFocus={onCloseAutoFocus} />)
    await user.click(screen.getByRole('button', { name: 'Вид' }))
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1)
    await user.keyboard('{Escape}')
    expect(onCloseAutoFocus).toHaveBeenCalledTimes(1)
  })
})
