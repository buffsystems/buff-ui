// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MouseEvent, ReactNode } from 'react'
import { Bell, Search, Sparkles } from 'lucide-react'
import {
  ActionRow,
  Badge,
  Callout,
  Chip,
  IconTile,
  Input,
  Nav,
  NavGroup,
  NavItem,
  Panel,
  Segmented,
  Select,
  StatGrid,
  StatTile,
} from '../src/react/index.ts'

afterEach(cleanup)

describe('navigation', () => {
  test('the current item is marked for assistive tech and the rail', () => {
    render(
      <Nav label="Разделы">
        <NavGroup>Управление</NavGroup>
        <NavItem icon={Bell} current end={<span>3</span>}>
          Уведомления
        </NavItem>
        <NavItem>Задачи</NavItem>
      </Nav>,
    )
    expect(screen.getByRole('navigation', { name: 'Разделы' }).className).toBe('ui-nav')
    expect(screen.getByRole('button', { name: /Уведомления/ }).getAttribute('aria-current')).toBe(
      'page',
    )
    expect(screen.getByRole('button', { name: 'Задачи' }).hasAttribute('aria-current')).toBe(false)
  })

  test('a nav item can be a router link', () => {
    render(
      <NavItem asChild current>
        <a href="/tasks">Задачи</a>
      </NavItem>,
    )
    const link = screen.getByRole('link', { name: 'Задачи' })
    expect(link.className).toBe('ui-nav-item')
    expect(link.getAttribute('aria-current')).toBe('page')
  })

  test('an action row is a button with its title and hint', async () => {
    const onClick = vi.fn()
    render(
      <ActionRow
        icon={<IconTile icon={Sparkles} tone="info" />}
        title="Подключить репозиторий"
        hint="GitLab, GitHub, Gitea"
        onClick={onClick}
      />,
    )
    await userEvent.setup().click(screen.getByRole('button', { name: /Подключить репозиторий/ }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(document.querySelector('.ui-action__trailing')).toBeNull()
  })

  test('an action row ends with a trailing slot, or a decorative chevron on request', () => {
    const { rerender } = render(
      <ActionRow title="Обновить" trailing={<Badge tone="info">Новое</Badge>} chevron />,
    )
    const row = screen.getByRole('button', { name: /Обновить/ })
    const trailing = row.querySelector('.ui-action__trailing') as HTMLElement
    expect(trailing.textContent).toBe('Новое')
    expect(trailing.querySelector('svg')).toBeNull()
    rerender(<ActionRow title="Обновить" chevron />)
    const chevron = screen.getByRole('button').querySelector('.ui-action__trailing svg')
    expect(chevron?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByRole('button', { name: 'Обновить' })).toBeTruthy()
  })

  test('an action row renders as its link child: one link with the row inside', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
    render(
      <ActionRow
        asChild
        icon={<IconTile icon={Sparkles} tone="info" />}
        title="Открыть задачи"
        hint="Все задачи организации"
        chevron
        onClick={onClick}
      >
        <a href="/tasks" data-testid="link" />
      </ActionRow>,
    )
    const link = screen.getByRole('link', { name: /Открыть задачи/ })
    expect(link.getAttribute('href')).toBe('/tasks')
    expect(link.className).toBe('ui-action')
    expect(link.dataset.testid).toBe('link')
    expect(link.querySelector('.ui-icon-tile')).not.toBeNull()
    expect(link.querySelector('.ui-action__hint')?.textContent).toBe('Все задачи организации')
    expect(link.querySelector('.ui-action__trailing svg')).not.toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
    await userEvent.setup().click(link)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('an action row keeps a router link component as its root', () => {
    function RouterLink(props: { to: string; className?: string; children?: ReactNode }) {
      return (
        <a href={`#${props.to}`} className={props.className} data-router="">
          {props.children}
        </a>
      )
    }
    render(
      <ActionRow asChild title="Настройки" className="extra">
        <RouterLink to="/settings" />
      </ActionRow>,
    )
    const link = screen.getByRole('link', { name: 'Настройки' })
    expect(link.getAttribute('href')).toBe('#/settings')
    expect(link.hasAttribute('data-router')).toBe(true)
    expect(link.className).toBe('ui-action extra')
  })
})

describe('second-pass pieces', () => {
  test('an icon tile is decorative and carries tone and size', () => {
    const { container } = render(<IconTile icon={Bell} tone="warn" size="lg" />)
    const tile = container.firstElementChild as HTMLElement
    expect(tile.className).toBe('ui-icon-tile ui-icon-tile--warn ui-icon-tile--lg')
    expect(tile.getAttribute('aria-hidden')).toBe('true')
  })

  test('a removable tag calls back from its ×', async () => {
    const onRemove = vi.fn()
    render(
      <Badge onRemove={onRemove} removeLabel="Убрать main">
        main
      </Badge>,
    )
    await userEvent.setup().click(screen.getByRole('button', { name: 'Убрать main' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  test('compact fields and a search field with its icon', () => {
    const { container } = render(
      <>
        <Input compact aria-label="Хост" />
        <Input leadingIcon={Search} aria-label="Поиск" className="w-64" />
        <Select compact aria-label="Роль">
          <option>a</option>
        </Select>
      </>,
    )
    expect(screen.getByRole('textbox', { name: 'Хост' }).className).toBe('ui-input ui-input--sm')
    expect(screen.getByRole('textbox', { name: 'Поиск' }).parentElement?.className).toBe(
      'ui-input-group w-64',
    )
    expect(container.querySelector('.ui-input-group__icon')).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Роль' }).parentElement?.className).toBe(
      'ui-select ui-select--sm',
    )
  })

  test('a compact segmented control keeps all options on one row', () => {
    render(
      <Segmented
        size="sm"
        label="Вид"
        value="md"
        onChange={() => {}}
        options={[
          { id: 'md', label: 'Разметка' },
          { id: 'txt', label: 'Текст' },
        ]}
      />,
    )
    expect(screen.getByRole('group', { name: 'Вид' }).className).toBe(
      'ui-segmented ui-segmented--sm',
    )
  })

  test('panels, banners and a grid of any width', () => {
    const { container } = render(
      <>
        <Panel tone="info" data-testid="p1" />
        <Panel inset data-testid="p2" />
        <Callout banner tone="warn">
          Демо-режим
        </Callout>
        <StatGrid columns={7} label="Сводка">
          <StatTile label="a" value="1" />
        </StatGrid>
      </>,
    )
    expect(screen.getByTestId('p1').className).toBe('ui-panel ui-panel--info')
    expect(screen.getByTestId('p2').className).toBe('ui-panel ui-panel--inset')
    expect(container.querySelector('.ui-callout--banner')).toBeTruthy()
    const grid = screen.getByRole('list', { name: 'Сводка' })
    expect(grid.className).toBe('ui-stat-grid ui-stat-grid--n')
    expect(grid.style.getPropertyValue('--ui-stat-cols')).toBe('7')
  })
})

test('a compact chip and a quiet callout', () => {
  render(
    <>
      <Chip size="sm" pressed={false} onClick={() => {}}>
        Задачи
      </Chip>
      <Callout compact tone="ok">
        Отчёт актуален
      </Callout>
    </>,
  )
  expect(screen.getByRole('button', { name: 'Задачи' }).className).toBe('ui-chip ui-chip--sm')
  expect(screen.getByText('Отчёт актуален').parentElement?.className).toBe(
    'ui-callout ui-callout--ok ui-callout--compact',
  )
})
