// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import {
  Badge,
  Button,
  buttonClass,
  Chip,
  ChipRow,
  Field,
  IconButton,
  Input,
  Segmented,
  Select,
  SelectMenu,
  Separator,
  StatusDot,
  Textarea,
} from '../src/react/index.ts'

afterEach(cleanup)

describe('Button', () => {
  test('defaults to the outline look at the medium size', () => {
    render(<Button>Сохранить</Button>)
    expect(screen.getByRole('button', { name: 'Сохранить' }).className).toBe(
      'ui-btn ui-btn--outline ui-btn--md',
    )
  })

  test('adds variant, size, block and the caller class', () => {
    render(
      <Button variant="primary" size="sm" block className="mt-2">
        Создать
      </Button>,
    )
    expect(screen.getByRole('button').className).toBe(
      'ui-btn ui-btn--primary ui-btn--sm ui-btn--block mt-2',
    )
  })

  test('loading disables it and replaces the leading icon with a spinner', () => {
    render(
      <Button loading leadingIcon={Plus}>
        Создать
      </Button>,
    )
    const button = screen.getByRole('button', { name: /Создать/ })
    expect(button).toHaveProperty('disabled', true)
    expect(within(button).getByRole('status')).toBeTruthy()
    expect(button.querySelectorAll('svg')).toHaveLength(1)
  })

  test('asChild gives a link the button look', () => {
    render(
      <Button asChild variant="link">
        <a href="/docs">Документация</a>
      </Button>,
    )
    expect(screen.getByRole('link').className).toBe('ui-btn ui-btn--link ui-btn--md')
  })

  test('an inline link in running text drops the size box, stays a named button', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <p>
        Ключ не подошёл.{' '}
        <Button variant="link" size="inline" onClick={onClick}>
          Открыть настройки
        </Button>
      </p>,
    )
    const button = screen.getByRole('button', { name: 'Открыть настройки' })
    expect(button.className).toBe('ui-btn ui-btn--link ui-btn--inline')
    expect(buttonClass({ variant: 'link', size: 'inline' })).toBe(button.className)
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

test('a ref reaches the native element of Button, IconButton, Input and Textarea', () => {
  const button = createRef<HTMLButtonElement>()
  const icon = createRef<HTMLButtonElement>()
  const input = createRef<HTMLInputElement>()
  const textarea = createRef<HTMLTextAreaElement>()
  render(
    <>
      <Button ref={button}>Отправить</Button>
      <IconButton ref={icon} icon={Plus} aria-label="Добавить" />
      <Input ref={input} leadingIcon={Search} aria-label="Поиск" />
      <Textarea ref={textarea} aria-label="Заметка" />
    </>,
  )
  expect(button.current).toBe(screen.getByRole('button', { name: 'Отправить' }))
  expect(icon.current).toBe(screen.getByRole('button', { name: 'Добавить' }))
  expect(input.current).toBe(screen.getByRole('textbox', { name: 'Поиск' }))
  expect(textarea.current).toBe(screen.getByRole('textbox', { name: 'Заметка' }))
})

test('buttonClass gives another element the same look', () => {
  expect(buttonClass()).toBe('ui-btn ui-btn--outline ui-btn--md')
  expect(buttonClass({ variant: 'primary', size: 'lg', block: true })).toBe(
    'ui-btn ui-btn--primary ui-btn--lg ui-btn--block',
  )
})

describe('IconButton', () => {
  test('is a square ghost named by its label', () => {
    render(<IconButton icon={Plus} aria-label="Добавить" />)
    expect(screen.getByRole('button', { name: 'Добавить' }).className).toBe(
      'ui-btn ui-btn--icon ui-btn--ghost ui-btn--md',
    )
  })

  test('danger is a ghost tinted for removing', () => {
    render(<IconButton icon={Trash2} aria-label="Удалить" variant="danger" size="sm" />)
    expect(screen.getByRole('button').className).toContain(
      'ui-btn--ghost ui-btn--danger ui-btn--sm',
    )
  })
  test('takes a ready element in place of a lucide icon', () => {
    render(<IconButton icon={<svg data-testid="ring" />} aria-label="Контекст" />)
    const button = screen.getByRole('button', { name: 'Контекст' })
    expect(within(button).getByTestId('ring')).toBeTruthy()
  })
})

describe('Badge', () => {
  test('is a word first — the dot is decorative', () => {
    render(
      <Badge tone="warn" dot>
        На ревью
      </Badge>,
    )
    expect(
      screen.getByText('На ревью').querySelector('.ui-badge__dot')?.getAttribute('aria-hidden'),
    ).toBe('true')
  })

  test('carries its tone and an optional dot', () => {
    render(
      <Badge tone="ok" dot>
        Готово
      </Badge>,
    )
    const badge = screen.getByText('Готово')
    expect(badge.className).toBe('ui-badge ui-badge--ok')
    expect(badge.querySelector('.ui-badge__dot')).toBeTruthy()
  })
})

describe('Chip / Segmented', () => {
  test('chips expose pressed state and their count', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ChipRow label="Фильтр">
        <Chip pressed count={9} onClick={onClick}>
          Все
        </Chip>
        <Chip pressed={false} count={2} onClick={onClick}>
          На ревью
        </Chip>
      </ChipRow>,
    )
    const group = screen.getByRole('group', { name: 'Фильтр' })
    expect(within(group).getByRole('button', { name: /Все/ }).getAttribute('aria-pressed')).toBe(
      'true',
    )
    await user.click(within(group).getByRole('button', { name: /На ревью/ }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('a chip passes data-* and other native attributes to its button', () => {
    render(
      <Chip pressed={false} onClick={() => {}} data-action="filter-saved" title="Сохранённые">
        Сохранённые
      </Chip>,
    )
    const chip = screen.getByRole('button', { name: 'Сохранённые' })
    expect(chip.getAttribute('data-action')).toBe('filter-saved')
    expect(chip.getAttribute('title')).toBe('Сохранённые')
    expect(chip.getAttribute('type')).toBe('button')
  })

  test('without pressed a chip is a plain action: no toggle state, pressed filters intact', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ChipRow label="Подсказки">
        <Chip onClick={onClick}>Почини тесты</Chip>
        <Chip pressed onClick={() => {}}>
          Все
        </Chip>
      </ChipRow>,
    )
    const action = screen.getByRole('button', { name: 'Почини тесты' })
    expect(action.hasAttribute('aria-pressed')).toBe(false)
    expect(action.className).toBe('ui-chip')
    await user.click(action)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(action.hasAttribute('aria-pressed')).toBe(false)
    expect(screen.getByRole('button', { name: 'Все' }).getAttribute('aria-pressed')).toBe('true')
  })

  test('segmented marks the selected option, switches on click and sizes its grid', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Segmented
        label="Замечания"
        value="all"
        onChange={onChange}
        options={[
          { id: 'all', label: 'Все', count: 3 },
          { id: 'open', label: 'Открытые', count: 2 },
          { id: 'closed', label: 'Закрытые' },
        ]}
      />,
    )
    const group = screen.getByRole('group', { name: 'Замечания' })
    expect(group.className).toContain('ui-segmented--3')
    expect(within(group).getByRole('button', { name: /Все/ }).getAttribute('aria-pressed')).toBe(
      'true',
    )
    await user.click(within(group).getByRole('button', { name: /Открытые/ }))
    expect(onChange).toHaveBeenCalledWith('open')
  })
})

describe('Field', () => {
  test('labels its control and shows the hint', () => {
    render(
      <Field label="Имя" hint="Как вас называть">
        <Input defaultValue="Ада" />
      </Field>,
    )
    expect(screen.getByLabelText(/Имя/)).toHaveProperty('value', 'Ада')
    expect(screen.getByText('Как вас называть')).toBeTruthy()
  })

  test('an error replaces the hint and is announced', () => {
    render(
      <Field label="Почта" hint="рабочая" error="Неверный адрес">
        <Input />
      </Field>,
    )
    expect(screen.getByRole('alert').textContent).toBe('Неверный адрес')
    expect(screen.queryByText('рабочая')).toBeNull()
  })

  test('the hint describes the control without joining its name', () => {
    render(
      <Field label="Имя" hint="Как вас называть">
        <Input aria-describedby="own" />
      </Field>,
    )
    const input = screen.getByRole('textbox', { name: 'Имя' })
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids[0]).toBe('own')
    expect(document.getElementById(ids[1])?.textContent).toBe('Как вас называть')
    expect(input.hasAttribute('aria-invalid')).toBe(false)
  })

  test('an error describes the control and marks it invalid; its text stays out of the name', () => {
    render(
      <Field label="Почта" error="Неверный адрес">
        <Textarea />
      </Field>,
    )
    const control = screen.getByRole('textbox', { name: 'Почта' })
    const error = screen.getByRole('alert')
    expect(error.id).toBeTruthy()
    expect(control.getAttribute('aria-describedby')).toBe(error.id)
    expect(control.getAttribute('aria-invalid')).toBe('true')
  })

  test('a native select and a select menu pick up the description too', () => {
    render(
      <>
        <Field label="Регион" hint="Ближе к вам">
          <Select defaultValue="eu">
            <option value="eu">EU</option>
          </Select>
        </Field>
        <Field label="Модель" error="Выберите модель">
          <SelectMenu options={[{ value: 'a', label: 'A' }]} placeholder="—" />
        </Field>
      </>,
    )
    const select = screen.getByRole('combobox', { name: 'Регион' })
    expect(
      document.getElementById(select.getAttribute('aria-describedby') ?? '')?.textContent,
    ).toBe('Ближе к вам')
    const menu = screen.getByRole('combobox', { name: /Модель/ })
    expect(menu.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id)
    expect(menu.getAttribute('aria-invalid')).toBe('true')
  })

  test('a group is described as a whole; its controls are not', () => {
    render(
      <Field label="Роль" group hint="Можно сменить позже">
        <Input aria-label="Своя роль" />
      </Field>,
    )
    const group = screen.getByRole('group', { name: 'Роль' })
    expect(document.getElementById(group.getAttribute('aria-describedby') ?? '')?.textContent).toBe(
      'Можно сменить позже',
    )
    expect(screen.getByRole('textbox').hasAttribute('aria-describedby')).toBe(false)
  })

  test('select stays a native select inside the styled wrapper', () => {
    render(
      <Select aria-label="Роль" className="w-40" defaultValue="b">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    )
    const select = screen.getByRole('combobox', { name: 'Роль' })
    expect(select.tagName).toBe('SELECT')
    expect(select.parentElement?.className).toBe('ui-select w-40')
  })
})

describe('StatusDot / Separator', () => {
  test('a dot is decorative and carries tone, pulse and size', () => {
    const { container } = render(<StatusDot tone="warn" pulse size={10} />)
    const dot = container.firstElementChild as HTMLElement
    expect(dot.getAttribute('aria-hidden')).toBe('true')
    expect(dot.className).toBe('ui-dot ui-dot--warn ui-dot--pulse')
    expect(dot.style.getPropertyValue('--ui-dot-size')).toBe('10px')
  })

  test('an unknown or missing tone falls back to the neutral dot', () => {
    const { container, rerender } = render(<StatusDot tone="degraded" />)
    const dot = container.firstElementChild as HTMLElement
    expect(dot.className).toBe('ui-dot ui-dot--neutral')
    rerender(<StatusDot tone={null} />)
    expect((container.firstElementChild as HTMLElement).className).toBe('ui-dot ui-dot--neutral')
    rerender(<StatusDot />)
    expect((container.firstElementChild as HTMLElement).className).toBe('ui-dot ui-dot--neutral')
  })

  test('a separator is hidden from assistive tech unless asked', () => {
    const { rerender } = render(<Separator orientation="vertical" />)
    expect(screen.queryByRole('separator')).toBeNull()
    rerender(<Separator orientation="vertical" decorative={false} />)
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical')
  })
})

describe('Field group / Segmented choice', () => {
  test('a group field names the whole group, not its first control', () => {
    render(
      <Field label="Роль" group>
        <button type="button">А</button>
        <button type="button">Б</button>
      </Field>,
    )
    expect(screen.getByRole('group', { name: 'Роль' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'А' })).toBeTruthy()
  })

  test('a segmented choice may start empty and disable an option', () => {
    render(
      <Segmented
        label="Тип"
        value={null}
        onChange={() => {}}
        options={[
          { id: 'a', label: 'Одна' },
          { id: 'b', label: 'Две', disabled: true },
        ]}
      />,
    )
    expect(screen.getByRole('button', { name: 'Одна' }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByRole('button', { name: 'Две' })).toHaveProperty('disabled', true)
  })
})
