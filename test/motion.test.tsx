// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { AnimatedNumber, ProgressCircle, TextShimmer } from '../src/react/index.ts'
import { tweenAt } from '../src/react/AnimatedNumber.tsx'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('TextShimmer', () => {
  test('is plain text that shimmers while active', () => {
    const { rerender } = render(<TextShimmer>Думаю…</TextShimmer>)
    const text = screen.getByText('Думаю…')
    expect(text.tagName).toBe('SPAN')
    expect(text.className).toBe('ui-shimmer')
    expect(text.hasAttribute('data-active')).toBe(true)
    rerender(<TextShimmer active={false}>Думаю…</TextShimmer>)
    expect(screen.getByText('Думаю…').hasAttribute('data-active')).toBe(false)
  })

  test('can be a paragraph', () => {
    render(<TextShimmer as="p">Запускаю команду</TextShimmer>)
    expect(screen.getByText('Запускаю команду').tagName).toBe('P')
  })
})

describe('ProgressCircle', () => {
  const arc = (svg: Element) => svg.querySelector('.ui-progress-ring__value') as SVGCircleElement

  test('a named ring is a progress bar with its value', () => {
    render(<ProgressCircle value={42.4} label="Контекст" tone="warn" size={20} strokeWidth={3} />)
    const ring = screen.getByRole('progressbar', { name: 'Контекст' })
    expect(ring.getAttribute('class')).toBe('ui-progress-ring ui-progress-ring--warn')
    expect(ring.getAttribute('aria-valuenow')).toBe('42')
    expect(ring.getAttribute('width')).toBe('20')
    const r = Number(arc(ring).getAttribute('r'))
    expect(r).toBe(8.5)
    const circumference = 2 * Math.PI * r
    expect(Number(arc(ring).getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference * 0.576)
  })

  test('the value is clamped; without a label the ring is decorative', () => {
    const { container } = render(<ProgressCircle value={140} />)
    const ring = container.querySelector('svg') as SVGSVGElement
    expect(ring.getAttribute('aria-hidden')).toBe('true')
    expect(ring.getAttribute('role')).toBeNull()
    expect(Number(arc(ring).getAttribute('stroke-dashoffset'))).toBe(0)
  })
})

describe('tweenAt', () => {
  test('starts at from, ends at to, and is past halfway at the midpoint (eases out)', () => {
    expect(tweenAt(10, 20, 0)).toBe(10)
    expect(tweenAt(10, 20, 1)).toBe(20)
    expect(tweenAt(10, 20, 2)).toBe(20)
    expect(tweenAt(10, 20, 0.5)).toBeGreaterThan(15)
    expect(tweenAt(20, 10, 0.5)).toBeLessThan(15)
  })
})

describe('AnimatedNumber', () => {
  const visible = (container: HTMLElement) => container.querySelector('[aria-hidden]')?.textContent

  test('counts to the new value; assistive tech reads only the final one', async () => {
    const { container, rerender } = render(<AnimatedNumber value={3} duration={50} />)
    expect(visible(container)).toBe('3')
    rerender(<AnimatedNumber value={42} duration={50} />)
    expect(screen.getByText('42').className).toBe('ui-animated-number__label')
    await vi.waitFor(() => expect(visible(container)).toBe('42'))
  })

  test('with reduced motion it changes at once, formatted', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }))
    const format = (n: number) => `${Math.round(n)} шагов`
    const { container, rerender } = render(<AnimatedNumber value={1} format={format} />)
    rerender(<AnimatedNumber value={9} format={format} />)
    expect(visible(container)).toBe('9 шагов')
  })
})
