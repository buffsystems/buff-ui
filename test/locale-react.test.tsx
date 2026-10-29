// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import {
  ConfirmDialog,
  LANGUAGE_STORAGE_KEY,
  LocaleProvider,
  PairedDevices,
  useLanguage,
} from '../src/react/index.ts'

afterEach(cleanup)
beforeEach(() => localStorage.clear())

describe('the package speaks the provided locale (#713)', () => {
  test('default labels follow the LocaleProvider, Russian without one', () => {
    const dialog = <ConfirmDialog open title="X" onConfirm={() => {}} onCancel={() => {}} />
    const { unmount } = render(dialog)
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeTruthy()
    unmount()
    render(<LocaleProvider locale="en">{dialog}</LocaleProvider>)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeTruthy()
  })

  test('pairing screens take the provider locale unless given their own', () => {
    const { unmount } = render(
      <LocaleProvider locale="en">
        <PairedDevices devices={[]} />
      </LocaleProvider>,
    )
    expect(document.body.textContent).not.toMatch(/[А-я]/)
    unmount()
    render(
      <LocaleProvider locale="en">
        <PairedDevices devices={[]} locale="ru" />
      </LocaleProvider>,
    )
    expect(document.body.textContent).toMatch(/[А-я]/)
  })
})

describe('useLanguage (#713)', () => {
  test('system follows the browser; a choice persists and sets <html lang>', () => {
    Object.defineProperty(navigator, 'languages', { value: ['de-DE', 'en-US'], configurable: true })
    const { result } = renderHook(() => useLanguage())
    expect(result.current).toMatchObject({ choice: 'system', locale: 'en' })
    expect(document.documentElement.lang).toBe('en')
    act(() => result.current.setChoice('ru'))
    expect(result.current.locale).toBe('ru')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('ru')
    expect(document.documentElement.lang).toBe('ru')
  })

  test('an unknown system language gives Russian', () => {
    Object.defineProperty(navigator, 'languages', { value: ['fr-FR'], configurable: true })
    const { result } = renderHook(() => useLanguage())
    expect(result.current.locale).toBe('ru')
  })
})
