// @vitest-environment jsdom
// A live chat on the phone follows what arrives while the reader is at the bottom (#703).
import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useFollowEnd } from '../src/native/follow-end.ts'

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
