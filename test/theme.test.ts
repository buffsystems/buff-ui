// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { THEME_STORAGE_KEY, readStoredTheme, resolveTheme, useTheme } from '../src/react/index.ts'

/**
 * jsdom has no matchMedia — install a controllable fake so `system` mode can be
 * driven: `set(dark)` flips the OS preference and fires the `change` listeners.
 */
function installMatchMedia(initialDark: boolean) {
  let matches = initialDark
  const listeners = new Set<() => void>()
  const mql = {
    get matches() {
      return matches
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  }
  window.matchMedia = (() => mql) as unknown as typeof window.matchMedia
  return {
    set(dark: boolean) {
      matches = dark
      act(() => listeners.forEach((cb) => cb()))
    },
  }
}

const hasDark = () => document.documentElement.classList.contains('dark')

beforeEach(() => installMatchMedia(false))
afterEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('resolveTheme', () => {
  test('explicit preference ignores the system', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
  test('system follows the OS preference', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
})

describe('readStoredTheme', () => {
  test('defaults to system when nothing is stored', () => {
    expect(readStoredTheme()).toBe('system')
  })
  test('reads a stored valid value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(readStoredTheme()).toBe('dark')
  })
  test('falls back to system on a garbage value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'neon')
    expect(readStoredTheme()).toBe('system')
  })
})

describe('useTheme', () => {
  test('defaults to system and applies the OS preference to <html>', () => {
    installMatchMedia(true) // OS = dark
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('system')
    expect(result.current.effective).toBe('dark')
    expect(hasDark()).toBe(true)
  })

  test('setTheme persists and toggles the .dark class', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dark'))
    expect(result.current.theme).toBe('dark')
    expect(result.current.effective).toBe('dark')
    expect(hasDark()).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    act(() => result.current.setTheme('light'))
    expect(result.current.effective).toBe('light')
    expect(hasDark()).toBe(false)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  test('system mode tracks live OS changes', () => {
    const mm = installMatchMedia(false) // OS = light
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('system'))
    expect(result.current.effective).toBe('light')
    expect(hasDark()).toBe(false)

    mm.set(true) // OS switches to dark
    expect(result.current.effective).toBe('dark')
    expect(hasDark()).toBe(true)
  })

  test('explicit mode ignores live OS changes', () => {
    const mm = installMatchMedia(false)
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('light'))
    mm.set(true) // OS goes dark, but preference is explicit light
    expect(result.current.effective).toBe('light')
    expect(hasDark()).toBe(false)
  })
})
