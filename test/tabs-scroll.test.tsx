// @vitest-environment jsdom
import { useState } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { Tabs } from '../src/react/index.ts'
import { cssRule } from './css-rule.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const ITEMS = ['Обзор', 'Задачи', 'Ветки', 'Аудит', 'Знания', 'Участники', 'Оплата'].map(
  (label, i) => ({ id: `t${i}`, label }),
)
const TAB_WIDTH = 100
const VIEW = 300

/**
 * jsdom has no layout: lay the tabs out in a row 100px apart inside a 300px tab list that
 * scrolls, by stubbing the sizes the component reads.
 */
function stubLayout(): void {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.getAttribute('role') === 'tablist' ? ITEMS.length * TAB_WIDTH : 0
  })
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.getAttribute('role') === 'tablist' ? VIEW : 0
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const list = this.closest('[role="tablist"]') as HTMLElement | null
    const index = [...(list?.children ?? [])].indexOf(this)
    const left = index < 0 ? 0 : index * TAB_WIDTH - (list?.scrollLeft ?? 0)
    return { left, width: index < 0 ? VIEW : TAB_WIDTH } as DOMRect
  })
}

function Bar({ start = 't0', onChange }: { start?: string; onChange?: (id: string) => void }) {
  const [value, setValue] = useState(start)
  return (
    <Tabs
      label="Разделы"
      items={ITEMS}
      value={value}
      onValueChange={(id) => {
        setValue(id)
        onChange?.(id)
      }}
    />
  )
}

describe('a scrolling underline tab bar', () => {
  test('marks the edge that hides tabs, and both once scrolled to the middle', () => {
    stubLayout()
    render(<Bar />)
    const list = screen.getByRole('tablist', { name: 'Разделы' })
    expect(list.hasAttribute('data-more-start')).toBe(false)
    expect(list.hasAttribute('data-more-end')).toBe(true)
    expect(list.parentElement?.className).toBe('ui-tabs-frame')
    expect(document.querySelectorAll('.ui-tabs-frame__more--end')).toHaveLength(1)
    act(() => {
      list.scrollLeft = 200
      list.dispatchEvent(new Event('scroll'))
    })
    expect(list.hasAttribute('data-more-start')).toBe(true)
    expect(list.hasAttribute('data-more-end')).toBe(true)
  })

  test('the edge marks stay out of the tab order and away from assistive tech', () => {
    stubLayout()
    render(<Bar />)
    const more = document.querySelector('.ui-tabs-frame__more--end') as HTMLElement
    expect(more.getAttribute('tabindex')).toBe('-1')
    expect(more.getAttribute('aria-hidden')).toBe('true')
    expect(screen.queryByRole('button')).toBeNull()
  })

  test('the active tab starts in view', () => {
    stubLayout()
    render(<Bar start="t5" />)
    // Tab 5 spans 500–600; kept 40px clear of the end fade in a 300px view.
    expect(screen.getByRole('tablist').scrollLeft).toBe(340)
  })

  test('arrow keys still move and pick, and the picked tab scrolls into view', async () => {
    stubLayout()
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Bar onChange={onChange} />)
    await user.tab()
    expect(document.activeElement?.textContent).toBe('Обзор')
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement?.textContent).toBe('Оплата')
    expect(onChange).toHaveBeenLastCalledWith('t6')
    expect(screen.getByRole('tablist').scrollLeft).toBe(400)
    await user.keyboard('{Home}')
    expect(document.activeElement?.textContent).toBe('Обзор')
    expect(screen.getByRole('tablist').scrollLeft).toBe(0)
  })

  test('a bar that fits has no marks; a pill bar is never framed', () => {
    render(
      <>
        <Tabs label="А" items={ITEMS.slice(0, 2)} value="t0" onValueChange={() => {}} />
        <Tabs label="Б" variant="pill" items={ITEMS} value="t0" onValueChange={() => {}} />
      </>,
    )
    const fits = screen.getByRole('tablist', { name: 'А' })
    expect(fits.hasAttribute('data-more-end')).toBe(false)
    expect(document.querySelectorAll('.ui-tabs-frame__more')).toHaveLength(0)
    expect(screen.getByRole('tablist', { name: 'Б' }).parentElement?.className).not.toBe(
      'ui-tabs-frame',
    )
  })
})

describe('tab scroll CSS contract', () => {
  const rule = (selector: string): string => cssRule('controls.css', selector)

  test('each hiding edge fades and carries a chevron', () => {
    expect(rule('.ui-tabs--underline[data-more-end]')).toMatch(/mask-image:\s*linear-gradient/)
    expect(rule('.ui-tabs--underline[data-more-start]')).toMatch(/mask-image:\s*linear-gradient/)
    expect(rule('.ui-tabs--underline[data-more-start][data-more-end]')).toMatch(/mask-image/)
    expect(rule('.ui-tabs-frame')).toMatch(/position:\s*relative/)
    expect(rule('.ui-tabs-frame__more--start')).toMatch(/left:\s*0/)
    expect(rule('.ui-tabs-frame__more--end')).toMatch(/right:\s*0/)
  })
})
