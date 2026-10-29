// Seen on the phone (#645): a busy button looked disabled — dimmed to half, its spinner a dark
// dot on the dark theme's light blue — and «Отправить» seemed to do nothing for seconds.
import { describe, expect, it } from 'vitest'
import { buttonOpacity } from '../src/native/Button.tsx'

describe('buttonOpacity', () => {
  it('a busy button stays bright — it is working, not unavailable', () => {
    expect(buttonOpacity({ disabled: false, loading: true, pressed: false })).toBe(1)
  })
  it('only an unavailable button dims; a pressed one answers the finger', () => {
    expect(buttonOpacity({ disabled: true, loading: false, pressed: false })).toBe(0.55)
    expect(buttonOpacity({ disabled: true, loading: true, pressed: false })).toBe(0.55)
    expect(buttonOpacity({ disabled: false, loading: false, pressed: true })).toBe(0.8)
    expect(buttonOpacity({ disabled: false, loading: false, pressed: false })).toBe(1)
  })
})
