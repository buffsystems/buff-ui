// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandList, Kbd, matchesCommand } from '../src/react/index.ts'
import type { CommandItem } from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

const commands: CommandItem[] = [
  { value: 'new', label: 'Новая сессия', group: 'Сессия', hint: <Kbd>⌘N</Kbd> },
  { value: 'fork', label: 'Ответвить сессию', group: 'Сессия', disabled: true },
  { value: 'model', label: 'Сменить модель', group: 'Модель', keywords: ['model'] },
  { value: 'theme', label: 'Тема', group: 'Вид', description: 'Светлая, тёмная, как в системе' },
]

const active = () => screen.getByRole('option', { selected: true })

describe('matchesCommand', () => {
  test('every word must appear somewhere in the item', () => {
    expect(matchesCommand(commands[0], 'нов сес')).toBe(true)
    expect(matchesCommand(commands[0], 'нов модель')).toBe(false)
    expect(matchesCommand(commands[2], 'MODEL')).toBe(true)
    expect(matchesCommand(commands[3], 'тёмная')).toBe(true)
  })
})

describe('CommandList', () => {
  test('a combobox field over a named list of grouped options; the first row is active', () => {
    render(<CommandList label="Команды" items={commands} onSelect={() => {}} />)
    const input = screen.getByRole('combobox', { name: 'Команды' })
    expect(input.className).toBe('ui-command__input')
    expect(screen.getByRole('listbox', { name: 'Команды' })).toBeTruthy()
    expect(screen.getAllByRole('group').map((g) => g.getAttribute('aria-labelledby'))).toHaveLength(
      3,
    )
    expect(screen.getByRole('group', { name: 'Сессия' })).toBeTruthy()
    expect(active().textContent).toContain('Новая сессия')
    expect(input.getAttribute('aria-activedescendant')).toBe(active().id)
    expect(screen.getByText('⌘N').closest('.ui-command__hint')).not.toBeNull()
  })

  test('arrows skip a disabled row and wrap; Enter picks the active one', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onActiveChange = vi.fn()
    render(
      <CommandList
        label="Команды"
        items={commands}
        onSelect={onSelect}
        onActiveChange={onActiveChange}
      />,
    )
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}')
    expect(active().textContent).toContain('Сменить модель')
    expect(onActiveChange).toHaveBeenLastCalledWith(commands[2])
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(active().textContent).toContain('Новая сессия')
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onSelect).toHaveBeenCalledWith(commands[3])
  })

  test('typing filters the rows and makes the first match active', async () => {
    const user = userEvent.setup()
    render(<CommandList label="Команды" items={commands} onSelect={() => {}} />)
    await user.type(screen.getByRole('combobox'), 'тем')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'ТемаСветлая, тёмная, как в системе',
    ])
    expect(active().textContent).toContain('Тема')
  })

  test('nothing found says so; while loading it says that instead', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <CommandList label="Команды" items={commands} onSelect={() => {}} />,
    )
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByRole('status').textContent).toBe('Ничего не найдено')
    rerender(<CommandList label="Команды" items={[]} filter={false} loading onSelect={() => {}} />)
    expect(screen.getByRole('status').textContent).toBe('Загрузка…')
  })

  test('the caller can filter and own the query (an async search)', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(
      <CommandList
        label="Файлы"
        items={[{ value: 'a', label: 'src/app.ts' }]}
        filter={false}
        query="zzz"
        onQueryChange={onQueryChange}
        onSelect={() => {}}
      />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await user.type(screen.getByRole('combobox'), 'x')
    expect(onQueryChange).toHaveBeenLastCalledWith('zzzx')
  })

  test('a picker marks the current choice and opens on it; a click picks', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<CommandList label="Модель" items={commands} current="model" onSelect={onSelect} />)
    const model = screen.getByRole('option', { name: /Сменить модель/ })
    expect(model.getAttribute('aria-current')).toBe('true')
    expect(active()).toBe(model)
    await user.click(screen.getByRole('option', { name: /Ответвить/ }))
    expect(onSelect).not.toHaveBeenCalled()
    await user.click(screen.getByRole('option', { name: /Новая сессия/ }))
    expect(onSelect).toHaveBeenCalledWith(commands[0])
  })
})
