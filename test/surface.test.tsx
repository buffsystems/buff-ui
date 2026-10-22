// @vitest-environment jsdom
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Badge, Checkbox, Count, EmptyState, Panel } from '../src/react/index.ts'

afterEach(cleanup)

describe('surfaces and small marks', () => {
  test('a panel is a plain surface that keeps its caller props', () => {
    render(<Panel aria-label="Сводка" className="p-4" />)
    expect(screen.getByLabelText('Сводка').className).toBe('ui-panel p-4')
  })

  test('an empty state is centred by default, a compact note inline', () => {
    const { rerender } = render(<EmptyState>Задач пока нет</EmptyState>)
    expect(screen.getByText('Задач пока нет').className).toBe('ui-empty')
    rerender(<EmptyState inline>нет изменений</EmptyState>)
    expect(screen.getByText('нет изменений').className).toBe('ui-empty ui-empty--inline')
  })

  test('a checkbox is a native, toggleable checkbox', () => {
    render(<Checkbox aria-label="Подробно" defaultChecked />)
    const box = screen.getByRole('checkbox', { name: 'Подробно' })
    expect(box.className).toBe('ui-checkbox')
    expect(box).toHaveProperty('checked', true)
  })

  test('a count is muted unless filled', () => {
    const { rerender } = render(<Count>3</Count>)
    expect(screen.getByText('3').className).toBe('ui-count')
    rerender(<Count tone="warn">3</Count>)
    expect(screen.getByText('3').className).toBe('ui-count ui-count--warn')
  })

  test('a small badge is the compact tag', () => {
    render(
      <Badge tone="warn" size="sm">
        пользовательское
      </Badge>,
    )
    expect(screen.getByText('пользовательское').className).toBe(
      'ui-badge ui-badge--warn ui-badge--sm',
    )
  })
})

describe('checkbox row and field group', () => {
  test('a labelled checkbox is one clickable row with its hint', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    render(<Checkbox label="Монитор" hint="метрики машин" />)
    await user.click(screen.getByText('Монитор'))
    expect(screen.getByRole('checkbox', { name: /Монитор/ })).toHaveProperty('checked', true)
    expect(screen.getByText('метрики машин').className).toBe('ui-field__hint')
  })
})
