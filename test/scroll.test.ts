import { describe, expect, test } from 'vitest'
import { hiddenSides, revealScrollLeft } from '../src/react/scroll.ts'

const box = (scrollWidth: number, clientWidth: number, scrollLeft: number) => ({
  scrollWidth,
  clientWidth,
  scrollLeft,
})

describe('hiddenSides', () => {
  test('content that fits hides nothing', () => {
    expect(hiddenSides(box(300, 300, 0))).toEqual({ start: false, end: false })
  })

  test('at the start only the end hides content; at the end only the start', () => {
    expect(hiddenSides(box(600, 300, 0))).toEqual({ start: false, end: true })
    expect(hiddenSides(box(600, 300, 300))).toEqual({ start: true, end: false })
    expect(hiddenSides(box(600, 300, 120))).toEqual({ start: true, end: true })
  })

  test('a fraction of a pixel is not hidden content', () => {
    expect(hiddenSides(box(300.8, 300, 0))).toEqual({ start: false, end: false })
    expect(hiddenSides(box(600, 300, 299.5))).toEqual({ start: true, end: false })
  })
})

describe('revealScrollLeft', () => {
  // A 300px viewport over 900px of tabs, 40px kept clear of each edge for the fade.
  const view = { scrollLeft: 200, clientWidth: 300, scrollWidth: 900 }

  test('an item already in view, clear of the fades, does not move the scroll', () => {
    expect(revealScrollLeft(view, { left: 260, width: 100 }, 40)).toBe(200)
  })

  test('an item past the end scrolls so it ends clear of the end fade', () => {
    expect(revealScrollLeft(view, { left: 520, width: 100 }, 40)).toBe(360)
  })

  test('an item before the start scrolls so it starts clear of the start fade', () => {
    expect(revealScrollLeft(view, { left: 100, width: 80 }, 40)).toBe(60)
  })

  test('never scrolls outside the content', () => {
    expect(revealScrollLeft(view, { left: 10, width: 80 }, 40)).toBe(0)
    expect(revealScrollLeft(view, { left: 820, width: 80 }, 40)).toBe(600)
  })
})
