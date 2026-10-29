import { describe, expect, test } from 'vitest'
import { isLanguageChoice, pickLocale, resolveLocale } from '../src/shared/locale.ts'

describe('pickLocale (#713)', () => {
  test('the first Russian or English language wins', () => {
    expect(pickLocale(['ru-RU', 'en-US'])).toBe('ru')
    expect(pickLocale(['en-GB', 'ru'])).toBe('en')
    expect(pickLocale(['de-DE', 'en-US'])).toBe('en')
    expect(pickLocale(['EN_us'])).toBe('en')
  })

  test('any other language, or none, gives Russian', () => {
    expect(pickLocale(['de-DE'])).toBe('ru')
    expect(pickLocale([])).toBe('ru')
    expect(pickLocale([undefined, ''])).toBe('ru')
    expect(pickLocale(['rue'])).toBe('ru')
    expect(pickLocale(['enx-US', 'fr'])).toBe('ru')
  })
})

test('a made choice overrides the system', () => {
  expect(resolveLocale('en', ['ru-RU'])).toBe('en')
  expect(resolveLocale('ru', ['en-US'])).toBe('ru')
  expect(resolveLocale('system', ['en-US'])).toBe('en')
  expect(isLanguageChoice('system')).toBe(true)
  expect(isLanguageChoice('de')).toBe(false)
})
