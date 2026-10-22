// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioItem } from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

function Placement({ onValueChange }: { onValueChange?: (value: string) => void }) {
  return (
    <RadioGroup aria-label="Терминал" defaultValue="bottom" onValueChange={onValueChange}>
      <RadioItem value="bottom" label="Снизу" hint="Под сессией" />
      <RadioItem value="right" label="Справа" />
      <RadioItem value="tab" label="Во вкладке" disabled />
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  test('is a named radio group; each radio is named by its label', () => {
    render(<Placement />)
    const group = screen.getByRole('radiogroup', { name: 'Терминал' })
    expect(group.className).toBe('ui-radio-group')
    const bottom = screen.getByRole('radio', { name: /Снизу/ })
    expect(bottom.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByText('Под сессией').className).toBe('ui-field__hint')
    expect(screen.getByRole('radio', { name: 'Во вкладке' }).hasAttribute('disabled')).toBe(true)
  })

  test('a click on the label picks; arrows move and skip a disabled radio', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Placement onValueChange={onValueChange} />)
    await user.click(screen.getByText('Справа'))
    expect(onValueChange).toHaveBeenLastCalledWith('right')
    screen.getByRole('radio', { name: 'Справа' }).focus()
    // Held down: Radix picks on the focus that follows an arrow, before the key comes up.
    await user.keyboard('{ArrowDown>}')
    await vi.waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith('bottom'))
  })

  test('a horizontal group lays the radios in a row', () => {
    render(
      <RadioGroup aria-label="Вид" orientation="horizontal">
        <RadioItem value="a" label="A" />
      </RadioGroup>,
    )
    expect(screen.getByRole('radiogroup').className).toBe(
      'ui-radio-group ui-radio-group--horizontal',
    )
  })
})
