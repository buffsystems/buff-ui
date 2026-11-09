import { describe, expect, test } from 'vitest'
import {
  AI_CONTEXT_PRESETS,
  AI_THINKING_LEVELS,
  aiContextChoiceItems,
  aiContextEffective,
  aiContextParse,
  aiContextOptions,
  aiContextPreset,
  aiContextWords,
  aiThinkingPickerItems,
  aiThinkingWords,
  aiModeSummary,
  formatTokens,
} from '../src/shared/ai-modes.ts'

// Режимы ИИ (#832, эпик #783): одни слова для окна, телефона и кабинета — уровни мышления
// (словарь Buff Code, #759) и пресеты окна контекста; «Свой» — число токенов.

describe('thinking levels', () => {
  test('the dictionary is BuffVariant: default first, then by effort', () => {
    expect(AI_THINKING_LEVELS).toEqual([
      'default',
      'none',
      'minimal',
      'low',
      'medium',
      'high',
      'xhigh',
      'max',
    ])
  })
  test('every level has a label and a hint in both languages; an unknown id shows as it is', () => {
    for (const id of AI_THINKING_LEVELS) {
      for (const locale of ['ru', 'en'] as const) {
        const w = aiThinkingWords(id, locale)
        expect(w.label.trim()).not.toBe('')
        expect(w.hint.trim()).not.toBe('')
      }
    }
    expect(aiThinkingWords('high', 'ru').label).toBe('Высокие')
    expect(aiThinkingWords('high', 'en').label).toBe('High')
    expect(aiThinkingWords('turbo', 'en')).toEqual({ label: 'turbo', hint: '' })
  })
})

describe('context window', () => {
  test('tokens print as thousands', () => {
    expect(formatTokens(64_000)).toBe('64k')
    expect(formatTokens(200_000)).toBe('200k')
    expect(formatTokens(1_048_576)).toBe('1M')
    expect(formatTokens(1_500_000)).toBe('1.5M')
    expect(formatTokens(500)).toBe('500')
  })
  test('presets are three numbers; 0 is the model maximum, anything else is custom', () => {
    expect(AI_CONTEXT_PRESETS).toEqual({ compact: 64_000, medium: 200_000, large: 500_000 })
    expect(aiContextPreset(0)).toBe('max')
    expect(aiContextPreset(200_000)).toBe('medium')
    expect(aiContextPreset(123_456)).toBe('custom')
  })
  test('words: a preset names itself and its size; the maximum names the model window when known', () => {
    expect(aiContextWords(200_000, 'ru')).toEqual({ label: 'Средний', detail: '200k' })
    expect(aiContextWords(200_000, 'en').label).toBe('Medium')
    expect(aiContextWords(0, 'ru', 1_000_000)).toEqual({
      label: 'Максимум модели',
      detail: '1M',
    })
    expect(aiContextWords(0, 'en')).toEqual({ label: 'Model maximum', detail: '' })
    expect(aiContextWords(123_456, 'ru')).toEqual({ label: 'Свой', detail: '123k' })
    // asked for more than the model serves — what will really apply
    expect(aiContextWords(500_000, 'ru', 128_000).detail).toBe('500k → 128k')
  })
  test('options for a select: maximum, the presets in size order, then custom; presets above the window are marked', () => {
    const options = aiContextOptions('ru', 128_000)
    expect(options.map((o) => o.value)).toEqual(['0', '64000', '200000', '500000', 'custom'])
    expect(options[0].label).toBe('Максимум модели')
    expect(options[2].disabled).toBe(true)
    expect(aiContextOptions('en').every((o) => !o.disabled)).toBe(true)
  })
})

describe('summary line', () => {
  test('names both values in a line, in the locale', () => {
    expect(aiModeSummary({ thinking: 'high', contextTokens: 200_000 }, 'ru')).toBe(
      'Размышления: высокие · Контекст: средний, 200k',
    )
    expect(aiModeSummary({ thinking: 'default', contextTokens: 0 }, 'en')).toBe(
      'Thinking: default · Context: model maximum',
    )
  })
})

// #839: the limit in force — the model's window cut by the session's cap; a zero cap is none.
test('the effective window is the model window cut by the cap, never raised', () => {
  expect(aiContextEffective(400_000, 200_000)).toBe(200_000)
  expect(aiContextEffective(100_000, 200_000)).toBe(100_000)
  expect(aiContextEffective(400_000, 0)).toBe(400_000)
  expect(aiContextEffective(undefined, 200_000)).toBe(200_000)
  expect(aiContextEffective(undefined, undefined)).toBeUndefined()
})

// #839: a size typed by hand — tokens, 150k or 1.5M — within the model window, from 1k up.
test('a typed window size is tokens from 1k up to the model window; junk is nothing', () => {
  expect(aiContextParse('150000', 400_000)).toBe(150_000)
  expect(aiContextParse(' 150 000 ', 400_000)).toBe(150_000)
  expect(aiContextParse('150k', 400_000)).toBe(150_000)
  expect(aiContextParse('1.5M', undefined)).toBe(1_500_000)
  expect(aiContextParse('500', 400_000)).toBeUndefined()
  expect(aiContextParse('500000', 400_000)).toBeUndefined()
  expect(aiContextParse('abc', 400_000)).toBeUndefined()
  expect(aiContextParse('', 400_000)).toBeUndefined()
})

// #840: a phone picker's items for a session's override — «default (…)» first, then the values.
test('the thinking picker names the inherited level first, then every level the model has', () => {
  const items = aiThinkingPickerItems('ru', 'high', ['low', 'high'])
  expect(items.map((i) => i.id)).toEqual(['default', 'low', 'high'])
  expect(items[0]).toMatchObject({ id: 'default', title: 'По умолчанию (Высокие)' })
  expect(items[1]).toMatchObject({ title: 'Низкие' })
  expect(aiThinkingPickerItems('en', 'default', null).map((i) => i.id)).toEqual([
    'default',
    'none',
    'minimal',
    'low',
    'medium',
    'high',
    'xhigh',
    'max',
  ])
  expect(aiThinkingPickerItems('en', 'default', null)[0]?.title).toBe('Default (Default)')
})

test('the context picker names the inherited cap first, then the sizes that fit and a custom one', () => {
  const items = aiContextChoiceItems('ru', 200_000, 400_000)
  expect(items.map((i) => i.id)).toEqual(['default', '0', '64000', '200000', 'custom'])
  expect(items[0]?.title).toBe('По умолчанию (Средний · 200k)')
})
