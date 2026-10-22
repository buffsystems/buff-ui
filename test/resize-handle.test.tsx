// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ResizeHandle } from '../src/react/index.ts'
import type { ResizeHandleProps } from '../src/react/index.ts'
import { growth } from '../src/react/ResizeHandle.tsx'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

function Pane(props: Partial<ResizeHandleProps> & { initial?: number }) {
  const [size, setSize] = useState(props.initial ?? 300)
  return (
    <ResizeHandle
      aria-label="Ширина боковой панели"
      direction="horizontal"
      min={200}
      max={400}
      {...props}
      size={size}
      onResize={(next) => {
        setSize(next)
        props.onResize?.(next)
      }}
    />
  )
}

describe('growth', () => {
  test('an end-edge handle grows the pane forward, a start-edge one backward', () => {
    expect(growth(30, 'end')).toBe(30)
    expect(growth(30, 'start')).toBe(-30)
    expect(growth(30, 'end', true)).toBe(-30)
  })
})

describe('ResizeHandle', () => {
  test('is a focusable separator carrying the size as its value', () => {
    render(<Pane />)
    const handle = screen.getByRole('separator', { name: 'Ширина боковой панели' })
    expect(handle.className).toBe('ui-resize-handle')
    expect(handle.tabIndex).toBe(0)
    expect(handle.getAttribute('aria-orientation')).toBe('vertical')
    expect(handle.getAttribute('aria-valuenow')).toBe('300')
    expect(handle.getAttribute('aria-valuemin')).toBe('200')
    expect(handle.getAttribute('aria-valuemax')).toBe('400')
  })

  test('arrow keys step the size, Shift steps further, Home and End jump to the limits', async () => {
    const user = userEvent.setup()
    const onResizeEnd = vi.fn()
    render(<Pane onResizeEnd={onResizeEnd} />)
    const handle = screen.getByRole('separator')
    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(handle.getAttribute('aria-valuenow')).toBe('316')
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    expect(handle.getAttribute('aria-valuenow')).toBe('252')
    await user.keyboard('{End}')
    expect(handle.getAttribute('aria-valuenow')).toBe('400')
    await user.keyboard('{ArrowRight}')
    expect(handle.getAttribute('aria-valuenow')).toBe('400')
    await user.keyboard('{Home}')
    expect(onResizeEnd).toHaveBeenLastCalledWith(200)
  })

  test('a start-edge vertical handle grows its pane as it moves up', async () => {
    const user = userEvent.setup()
    render(<Pane aria-label="Высота терминала" direction="vertical" edge="start" />)
    const handle = screen.getByRole('separator')
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal')
    handle.focus()
    await user.keyboard('{ArrowUp}')
    expect(handle.getAttribute('aria-valuenow')).toBe('316')
  })

  test('dragging follows the pointer within the limits and reports the end', () => {
    const onResizeEnd = vi.fn()
    render(<Pane onResizeEnd={onResizeEnd} />)
    const handle = screen.getByRole('separator')
    fireEvent.pointerDown(handle, { clientX: 500, button: 0, pointerId: 1 })
    expect(handle.hasAttribute('data-dragging')).toBe(true)
    fireEvent.pointerMove(handle, { clientX: 540 })
    expect(handle.getAttribute('aria-valuenow')).toBe('340')
    fireEvent.pointerMove(handle, { clientX: 900 })
    expect(handle.getAttribute('aria-valuenow')).toBe('400')
    fireEvent.pointerUp(handle, { clientX: 900 })
    expect(handle.hasAttribute('data-dragging')).toBe(false)
    expect(onResizeEnd).toHaveBeenCalledWith(400)
  })

  test('released below the collapse size, the pane collapses', async () => {
    const onCollapse = vi.fn()
    const onResizeEnd = vi.fn()
    render(<Pane collapseBelow={120} onCollapse={onCollapse} onResizeEnd={onResizeEnd} />)
    const handle = screen.getByRole('separator')
    fireEvent.pointerDown(handle, { clientX: 500, button: 0 })
    fireEvent.pointerMove(handle, { clientX: 300 })
    expect(handle.getAttribute('aria-valuenow')).toBe('200')
    fireEvent.pointerUp(handle, { clientX: 300 })
    expect(onCollapse).toHaveBeenCalledTimes(1)
    expect(onResizeEnd).not.toHaveBeenCalled()
    handle.focus()
    await userEvent.setup().keyboard('{Enter}')
    expect(onCollapse).toHaveBeenCalledTimes(2)
  })
})
