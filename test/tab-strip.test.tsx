// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createRef } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TabStrip, TabStripTab, TabStripTrigger } from '../src/react/index.ts'

afterEach(cleanup)

describe('TabStrip', () => {
  test('a named tab list in its orientation, tabs carrying the active, drag and drop states', () => {
    const wrapper = createRef<HTMLDivElement>()
    render(
      <TabStrip label="Открытые вкладки" orientation="vertical">
        <TabStripTab ref={wrapper} active data-tab-key="a">
          <TabStripTrigger selected>Сессия</TabStripTrigger>
        </TabStripTab>
        <TabStripTab dragging drop="after">
          <TabStripTrigger>Черновик</TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    const list = screen.getByRole('tablist', { name: 'Открытые вкладки' })
    expect(list.className).toBe('ui-tab-strip')
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    const [first, second] = screen.getAllByRole('tab')
    expect(first.getAttribute('aria-selected')).toBe('true')
    expect(first.tabIndex).toBe(0)
    expect(second.tabIndex).toBe(-1)
    expect(wrapper.current?.hasAttribute('data-active')).toBe(true)
    expect(wrapper.current?.getAttribute('data-tab-key')).toBe('a')
    const dragged = second.parentElement as HTMLElement
    expect(dragged.hasAttribute('data-dragging')).toBe(true)
    expect(dragged.getAttribute('data-drop')).toBe('after')
    expect(dragged.hasAttribute('data-active')).toBe(false)
  })

  test('the close button closes without opening the tab or starting a drag', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onOpen = vi.fn()
    const onDragStart = vi.fn()
    render(
      <TabStrip label="Вкладки">
        <TabStripTab onClose={onClose} closeLabel="Close tab" onPointerDown={onDragStart}>
          <TabStripTrigger onClick={onOpen}>main.ts</TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    const close = screen.getByRole('button', { name: 'Close tab' })
    fireEvent.pointerDown(close)
    expect(onDragStart).not.toHaveBeenCalled()
    await user.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onOpen).not.toHaveBeenCalled()
  })

  test('no close button without onClose; a link can be the trigger', () => {
    render(
      <TabStrip label="Вкладки">
        <TabStripTab>
          <TabStripTrigger asChild selected>
            <a href="#/session/1">Сессия</a>
          </TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    expect(screen.queryByRole('button')).toBeNull()
    const link = screen.getByRole('tab', { name: 'Сессия' })
    expect(link.tagName).toBe('A')
    expect(link.className).toBe('ui-tab-strip__trigger')
  })
})

describe('TabStripTab close button', () => {
  test('takes data hooks, a ref and handlers that run after the strip keeps the press', () => {
    const onClose = vi.fn()
    const onPointerDown = vi.fn()
    const onDragStart = vi.fn()
    const ref = createRef<HTMLButtonElement>()
    render(
      <TabStrip label="Вкладки">
        <TabStripTab
          onClose={onClose}
          onPointerDown={onDragStart}
          closeProps={{
            ref,
            'data-slot': 'tab-close',
            'data-variant': 'ghost-muted',
            className: 'extra',
            onPointerDown,
          }}
        >
          <TabStripTrigger>main.ts</TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    const close = screen.getByRole('button', { name: 'Закрыть вкладку' })
    expect(ref.current).toBe(close)
    expect(close.getAttribute('data-slot')).toBe('tab-close')
    expect(close.getAttribute('data-variant')).toBe('ghost-muted')
    expect(close.classList.contains('ui-tab-strip__close')).toBe(true)
    expect(close.classList.contains('extra')).toBe(true)
    fireEvent.pointerDown(close)
    expect(onPointerDown).toHaveBeenCalledTimes(1)
    expect(onDragStart).not.toHaveBeenCalled()
    fireEvent.click(close)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('a tooltip with a keybind hint names the action on hover', async () => {
    const user = userEvent.setup()
    render(
      <TabStrip label="Вкладки">
        <TabStripTab onClose={() => {}} closeTooltip={<span>Закрыть вкладку ⌘W</span>}>
          <TabStripTrigger>main.ts</TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    const close = screen.getByRole('button', { name: 'Закрыть вкладку' })
    await user.hover(close)
    expect((await screen.findByRole('tooltip')).textContent).toContain('⌘W')
  })
})

describe('TabStrip nav mode', () => {
  test('links without tab roles; the active one is the current page', () => {
    const list = createRef<HTMLDivElement>()
    render(
      <TabStrip nav label="Открытые сессии" ref={list}>
        <TabStripTab active>
          <TabStripTrigger asChild selected>
            <a href="#/session/1">Сессия</a>
          </TabStripTrigger>
        </TabStripTab>
        <TabStripTab>
          <TabStripTrigger asChild>
            <a href="#/session/2">Черновик</a>
          </TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    expect(screen.queryByRole('tablist')).toBeNull()
    expect(screen.queryAllByRole('tab')).toEqual([])
    const nav = screen.getByRole('navigation', { name: 'Открытые сессии' })
    expect(nav).toBe(list.current)
    expect(nav.hasAttribute('aria-orientation')).toBe(false)
    const [current, other] = screen.getAllByRole('link')
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(current.hasAttribute('aria-selected')).toBe(false)
    expect(current.hasAttribute('tabindex')).toBe(false)
    expect(other.hasAttribute('aria-current')).toBe(false)
  })

  test('without a label the strip is a plain container, not a landmark', () => {
    const { container } = render(
      <TabStrip nav>
        <TabStripTab>
          <TabStripTrigger selected>Сессия</TabStripTrigger>
        </TabStripTab>
      </TabStrip>,
    )
    expect(screen.queryByRole('navigation')).toBeNull()
    expect((container.firstChild as HTMLElement).hasAttribute('role')).toBe(false)
    const button = screen.getByRole('button', { name: 'Сессия' })
    expect(button.getAttribute('aria-current')).toBe('page')
  })
})
