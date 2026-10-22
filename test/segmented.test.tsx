// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { Segmented } from '../src/react/index.ts'
import { cssRule } from './css-rule.ts'

afterEach(cleanup)

const rule = (selector: string): string => cssRule('chip.css', selector)

const BUMPS = [
  { id: 'patch', label: 'patch — исправления' },
  { id: 'minor', label: 'minor — новое' },
  { id: 'major', label: 'major — несовместимое' },
]

describe('Segmented with labels longer than a cell', () => {
  test('keeps the class contract and one toggle button per option, in reading order', () => {
    render(<Segmented label="Подъём версии" value="minor" onChange={() => {}} options={BUMPS} />)
    const group = screen.getByRole('group', { name: 'Подъём версии' })
    expect(group.className).toBe('ui-segmented ui-segmented--3')
    const buttons = within(group).getAllByRole('button')
    expect(buttons.map((b) => b.textContent)).toEqual(BUMPS.map((b) => b.label))
    expect(buttons.map((b) => b.className)).toEqual(Array(3).fill('ui-segmented__item'))
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false'])
  })

  test('is driven from the keyboard: Tab moves between options, Space picks one', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Подъём версии" value="patch" onChange={onChange} options={BUMPS} />)
    await user.tab()
    await user.tab()
    expect(document.activeElement?.textContent).toBe('minor — новое')
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith('minor')
  })
})

describe('segmented CSS contract', () => {
  test('a cell wraps its label instead of clipping it', () => {
    const item = rule('.ui-segmented__item')
    expect(item).not.toMatch(/white-space:\s*nowrap/)
    expect(item).not.toMatch(/text-overflow/)
    expect(item).toMatch(/text-wrap:\s*balance/)
  })

  test('the group lets a cell that cannot fit take a row of its own', () => {
    expect(rule('.ui-segmented')).toMatch(/flex-wrap:\s*wrap/)
    expect(rule('.ui-segmented__item')).toMatch(
      /flex:\s*1 1 calc\(100% \/ var\(--ui-segmented-cols\) - 1px\)/,
    )
    expect(rule('.ui-segmented--3')).toMatch(/--ui-segmented-cols:\s*3/)
    expect(rule('.ui-segmented--4')).toMatch(/--ui-segmented-cols:\s*4/)
  })

  test('the compact size stays one row of unwrapped labels', () => {
    expect(rule('.ui-segmented.ui-segmented--sm')).toMatch(/flex-wrap:\s*nowrap/)
    expect(rule('.ui-segmented--sm .ui-segmented__item')).toMatch(/white-space:\s*nowrap/)
  })
})
