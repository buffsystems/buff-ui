// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '../src/react/index.ts'

afterEach(cleanup)

describe('ConfirmDialog', () => {
  test('renders nothing when closed', () => {
    render(<ConfirmDialog open={false} title="X" onConfirm={() => {}} onCancel={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('shows the title/message and fires confirm + cancel', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        open
        title="Удалить?"
        message="Необратимо."
        confirmLabel="Да"
        cancelLabel="Нет"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByRole('dialog').textContent).toMatch(/Удалить\?/)
    expect(screen.getByRole('dialog').textContent).toMatch(/Необратимо/)
    await user.click(screen.getByRole('button', { name: 'Да' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Нет' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test('Escape cancels', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog open title="X" onConfirm={() => {}} onCancel={onCancel} />)
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
  })

  test('the optional third action fires on its own, and Escape still cancels', async () => {
    const onSecondary = vi.fn()
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(
      <ConfirmDialog
        open
        title="X"
        confirmLabel="Сохранить и уйти"
        secondaryLabel="Уйти без сохранения"
        cancelLabel="Остаться"
        onConfirm={() => {}}
        onSecondary={onSecondary}
        onCancel={onCancel}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Уйти без сохранения' }))
    expect(onSecondary).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test('the third action is hidden without a handler', () => {
    render(
      <ConfirmDialog
        open
        title="X"
        secondaryLabel="Третья"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: 'Третья' })).toBeNull()
  })

  test('a busy dialog ignores Escape', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog open busy title="X" onConfirm={() => {}} onCancel={onCancel} />)
    await user.keyboard('{Escape}')
    expect(onCancel).not.toHaveBeenCalled()
  })
})

test('renders extra content the action needs (a reason field), between message and actions', () => {
  render(
    <ConfirmDialog
      open
      title="В архив"
      message="Запись останется в архиве"
      onConfirm={() => {}}
      onCancel={() => {}}
    >
      <label>
        Причина
        <input aria-label="Причина" />
      </label>
    </ConfirmDialog>,
  )
  expect(screen.getByLabelText('Причина')).toBeTruthy()
})
