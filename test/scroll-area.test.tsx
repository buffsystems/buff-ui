// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ScrollArea } from '../src/react/index.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

describe('ScrollArea', () => {
  test('the content sits in a viewport the caller can reach', () => {
    const ref = createRef<HTMLDivElement>()
    const onScroll = vi.fn()
    render(
      <ScrollArea className="h-40" viewportProps={{ ref, onScroll, tabIndex: 0 }}>
        <p>лента</p>
      </ScrollArea>,
    )
    const viewport = ref.current as HTMLDivElement
    expect(viewport.className).toBe('ui-scroll-area__viewport')
    expect(viewport.parentElement?.className).toBe('ui-scroll-area h-40')
    expect(viewport.contains(screen.getByText('лента'))).toBe(true)
    expect(viewport.tabIndex).toBe(0)
    fireEvent.scroll(viewport)
    expect(onScroll).toHaveBeenCalled()
  })

  test('always-visible bars render for the asked orientations', () => {
    const { container } = render(
      <ScrollArea type="always" orientation="both">
        <p>таблица</p>
      </ScrollArea>,
    )
    const bars = [...container.querySelectorAll('.ui-scroll-area__bar')]
    expect(bars.map((bar) => bar.getAttribute('data-orientation'))).toEqual([
      'vertical',
      'horizontal',
    ])
  })
})
