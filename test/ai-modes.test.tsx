// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AiContextSelect,
  AiModeChip,
  AiModeMatrix,
  AiModeNote,
  AiModeParams,
  AiThinkingSelect,
  LocaleProvider,
} from '../src/react/index.ts'
import { aiModeGroups, cellValue, groupSummary } from '../src/react/ai-modes/model.ts'
import type { AiModeStepDef } from '../src/react/ai-modes/model.ts'
import { shimLayoutApis } from './jsdom-shims.ts'

beforeAll(shimLayoutApis)
afterEach(cleanup)

// Режимы ИИ (#832, эпик #783): уровень мышления и окно контекста по шагам и ролям — выбор с
// пояснениями, матрица фаз × ролей с наследованием, чип с поповером, строка-заметка, блок
// «Параметры ИИ» для форм создания. Словарь шагов приходит с сервера (common-lib).

const ANALYST = { id: 'analyst', label: { ru: 'Аналитик', en: 'Analyst' } }
const REVIEWER = { id: 'reviewer', label: { ru: 'Ревьюер', en: 'Reviewer' } }
const DEVELOPER = { id: 'developer', label: { ru: 'Разработчик', en: 'Developer' } }
const STEPS: AiModeStepDef[] = [
  {
    id: 'ask',
    label: { ru: 'Спросить', en: 'Ask' },
    roles: [{ id: 'responder', label: { ru: 'Ответчик', en: 'Responder' } }],
  },
  { id: 'audit', label: { ru: 'Аудит', en: 'Audit' }, roles: [ANALYST, REVIEWER] },
  {
    id: 'task_formulate',
    label: { ru: 'Задача — формулировка и доработка', en: 'Task — formulation and rework' },
    roles: [ANALYST, REVIEWER],
  },
  {
    id: 'task_develop',
    label: { ru: 'Задача — разработка', en: 'Task — development' },
    roles: [DEVELOPER],
  },
]
const INHERITED = [
  { step: 'ask', role: 'responder', thinking: 'high', context_tokens: 200_000 },
  { step: 'task_formulate', role: 'analyst', thinking: 'medium', context_tokens: null },
]
const OWN = [{ step: 'task_develop', role: 'developer', thinking: 'max', context_tokens: null }]

describe('matrix model', () => {
  test('groups the task phases under one scenario, the rest stand alone, in dictionary order', () => {
    const groups = aiModeGroups(STEPS)
    expect(groups.map((g) => g.id)).toEqual(['ask', 'audit', 'task'])
    expect(groups[2].steps.map((s) => s.id)).toEqual(['task_formulate', 'task_develop'])
    expect(groups[2].label.ru).toBe('Задача')
  })

  test('a cell reads its own value first, then the inherited one, else nothing', () => {
    expect(cellValue(OWN, INHERITED, 'task_develop', 'developer')).toEqual({
      thinking: { value: 'max', source: 'own' },
      context: { value: 0, source: 'none' },
    })
    expect(cellValue(OWN, INHERITED, 'ask', 'responder')).toEqual({
      thinking: { value: 'high', source: 'inherited' },
      context: { value: 200_000, source: 'inherited' },
    })
    expect(cellValue(OWN, INHERITED, 'audit', 'analyst')).toEqual({
      thinking: { value: 'default', source: 'none' },
      context: { value: 0, source: 'none' },
    })
  })

  test('a group summary names the values when every cell agrees, else says they differ', () => {
    const groups = aiModeGroups(STEPS)
    expect(groupSummary(groups[0], OWN, INHERITED, 'ru')).toBe(
      'Размышления: высокие · Контекст: средний, 200k',
    )
    expect(groupSummary(groups[2], OWN, INHERITED, 'ru')).toBe('Разные')
    expect(groupSummary(groups[2], OWN, INHERITED, 'en')).toBe('Mixed')
    expect(groupSummary(groups[1], [], [], 'en')).toBe('Thinking: default · Context: model maximum')
  })
})

describe('AiThinkingSelect', () => {
  test('shows the level by its words, in the locale', () => {
    const { unmount } = render(
      <AiThinkingSelect aria-label="Режим" value="high" onChange={() => {}} />,
    )
    expect(screen.getByRole('combobox', { name: 'Режим' }).textContent).toContain('Высокие')
    unmount()
    render(
      <LocaleProvider locale="en">
        <AiThinkingSelect aria-label="Mode" value="high" onChange={() => {}} />
      </LocaleProvider>,
    )
    expect(screen.getByRole('combobox', { name: 'Mode' }).textContent).toContain('High')
  })

  test('with an inherited value, «as above» is the choice and it names the inherited level', () => {
    render(
      <AiThinkingSelect
        aria-label="Режим"
        value={null}
        onChange={() => {}}
        inherited="high"
        inheritedFrom="как у установки"
      />,
    )
    expect(screen.getByRole('combobox', { name: 'Режим' }).textContent).toContain(
      'Как у установки (Высокие)',
    )
  })
})

describe('AiContextSelect', () => {
  test('a preset shows its name; a custom number shows «Свой» and a thousands field', async () => {
    const onChange = vi.fn()
    const { unmount } = render(
      <AiContextSelect aria-label="Окно" value={200_000} onChange={onChange} />,
    )
    expect(screen.getByRole('combobox', { name: 'Окно' }).textContent).toContain('Средний')
    expect(screen.queryByRole('spinbutton')).toBeNull()
    unmount()
    render(<AiContextSelect aria-label="Окно" value={123_456} onChange={onChange} />)
    expect(screen.getByRole('combobox', { name: 'Окно' }).textContent).toContain('Свой')
    const field = screen.getByRole('spinbutton') as HTMLInputElement
    expect(field.value).toBe('123')
    await userEvent.setup().clear(field)
    await userEvent.setup().type(field, '300')
    expect(onChange).toHaveBeenLastCalledWith(300_000)
  })

  test('tells what will really apply when the request is above the model window', () => {
    render(
      <AiContextSelect
        aria-label="Окно"
        value={500_000}
        onChange={() => {}}
        modelWindow={128_000}
      />,
    )
    expect(screen.getByText(/500k → 128k/)).toBeTruthy()
  })
})

describe('AiModeMatrix', () => {
  test('one card per scenario with a summary; inherited cells are marked; only an overridden row can be reset', async () => {
    const onChange = vi.fn()
    render(
      <AiModeMatrix
        steps={STEPS}
        own={OWN}
        inherited={INHERITED}
        inheritedFrom="как у установки"
        onChange={onChange}
        defaultOpen
      />,
    )
    const cards = screen.getAllByRole('region')
    expect(cards.map((c) => c.getAttribute('aria-label'))).toEqual(['Спросить', 'Аудит', 'Задача'])
    // the summary sits in the card's head, beside the title
    expect(screen.getByText('Размышления: высокие · Контекст: средний, 200k')).toBeTruthy()
    // the card's head says the task's cells differ (the bulk row repeats it as a placeholder)
    expect(screen.getAllByText('Разные').length).toBeGreaterThanOrEqual(1)
    expect(within(cards[0]).getAllByText('как у установки').length).toBeGreaterThan(0)
    const resets = screen.getAllByRole('button', { name: /Сбросить/ })
    expect(resets.length).toBe(1)
    await userEvent.setup().click(resets[0])
    expect(onChange).toHaveBeenCalledWith([
      { step: 'task_develop', role: 'developer', thinking: null, context_tokens: null },
    ])
  })

  test('the bulk row of a scenario writes every cell of its phases', async () => {
    const onChange = vi.fn()
    render(
      <LocaleProvider locale="en">
        <AiModeMatrix
          steps={STEPS}
          own={[]}
          inherited={[]}
          inheritedFrom="as the installation"
          onChange={onChange}
          defaultOpen
        />
      </LocaleProvider>,
    )
    const task = screen.getByRole('region', { name: 'Task' })
    const bulk = within(task).getByRole('row', { name: /All phases and roles/ })
    expect(bulk).toBeTruthy()
    expect(within(task).getAllByRole('combobox').length).toBe(2 * (1 + 3))
  })
})

describe('AiModeNote and AiModeChip and AiModeParams', () => {
  test('the note is a quiet service row', () => {
    render(<AiModeNote>Режим ИИ изменён: размышления — высокие.</AiModeNote>)
    const note = screen.getByRole('note')
    expect(note.className).toContain('ui-ai-note')
    expect(note.textContent).toContain('Режим ИИ изменён')
  })

  test('the chip names the mode in one line and opens its panel', async () => {
    render(
      <AiModeChip thinking="high" contextTokens={200_000}>
        <div>панель</div>
      </AiModeChip>,
    )
    const chip = screen.getByRole('button', {
      name: /Размышления: высокие · Контекст: средний, 200k/,
    })
    await userEvent.setup().click(chip)
    expect(await screen.findByText('панель')).toBeTruthy()
  })

  test('the params block is folded with the summary and unfolds into the two choices', async () => {
    render(
      <AiModeParams
        thinking={null}
        contextTokens={null}
        defaults={{ thinking: 'high', contextTokens: 200_000 }}
        onChange={() => {}}
      />,
    )
    const trigger = screen.getByRole('button', { name: /Параметры ИИ/ })
    expect(trigger.textContent).toContain('Размышления: высокие · Контекст: средний, 200k')
    expect(screen.queryAllByRole('combobox').length).toBe(0)
    await userEvent.setup().click(trigger)
    expect(screen.getAllByRole('combobox').length).toBe(2)
    expect(screen.getByRole('combobox', { name: 'Размышления' }).textContent).toContain(
      'По умолчанию (Высокие)',
    )
  })
})
