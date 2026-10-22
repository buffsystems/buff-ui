// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { THEME_STORAGE_KEY, ThemeToggle } from '../src/react/index.ts'

// Radix DropdownMenu relies on pointer-capture / scrollIntoView, which jsdom omits.
beforeAll(() => {
  const proto = Element.prototype as unknown as Record<string, unknown>
  proto.hasPointerCapture = () => false
  proto.setPointerCapture = () => {}
  proto.releasePointerCapture = () => {}
  proto.scrollIntoView = () => {}
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

const openMenu = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByLabelText('Переключить тему'))

describe('ThemeToggle', () => {
  test('renders the three theme options', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await openMenu(user)
    expect(await screen.findByText('Светлая')).toBeDefined()
    expect(screen.getByText('Тёмная')).toBeDefined()
    expect(screen.getByText('Системная')).toBeDefined()
  })

  test('selecting «Тёмная» persists and applies the dark class', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await openMenu(user)
    await user.click(await screen.findByText('Тёмная'))
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  test('selecting «Светлая» persists and removes the dark class', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    document.documentElement.classList.add('dark')
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await openMenu(user)
    await user.click(await screen.findByText('Светлая'))
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  test('labels translate the trigger and the items', async () => {
    const user = userEvent.setup()
    render(
      <ThemeToggle label="Theme" labels={{ light: 'Light', dark: 'Dark', system: 'System' }} />,
    )
    await user.click(screen.getByLabelText('Theme'))
    expect(await screen.findByText('Light')).toBeDefined()
    expect(screen.getByText('Dark')).toBeDefined()
    expect(screen.getByText('System')).toBeDefined()
  })
})
