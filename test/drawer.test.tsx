// @vitest-environment jsdom
import type { HTMLAttributes } from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer, DrawerBody, DrawerFooter } from '../src/react/index.ts'

afterEach(cleanup)

describe('Drawer', () => {
  test('a bottom sheet is a named modal dialog with a grip; Escape closes it', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="Вкладки">
        <DrawerBody>
          <button type="button">screen.tsx</button>
        </DrawerBody>
      </Drawer>,
    )
    const sheet = screen.getByRole('dialog', { name: 'Вкладки' })
    expect(sheet.className).toBe('ui-drawer ui-drawer--bottom')
    expect(sheet.firstElementChild?.className).toBe('ui-drawer__handle')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'screen.tsx' }))
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  test('a side panel takes its side and width, a description and a footer', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Drawer
        open
        onOpenChange={onOpenChange}
        side="right"
        size="lg"
        title="Инспектор"
        description="Вызов инструмента"
      >
        <DrawerBody>тело</DrawerBody>
        <DrawerFooter>
          <button type="button">Готово</button>
        </DrawerFooter>
      </Drawer>,
    )
    const panel = screen.getByRole('dialog', { name: 'Инспектор' })
    expect(panel.className).toBe('ui-drawer ui-drawer--right ui-drawer--lg')
    expect(panel.querySelector('.ui-drawer__handle')).toBeNull()
    expect(panel.getAttribute('aria-describedby')).toBe(screen.getByText('Вызов инструмента').id)
    expect(screen.getByText('Готово').parentElement?.className).toBe('ui-drawer__footer')
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  test('hideClose drops the × and the header room kept for it', () => {
    render(<Drawer open onOpenChange={() => {}} hideClose title="Сессии" />)
    expect(screen.queryByRole('button', { name: 'Закрыть' })).toBeNull()
    expect(document.querySelector('.ui-drawer__header')?.className).toBe('ui-drawer__header')
  })

  test('hideTitle keeps the name for screen readers; slots take extra attributes', () => {
    render(
      <Drawer
        open
        onOpenChange={() => {}}
        hideTitle
        title="Вкладки"
        overlayProps={{ 'data-slot': 'drawer-overlay' } as HTMLAttributes<HTMLDivElement>}
        contentProps={{ 'data-slot': 'drawer-content' } as HTMLAttributes<HTMLDivElement>}
        handleProps={{ 'data-slot': 'drawer-handle' } as HTMLAttributes<HTMLDivElement>}
      />,
    )
    const sheet = screen.getByRole('dialog', { name: 'Вкладки' })
    expect(sheet.dataset.slot).toBe('drawer-content')
    expect(sheet.className).toBe('ui-drawer ui-drawer--bottom')
    expect(document.querySelector('[data-slot="drawer-overlay"]')?.className).toBe(
      'ui-drawer-overlay',
    )
    expect(sheet.querySelector('[data-slot="drawer-handle"]')?.className).toBe('ui-drawer__handle')
    expect(sheet.querySelector('.ui-drawer__header')?.className).toContain('ui-sr-only')
  })
})
