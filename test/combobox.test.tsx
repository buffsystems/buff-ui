// @vitest-environment jsdom
import { useState } from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { Combobox, type ComboboxOption } from '../src/react/index.ts'

afterEach(cleanup)

const opts: ComboboxOption[] = [
  { value: 'main', hint: 'по умолчанию' },
  { value: 'master', hint: 'по умолчанию' },
  { value: 'develop' },
]

// The combobox is controlled (value is a prop). A stateful wrapper mirrors real usage: the
// parent feeds the typed value back so filtering narrows. onChange spy still observes each call.
function Controlled({
  initial = '',
  onChange,
}: {
  initial?: string
  onChange?: (v: string) => void
}) {
  const [v, setV] = useState(initial)
  return (
    <Combobox
      value={v}
      onChange={(x) => {
        setV(x)
        onChange?.(x)
      }}
      options={opts}
      aria-label="ветка"
    />
  )
}

describe('Combobox', () => {
  test('shows the current value and opens the option list on focus', () => {
    render(<Controlled initial="main" />)
    const input = screen.getByLabelText('ветка') as HTMLInputElement
    expect(input.value).toBe('main')
    fireEvent.focus(input)
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  test('typing filters options by substring and stays free-text', () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    const input = screen.getByLabelText('ветка')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'mast' } })
    expect(onChange).toHaveBeenCalledWith('mast') // free text passes through
    const rendered = screen.getAllByRole('option').map((o) => o.textContent)
    expect(rendered.some((t) => t?.includes('master'))).toBe(true)
    expect(rendered.some((t) => t?.includes('develop'))).toBe(false)
  })

  test('clicking an option selects its value', () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    fireEvent.focus(screen.getByLabelText('ветка'))
    fireEvent.click(screen.getByRole('option', { name: /develop/ }))
    expect(onChange).toHaveBeenCalledWith('develop')
  })

  test('keyboard: ArrowDown + Enter selects the highlighted option', () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)
    const input = screen.getByLabelText('ветка')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' }) // → index 1 (master)
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('master')
  })

  test('the chevron toggles the list', () => {
    render(<Controlled />)
    fireEvent.click(screen.getByLabelText('Показать варианты'))
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  test('a value that exactly matches an option still lists every option', () => {
    // Otherwise picking "main" filters the list down to "main" and there is no
    // way to switch to another branch without first clearing the input.
    render(<Controlled initial="main" />)
    fireEvent.focus(screen.getByLabelText('ветка'))
    const rendered = screen.getAllByRole('option').map((o) => o.textContent)
    expect(rendered.some((t) => t?.includes('develop'))).toBe(true)
    expect(rendered.length).toBe(opts.length)
  })

  test('onOpen fires once per opening — the caller can load options lazily', () => {
    const onOpen = vi.fn()
    render(
      <Combobox value="" onChange={() => {}} options={opts} onOpen={onOpen} aria-label="ветка" />,
    )
    const input = screen.getByLabelText('ветка')
    fireEvent.focus(input)
    expect(onOpen).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(input, { key: 'Escape' })
    fireEvent.click(screen.getByLabelText('Показать варианты'))
    expect(onOpen).toHaveBeenCalledTimes(2)
  })
})

// #561: inside a modal Dialog everything outside the dialog is inert, so the suggestion list
// must open inside the dialog — a click on an option still picks it.
test('picks an option by click inside a modal dialog', async () => {
  const { Dialog, DialogBody } = await import('../src/react/index.ts')
  const userEvent = (await import('@testing-library/user-event')).default
  const user = userEvent.setup()
  function Host() {
    const [value, setValue] = useState('')
    return (
      <Dialog open onOpenChange={() => {}} title="Новый проект">
        <DialogBody>
          <Combobox
            aria-label="Ветка"
            value={value}
            onChange={setValue}
            options={[{ value: 'main' }, { value: 'develop' }]}
          />
          <output>{value}</output>
        </DialogBody>
      </Dialog>
    )
  }
  render(<Host />)
  await user.click(screen.getByRole('combobox', { name: 'Ветка' }))
  const option = screen.getByRole('option', { name: 'develop' })
  expect(screen.getByRole('dialog').contains(option)).toBe(true)
  await user.click(option)
  expect(screen.getByRole('dialog').querySelector('output')?.textContent).toBe('develop')
})
