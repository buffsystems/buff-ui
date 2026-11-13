// @vitest-environment jsdom
// A live chat on the phone follows what arrives while the reader is at the bottom (#703).
import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useFollowEnd } from '../src/native/follow-end.ts'

/** A scroller not yet drawn in full: its content is shorter than its viewport. */
const short = (y: number) =>
  ({
    nativeEvent: {
      contentOffset: { x: 0, y },
      contentSize: { width: 300, height: 200 },
      layoutMeasurement: { width: 300, height: 400 },
    },
  }) as never

const scrolled = (y: number) =>
  ({
    nativeEvent: {
      contentOffset: { x: 0, y },
      contentSize: { width: 300, height: 1000 },
      layoutMeasurement: { width: 300, height: 400 },
    },
  }) as never

function mount(start?: 'end' | 'top') {
  const hook = renderHook(() => useFollowEnd(start))
  const scrollToEnd = vi.fn()
  hook.result.current.ref.current = { scrollToEnd } as never
  return { hook, scrollToEnd }
}

test('new content scrolls down while the reader is at the bottom', () => {
  const { hook, scrollToEnd } = mount()
  act(() => hook.result.current.onContentSizeChange())
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).toHaveBeenCalledTimes(2)
})

test('a reader who scrolled up stays put until back at the bottom', () => {
  const { hook, scrollToEnd } = mount()
  act(() => hook.result.current.onScroll(scrolled(100)))
  expect(hook.result.current.atEnd).toBe(false)
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).not.toHaveBeenCalled()
  act(() => hook.result.current.onScroll(scrolled(600)))
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).toHaveBeenCalledTimes(1)
})

test('«to the latest» resumes following', () => {
  const { hook, scrollToEnd } = mount()
  act(() => hook.result.current.onScroll(scrolled(0)))
  act(() => hook.result.current.toEnd())
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).toHaveBeenCalledTimes(2)
})

test('a screen that opens at the top does not jump down by itself', () => {
  const { hook, scrollToEnd } = mount('top')
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).not.toHaveBeenCalled()
})

// #896: the timeline's scroller is taken off the screen while a file is viewed and put back after.
// The reader comes back to the place they left — not to the top, not to the latest message.
test('a scroller put back on the screen returns to the place the reader left', () => {
  const { hook } = mount()
  act(() => hook.result.current.onContentSizeChange())
  act(() => hook.result.current.onScroll(scrolled(240)))
  // The view is replaced (a file opens) and comes back as a new scroller, at its top.
  const scrollTo = vi.fn()
  const scrollToEnd = vi.fn()
  hook.result.current.ref.current = { scrollTo, scrollToEnd } as never
  // It starts short and grows as its rows are drawn: a short list reads as «at the end», and its
  // first events at the top are not the reader leaving the place.
  act(() => hook.result.current.onScroll(scrolled(0)))
  act(() => hook.result.current.onContentSizeChange(300, 200))
  act(() => hook.result.current.onScroll(short(0)))
  act(() => hook.result.current.onContentSizeChange(300, 500))
  expect(scrollToEnd).not.toHaveBeenCalled()
  // Tall enough to hold the place (240 + the 400 of the viewport) — the reader is there.
  act(() => hook.result.current.onContentSizeChange(300, 1000))
  expect(scrollTo).toHaveBeenLastCalledWith({ y: 240, animated: false })
  expect(scrollToEnd).not.toHaveBeenCalled()
  act(() => hook.result.current.onScroll(scrolled(240)))
  act(() => hook.result.current.onContentSizeChange(300, 1100))
  expect(scrollTo).toHaveBeenCalledTimes(3)
  // From then on the reader scrolls as before.
  act(() => hook.result.current.onScroll(scrolled(600)))
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).toHaveBeenCalledTimes(1)
})

test('a reader who was at the latest message comes back to the latest', () => {
  const { hook } = mount()
  act(() => hook.result.current.onContentSizeChange())
  const scrollTo = vi.fn()
  const scrollToEnd = vi.fn()
  hook.result.current.ref.current = { scrollTo, scrollToEnd } as never
  act(() => hook.result.current.onScroll(scrolled(0)))
  act(() => hook.result.current.onContentSizeChange())
  expect(scrollToEnd).toHaveBeenCalledTimes(1)
  expect(scrollTo).not.toHaveBeenCalled()
})
