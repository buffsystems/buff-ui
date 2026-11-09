// @vitest-environment jsdom
// A chat's history loads further back as the reader scrolls up to its top (#766).
import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useNearTop } from '../src/native/near-top.ts'

const scrolled = (y: number) =>
  ({
    nativeEvent: {
      contentOffset: { x: 0, y },
      contentSize: { width: 300, height: 3000 },
      layoutMeasurement: { width: 300, height: 400 },
    },
  }) as never

test('the reader scrolling up to about a screen from the top asks for earlier', () => {
  const onTop = vi.fn()
  const { result } = renderHook(() => useNearTop(onTop))
  act(() => result.current.onScrollBeginDrag())
  act(() => result.current.onScroll(scrolled(1200)))
  expect(onTop).not.toHaveBeenCalled()
  act(() => result.current.onScroll(scrolled(300)))
  expect(onTop).toHaveBeenCalledTimes(1)
})

test('the screen laying itself out near the top asks nothing before the reader drags', () => {
  const onTop = vi.fn()
  const { result } = renderHook(() => useNearTop(onTop))
  act(() => result.current.onScroll(scrolled(0)))
  expect(onTop).not.toHaveBeenCalled()
})

test('nothing earlier — nothing asked', () => {
  const { result } = renderHook(() => useNearTop(undefined))
  act(() => result.current.onScrollBeginDrag())
  expect(() => result.current.onScroll(scrolled(0))).not.toThrow()
})

test('a page that lands short of a screen asks for the next one once it has come', () => {
  const onTop = vi.fn()
  const { result, rerender } = renderHook(({ ask }) => useNearTop(ask), {
    initialProps: { ask: onTop as (() => void) | undefined },
  })
  act(() => result.current.onScrollBeginDrag())
  act(() => result.current.onScroll(scrolled(0)))
  expect(onTop).toHaveBeenCalledTimes(1)
  // The page is on its way: nothing to ask; at the top, no scroll event comes after it lands.
  rerender({ ask: undefined })
  rerender({ ask: onTop })
  expect(onTop).toHaveBeenCalledTimes(2)
})

test('a page that pushed the reader away from the top asks nothing more', () => {
  const onTop = vi.fn()
  const { result, rerender } = renderHook(({ ask }) => useNearTop(ask), {
    initialProps: { ask: onTop as (() => void) | undefined },
  })
  act(() => result.current.onScrollBeginDrag())
  act(() => result.current.onScroll(scrolled(0)))
  rerender({ ask: undefined })
  act(() => result.current.onScroll(scrolled(2000)))
  rerender({ ask: onTop })
  expect(onTop).toHaveBeenCalledTimes(1)
})
