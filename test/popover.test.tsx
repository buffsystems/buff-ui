// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

function Usage({ arrow = false }: { arrow?: boolean }) {
  return (
    <Popover>
      <PopoverTrigger>Расход</PopoverTrigger>
      <PopoverContent side="top" align="start" arrow={arrow}>
        <PopoverTitle>Расход сессии</PopoverTitle>
        <PopoverDescription>12 400 токенов</PopoverDescription>
        <PopoverClose>Готово</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

describe('Popover', () => {
  test('opens a named panel on the asked side; its close button returns focus', async () => {
    const user = userEvent.setup()
    render(<Usage />)
    const trigger = screen.getByRole('button', { name: 'Расход' })
    await user.click(trigger)
    const panel = screen.getByRole('dialog', { name: 'Расход сессии' })
    expect(panel.className).toBe('ui-popover')
    expect(panel.getAttribute('data-side')).toBe('top')
    expect(panel.getAttribute('data-align')).toBe('start')
    expect(screen.getByText('12 400 токенов').className).toBe('ui-popover__description')
    expect(panel.querySelector('.ui-popover__arrow')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Готово' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  test('Escape closes it; the arrow is drawn only when asked', async () => {
    const user = userEvent.setup()
    render(<Usage arrow />)
    await user.click(screen.getByRole('button', { name: 'Расход' }))
    expect(screen.getByRole('dialog').querySelector('svg.ui-popover__arrow')).toBeTruthy()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
