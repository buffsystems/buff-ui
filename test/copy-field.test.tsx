// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { createRef } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyField, Field } from '../src/react/index.ts'
import { cssRule } from './css-rule.ts'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('CopyField', () => {
  test('a read-only value named by its field, with a copy button', () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <Field label="Код подтверждения">
        <CopyField ref={ref} value="ABCD-1234" mono copyLabel="Copy" />
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Код подтверждения' })
    expect(ref.current).toBe(input)
    expect(input).toHaveProperty('readOnly', true)
    expect(input).toHaveProperty('value', 'ABCD-1234')
    expect(input.className).toBe('ui-input ui-copy-field__input ui-copy-field__input--mono')
    expect(screen.getByRole('button', { name: 'Copy' })).toBeTruthy()
  })

  test('copies to the clipboard and says so, then returns to «copy»', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onCopied = vi.fn()
    render(<CopyField aria-label="Токен" value="tok_42" onCopied={onCopied} />)
    await user.click(screen.getByRole('button', { name: 'Копировать' }))
    expect(await navigator.clipboard.readText()).toBe('tok_42')
    expect(onCopied).toHaveBeenCalledWith('tok_42')
    const button = screen.getByRole('button', { name: 'Скопировано' })
    expect(button.hasAttribute('data-copied')).toBe(true)
    expect(screen.getByRole('status').textContent).toBe('Скопировано')
    await act(() => vi.advanceTimersByTimeAsync(2000))
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeTruthy()
  })

  test('uses the app clipboard when given; a failed copy shows nothing', async () => {
    const user = userEvent.setup()
    const copy = vi.fn().mockResolvedValue(false)
    render(<CopyField aria-label="Ключ" value="key" copy={copy} copiedLabel="Copied" />)
    await user.click(screen.getByRole('button', { name: 'Копировать' }))
    expect(copy).toHaveBeenCalledWith('key')
    expect(screen.queryByRole('button', { name: 'Copied' })).toBeNull()
    expect(screen.getByRole('status').textContent).toBe('')
  })

  test('focusing the field selects the value for a copy by hand', async () => {
    const user = userEvent.setup()
    render(<CopyField aria-label="Адрес" value="https://buff.systems" />)
    await user.click(screen.getByRole('textbox', { name: 'Адрес' }))
    const input = screen.getByRole('textbox', { name: 'Адрес' }) as HTMLInputElement
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe('https://buff.systems'.length)
  })
})

describe('CopyField multiline', () => {
  const KEY =
    'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM2b7lq0x4Jr2dQ0cWp6c4mO1y8vY0bH3g7kZ9uT5sN2 deploy@buff'

  test('the whole value in a read-only textarea named by its field, the copy button kept', () => {
    const ref = createRef<HTMLInputElement | HTMLTextAreaElement>()
    render(
      <Field label="Публичный ключ">
        <CopyField ref={ref} value={KEY} mono multiline />
      </Field>,
    )
    const box = screen.getByRole('textbox', { name: 'Публичный ключ' })
    expect(box.tagName).toBe('TEXTAREA')
    expect(ref.current).toBe(box)
    expect(box).toHaveProperty('readOnly', true)
    expect(box).toHaveProperty('value', KEY)
    expect(box.className).toBe(
      'ui-textarea ui-copy-field__input ui-copy-field__input--multiline ui-copy-field__input--mono',
    )
    expect(box.parentElement?.className).toBe('ui-copy-field ui-copy-field--multiline')
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeTruthy()
  })

  test('copies the whole value; focusing selects it', async () => {
    const user = userEvent.setup()
    const copy = vi.fn(() => true)
    render(<CopyField aria-label="Ключ" value={KEY} multiline copy={copy} />)
    const box = screen.getByRole('textbox', { name: 'Ключ' }) as HTMLTextAreaElement
    await user.click(box)
    expect([box.selectionStart, box.selectionEnd]).toEqual([0, KEY.length])
    await user.click(screen.getByRole('button', { name: 'Копировать' }))
    expect(copy).toHaveBeenCalledWith(KEY)
    expect(screen.getByRole('button', { name: 'Скопировано' })).toBeTruthy()
  })
})

describe('copy field CSS contract', () => {
  const rule = (selector: string): string => cssRule('copy-field.css', selector)

  test('a multiline value breaks anywhere and the button sits on the first line', () => {
    const input = rule('.ui-copy-field__input--multiline')
    expect(input).toMatch(/overflow-wrap:\s*anywhere/)
    expect(input).toMatch(/resize:\s*none/)
    expect(rule('.ui-copy-field--multiline')).toMatch(/align-items:\s*flex-start/)
    expect(rule('.ui-copy-field--multiline .ui-copy-field__button')).toMatch(/top:/)
  })
})
