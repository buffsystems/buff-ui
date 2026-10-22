// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import {
  Avatar,
  Combobox,
  avatarColor,
  avatarColors,
  nameColor,
  ConfirmDialog,
  Dialog,
  DialogBody,
  Switch,
  TabPanel,
  Tabs,
  Toaster,
  toast,
  Tooltip,
} from '../src/react/index.ts'

afterEach(cleanup)

describe('Dialog', () => {
  test('is a named modal dialog that Escape closes', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog open onOpenChange={onOpenChange} title="Новый репозиторий" description="Импорт">
        <DialogBody>тело</DialogBody>
      </Dialog>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Новый репозиторий' })
    expect(dialog.className).toBe('ui-dialog ui-dialog--md')
    expect(screen.getByText('Импорт').className).toBe('ui-dialog__description')
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  test('while busy it cannot be dismissed', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Dialog open busy onOpenChange={onOpenChange} title="Импорт идёт" />)
    await user.keyboard('{Escape}')
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveProperty('disabled', true)
  })
})

describe('ConfirmDialog', () => {
  test('confirms, cancels and marks a destructive action', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        danger
        title="Удалить проект?"
        message="Это нельзя отменить"
        confirmLabel="Удалить"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )
    const confirm = screen.getByRole('button', { name: 'Удалить' })
    expect(confirm.className).toContain('ui-btn--destructive')
    await user.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Отмена' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test('a secondary way out widens the dialog and stacks the actions on a phone', () => {
    render(
      <ConfirmDialog
        open
        title="Уйти?"
        secondaryLabel="Уйти без сохранения"
        onSecondary={() => {}}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('dialog').className).toContain('ui-dialog--md')
    expect(
      screen.getByRole('button', { name: 'Уйти без сохранения' }).parentElement?.className,
    ).toBe('ui-dialog__footer ui-dialog__footer--stack')
  })
})

describe('Tabs', () => {
  test('marks the active tab and reports a switch', async () => {
    const user = userEvent.setup()
    function Host() {
      const [tab, setTab] = useState('tasks')
      return (
        <Tabs
          label="Разделы"
          value={tab}
          onValueChange={setTab}
          items={[
            { id: 'tasks', label: 'Задачи', count: 3 },
            { id: 'audit', label: 'Аудит' },
          ]}
        />
      )
    }
    render(<Host />)
    expect(screen.getByRole('tablist', { name: 'Разделы' }).className).toBe(
      'ui-tabs ui-tabs--underline',
    )
    const audit = screen.getByRole('tab', { name: 'Аудит' })
    await user.click(audit)
    expect(audit.getAttribute('aria-selected')).toBe('true')
  })
})

describe('Tabs, vertical with panels', () => {
  test('stacks the tabs, moves with up and down, and shows the linked panel', async () => {
    const user = userEvent.setup()
    function Host() {
      const [tab, setTab] = useState('general')
      return (
        <Tabs
          label="Настройки"
          orientation="vertical"
          variant="pill"
          value={tab}
          onValueChange={setTab}
          items={[
            { id: 'general', label: 'Общие' },
            { id: 'models', label: 'Модели' },
          ]}
        >
          <TabPanel value="general">Общие настройки</TabPanel>
          <TabPanel value="models">Список моделей</TabPanel>
        </Tabs>
      )
    }
    render(<Host />)
    const list = screen.getByRole('tablist', { name: 'Настройки' })
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    expect(list.parentElement?.className).toBe('ui-tabs-root ui-tabs-root--vertical')
    const panel = screen.getByRole('tabpanel', { name: 'Общие' })
    expect(panel.className).toBe('ui-tabs__panel')
    expect(panel.textContent).toBe('Общие настройки')
    await user.click(screen.getByRole('tab', { name: 'Общие' }))
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Модели' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel', { name: 'Модели' }).textContent).toBe('Список моделей')
    expect(screen.queryByText('Общие настройки')).toBeNull()
  })
})

describe('Switch', () => {
  test('toggles and reports the new state', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Уведомления" onCheckedChange={onCheckedChange} />)
    await user.click(screen.getByRole('switch', { name: 'Уведомления' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})

describe('Avatar', () => {
  test('falls back to two initials on the given colour and size', () => {
    const { container } = render(
      <Avatar initials="ада" size={32} color="hsl(200 60% 45%)" square />,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toBe('ui-avatar ui-avatar--square')
    expect(root.style.getPropertyValue('--ui-avatar-size')).toBe('32px')
    expect(root.style.getPropertyValue('--ui-avatar-color')).toBe('hsl(200 60% 45%)')
    expect(screen.getByText('ад')).toBeTruthy()
  })
})

test('a name gives the avatar its initial and a stable colour', () => {
  const { container } = render(<Avatar name="linus" />)
  const root = container.firstElementChild as HTMLElement
  expect(screen.getByText('l')).toBeTruthy()
  expect(root.style.getPropertyValue('--ui-avatar-color')).toBe(nameColor('linus'))
  expect(nameColor('linus')).toBe(nameColor('linus'))
})

test('the project palette: a theme-following value per fixed colour; names map into it', () => {
  expect(avatarColor('blue')).toBe('var(--avatar-blue)')
  const names = ['linus', 'ада', 'buff-code', 'site', 'admin', 'frontend', 'x', '']
  for (const name of names) {
    const color = /^var\(--avatar-([a-z]+)\)$/.exec(nameColor(name))?.[1]
    expect(avatarColors).toContain(color)
    expect(color).not.toBe('gray')
  }
})

describe('Combobox', () => {
  function Host({ initial = '' }: { initial?: string }) {
    const [value, setValue] = useState(initial)
    return (
      <>
        <Combobox
          aria-label="Ветка"
          value={value}
          onChange={setValue}
          options={[
            { value: 'main' },
            { value: 'develop', hint: 'по умолчанию' },
            { value: 'release' },
          ]}
        />
        <output>{value}</output>
      </>
    )
  }

  test('typing filters the suggestions', async () => {
    const user = userEvent.setup()
    render(<Host />)
    await user.type(screen.getByRole('combobox', { name: 'Ветка' }), 'dev')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['developпо умолчанию'])
  })

  test('arrows move the highlight and Enter picks it', async () => {
    const user = userEvent.setup()
    render(<Host />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{ArrowDown}{Enter}')
    expect(document.querySelector('output')?.textContent).toBe('develop')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  test('a chosen value keeps the whole list and is checked', async () => {
    const user = userEvent.setup()
    render(<Host initial="main" />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'main' }).getAttribute('aria-selected')).toBe('true')
  })
})

describe('toast', () => {
  test('shows a toast that leaves after its time or on close', async () => {
    vi.useFakeTimers()
    render(<Toaster />)
    act(() => toast('Сохранено', 'success', 1000))
    expect(screen.getByText('Сохранено').closest('.ui-toast')?.className).toBe(
      'ui-toast ui-toast--success',
    )
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.queryByText('Сохранено')).toBeNull()
    act(() => toast('Ошибка', 'error'))
    act(() => screen.getByRole('button', { name: 'Закрыть' }).click())
    expect(screen.queryByText('Ошибка')).toBeNull()
    vi.useRealTimers()
  })
})

describe('Tooltip', () => {
  test('shows its content on focus, in the popover look when asked', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip variant="popover" content="Подробности">
        <button type="button">Наведите</button>
      </Tooltip>,
    )
    await user.tab()
    const tip = await screen.findByRole('tooltip')
    expect(tip.textContent).toBe('Подробности')
    expect(document.querySelector('.ui-tooltip.ui-tooltip--popover')).toBeTruthy()
  })

  test('open holds it shown without hover or focus', async () => {
    render(
      <Tooltip open content="Скопировано">
        <button type="button">Копировать</button>
      </Tooltip>,
    )
    expect((await screen.findByRole('tooltip')).textContent).toBe('Скопировано')
  })
})
