// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createRef } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InlineInput } from '../src/react/index.ts'
import type { InlineInputProps } from '../src/react/index.ts'

afterEach(cleanup)

function Rename(props: InlineInputProps) {
  return <InlineInput aria-label="Название" defaultValue="Сессия" {...props} />
}

describe('InlineInput', () => {
  test('is a named text field with the inline look', () => {
    render(<Rename />)
    const input = screen.getByRole('textbox', { name: 'Название' })
    expect(input.className).toBe('ui-inline-input')
  })

  test('Enter commits the typed value once, even though the field then loses focus', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<Rename onCommit={onCommit} />)
    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.type(input, ' 2{Enter}')
    await user.tab()
    expect(onCommit).toHaveBeenCalledTimes(1)
    expect(onCommit).toHaveBeenCalledWith('Сессия 2')
  })

  test('Escape cancels and the blur after it commits nothing', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    const onCancel = vi.fn()
    render(<Rename onCommit={onCommit} onCancel={onCancel} />)
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('x{Escape}')
    await user.tab()
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onCommit).not.toHaveBeenCalled()
  })

  test('leaving the field commits; with commitOnBlur off it does not', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    const { rerender } = render(<Rename onCommit={onCommit} />)
    await user.click(screen.getByRole('textbox'))
    await user.tab()
    expect(onCommit).toHaveBeenCalledWith('Сессия')
    rerender(<Rename onCommit={onCommit} commitOnBlur={false} />)
    onCommit.mockClear()
    await user.click(screen.getByRole('textbox'))
    await user.tab()
    expect(onCommit).not.toHaveBeenCalled()
  })

  test('Enter while an IME is composing is part of the text, not a commit', () => {
    const onCommit = vi.fn()
    render(<Rename onCommit={onCommit} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', isComposing: true })
    expect(onCommit).not.toHaveBeenCalled()
  })

  test('a ref reaches the input, so «Rename» in a menu can focus and select it', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Rename ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
    ref.current?.focus()
    ref.current?.select()
    expect(document.activeElement).toBe(ref.current)
    expect(ref.current?.selectionEnd).toBe('Сессия'.length)
  })

  test('bare sits on the text line without edge or inset', () => {
    render(<Rename bare />)
    expect(screen.getByRole('textbox').className).toBe('ui-inline-input ui-inline-input--bare')
  })
})
