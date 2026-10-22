// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Box, Zap } from 'lucide-react'
import {
  Button,
  Callout,
  PageHeader,
  SectionHeader,
  StatGrid,
  StatTile,
  Table,
} from '../src/react/index.ts'

afterEach(cleanup)

describe('PageHeader', () => {
  test('renders eyebrow, title and subtitle as a heading block', () => {
    render(
      <PageHeader
        eyebrow="stocks-bot · проект"
        title="dev_project"
        subtitle="8 репозиториев"
        actions={<Button>Настройки</Button>}
      />,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'dev_project' })).toBeTruthy()
    expect(screen.getByText('stocks-bot · проект').className).toBe('ui-eyebrow')
    expect(screen.getByText('8 репозиториев')).toBeTruthy()
    expect(screen.getByRole('button').parentElement?.className).toBe('ui-page-header__actions')
  })

  test('SectionHeader is an h2 with its note and action', () => {
    render(<SectionHeader title="Задачи" note="9 всего" action={<a href="#">Экспорт</a>} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Задачи' })).toBeTruthy()
    expect(screen.getByText('9 всего')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Экспорт' })).toBeTruthy()
  })
})

describe('StatTile', () => {
  test('a grid of tiles is a named list of facts', () => {
    render(
      <StatGrid label="Состояние" columns={3}>
        <StatTile icon={Box} label="Инструменты" value="Готовы" tone="ok" note="проверены" />
        <StatTile label="Аудит" value="10" unit="из 10" />
      </StatGrid>,
    )
    const list = screen.getByRole('list', { name: 'Состояние' })
    expect(list.className).toBe('ui-stat-grid ui-stat-grid--3')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(within(list).getByText('Готовы').className).toBe('ui-stat__value ui-stat__value--ok')
  })

  test('a tile with onClick becomes a button that opens its detail', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<StatTile label="Изменения" value="31" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: /Изменения/ }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Callout', () => {
  test('carries its tone, a default icon, the title and the action', () => {
    const { container } = render(
      <Callout tone="warn" title="Нет доступа" role="alert" action={<Button>Запросить</Button>}>
        к репозиторию
      </Callout>,
    )
    const callout = screen.getByRole('alert')
    expect(callout.className).toBe('ui-callout ui-callout--warn')
    expect(callout.textContent).toContain('Нет доступа — к репозиторию')
    expect(container.querySelector('.ui-callout__icon')).toBeTruthy()
  })

  test('icon={null} drops the icon, another icon replaces it', () => {
    const { container, rerender } = render(<Callout icon={null}>текст</Callout>)
    expect(container.querySelector('svg')).toBeNull()
    rerender(<Callout icon={Zap}>текст</Callout>)
    expect(container.querySelector('svg.lucide-zap')).toBeTruthy()
  })
})

describe('Table', () => {
  test('wraps a native table that scrolls sideways inside its frame', () => {
    render(
      <Table framed compact aria-label="Админы">
        <thead>
          <tr>
            <th>Логин</th>
          </tr>
        </thead>
        <tbody>
          <tr data-selected="true">
            <td className="ui-table__num">42</td>
          </tr>
        </tbody>
      </Table>,
    )
    const table = screen.getByRole('table', { name: 'Админы' })
    expect(table.className).toBe('ui-table ui-table--compact')
    expect(table.parentElement?.className).toBe('ui-table-wrap')
    expect(table.parentElement?.parentElement?.className).toBe(
      'ui-table-frame ui-table-frame--framed',
    )
    // jsdom lays nothing out, so nothing hides on the right: no scroll hint.
    expect(screen.queryByRole('button', { name: 'Прокрутить таблицу вправо' })).toBeNull()
  })
})
