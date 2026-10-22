// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownMenuItem, SplitButton } from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

function OpenIn(props: { onOpen?: () => void; onPick?: (app: string) => void; loading?: boolean }) {
  return (
    <SplitButton
      variant="primary"
      size="sm"
      onClick={props.onOpen}
      loading={props.loading}
      menuLabel="Открыть в другом приложении"
      menu={
        <>
          <DropdownMenuItem onSelect={() => props.onPick?.('cursor')}>Cursor</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => props.onPick?.('finder')}>Finder</DropdownMenuItem>
        </>
      }
    >
      Открыть в VS Code
    </SplitButton>
  )
}

describe('SplitButton', () => {
  test('the main half runs the action; both halves share the variant and size', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<OpenIn onOpen={onOpen} />)
    const action = screen.getByRole('button', { name: 'Открыть в VS Code' })
    expect(action.className).toBe('ui-btn ui-btn--primary ui-btn--sm ui-split-btn__action')
    const toggle = screen.getByRole('button', { name: 'Открыть в другом приложении' })
    expect(toggle.className).toBe('ui-btn ui-btn--primary ui-btn--sm ui-split-btn__toggle')
    expect(action.parentElement?.className).toBe('ui-split-btn')
    await user.click(action)
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  test('the chevron opens the alternatives; picking one calls it', async () => {
    const user = userEvent.setup()
    const onPick = vi.fn()
    render(<OpenIn onPick={onPick} />)
    await user.click(screen.getByRole('button', { name: 'Открыть в другом приложении' }))
    await user.click(screen.getByRole('menuitem', { name: 'Finder' }))
    expect(onPick).toHaveBeenCalledWith('finder')
  })

  test('while busy neither half can be pressed', () => {
    render(<OpenIn loading />)
    for (const button of screen.getAllByRole('button'))
      expect(button).toHaveProperty('disabled', true)
  })
})
