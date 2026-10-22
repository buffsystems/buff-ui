// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectMenu } from '../src/react/index.ts'
import type { SelectMenuOption } from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

const options: SelectMenuOption[] = [
  { value: 'opus', label: 'Opus', group: 'Anthropic', description: 'Самая сильная' },
  { value: 'sonnet', label: 'Sonnet', group: 'Anthropic' },
  { value: 'gpt', label: 'GPT', group: 'OpenAI', disabled: true },
  { value: 'local', label: 'Локальная', group: 'Свои' },
]

describe('SelectMenu', () => {
  test('the closed field is a named combobox showing the current label', () => {
    render(<SelectMenu aria-label="Модель" options={options} defaultValue="sonnet" compact />)
    const field = screen.getByRole('combobox', { name: 'Модель' })
    expect(field.className).toBe('ui-select-menu ui-select-menu--sm')
    expect(field.textContent).toContain('Sonnet')
  })

  test('the open list groups the options under their titles with a second line', async () => {
    render(<SelectMenu aria-label="Модель" options={options} defaultValue="opus" defaultOpen />)
    const list = screen.getByRole('listbox')
    expect(list.closest('.ui-select-menu__content')).not.toBeNull()
    expect(screen.getAllByRole('group').map((g) => g.firstElementChild?.textContent)).toEqual([
      'Anthropic',
      'OpenAI',
      'Свои',
    ])
    expect(screen.getByText('Самая сильная').className).toBe('ui-select-menu__description')
    expect(screen.getByRole('option', { name: /GPT/ }).getAttribute('aria-disabled')).toBe('true')
  })

  test('the keyboard picks an option and skips a disabled one', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onHighlight = vi.fn()
    render(
      <SelectMenu
        aria-label="Модель"
        options={options}
        defaultValue="sonnet"
        onValueChange={onValueChange}
        onHighlight={onHighlight}
      />,
    )
    screen.getByRole('combobox').focus()
    await user.keyboard('{Enter}')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalledWith('local')
    expect(onHighlight).toHaveBeenCalledWith('local')
  })

  test('typing on the closed field jumps to the matching option', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SelectMenu aria-label="Модель" options={options} onValueChange={onValueChange} />)
    screen.getByRole('combobox').focus()
    await user.keyboard('л')
    expect(onValueChange).toHaveBeenCalledWith('local')
  })

  test('a ghost field and an invalid one carry their marks', () => {
    render(<SelectMenu aria-label="Вид" options={options} variant="ghost" invalid />)
    const field = screen.getByRole('combobox')
    expect(field.className).toBe('ui-select-menu ui-select-menu--ghost')
    expect(field.getAttribute('aria-invalid')).toBe('true')
  })
})
