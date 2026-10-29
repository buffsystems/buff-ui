import { describe, expect, it } from 'vitest'
import { makeTranslate, registeredStrings } from '../src/native/index.ts'

describe('native strings', () => {
  it('every registered key has both languages, non-empty', () => {
    const all = registeredStrings()
    expect(Object.keys(all).length).toBeGreaterThan(50)
    for (const [key, entry] of Object.entries(all)) {
      expect(entry.ru.trim(), key).not.toBe('')
      expect(entry.en.trim(), key).not.toBe('')
      expect(key).toMatch(/^[a-z]+\.[A-Za-z0-9]+$/)
    }
  })

  it('placeholders match between the languages', () => {
    for (const [key, entry] of Object.entries(registeredStrings())) {
      const vars = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort()
      expect(vars(entry.ru), key).toEqual(vars(entry.en))
    }
  })

  it('translates with interpolation; an unknown key shows itself', () => {
    const ru = makeTranslate('ru')
    const en = makeTranslate('en')
    expect(ru('common.offlineSince', { time: '14:20' })).toBe('Недоступна с 14:20')
    expect(en('common.offlineSince', { time: '14:20' })).toBe('Unavailable since 14:20')
    expect(ru('nope.missing')).toBe('nope.missing')
  })
})
