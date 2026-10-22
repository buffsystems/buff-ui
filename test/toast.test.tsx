// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { Toaster, dismissToast, toast } from '../src/react/index.ts'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('toast.show', () => {
  test('a title over a description, in its tone', () => {
    render(<Toaster />)
    let id = 0
    act(() => {
      id = toast.show({ title: 'Сессия сохранена', description: '12 файлов', kind: 'success' })
    })
    const title = screen.getByText('Сессия сохранена')
    expect(title.className).toBe('ui-toast__title')
    expect(title.nextElementSibling?.className).toBe('ui-toast__description')
    expect(title.closest('.ui-toast')?.className).toBe('ui-toast ui-toast--success')
    act(() => toast.dismiss(id))
    expect(screen.queryByText('Сессия сохранена')).toBeNull()
  })

  test('an action runs and dismisses its toast; the first one is the primary', () => {
    render(<Toaster />)
    const undo = vi.fn()
    act(() => {
      toast.show({
        title: 'Вкладка закрыта',
        actions: [
          { label: 'Вернуть', onClick: undo },
          { label: 'Подробнее', onClick: () => {} },
        ],
      })
    })
    const back = screen.getByRole('button', { name: 'Вернуть' })
    expect(back.className).toContain('ui-btn--primary')
    expect(screen.getByRole('button', { name: 'Подробнее' }).className).toContain('ui-btn--outline')
    expect(back.parentElement?.className).toBe('ui-toast__actions')
    act(() => back.click())
    expect(undo).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Вкладка закрыта')).toBeNull()
  })

  test('a persistent toast outlives any time and leaves by its id', () => {
    vi.useFakeTimers()
    render(<Toaster />)
    let id = 0
    act(() => {
      id = toast.show({ title: 'Нет связи с шиной', kind: 'error', persistent: true })
    })
    act(() => vi.advanceTimersByTime(60_000))
    expect(screen.getByText('Нет связи с шиной')).toBeTruthy()
    act(() => dismissToast(id))
    expect(screen.queryByText('Нет связи с шиной')).toBeNull()
  })

  test('the one-line form still works and returns an id too', () => {
    vi.useFakeTimers()
    render(<Toaster />)
    let id = 0
    act(() => {
      id = toast('Скопировано', 'info', 2000)
    })
    expect(id).toBeGreaterThan(0)
    expect(screen.getByText('Скопировано').closest('.ui-toast')?.className).toBe(
      'ui-toast ui-toast--info',
    )
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByText('Скопировано')).toBeNull()
  })
})
