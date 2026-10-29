import { describe, expect, it } from 'vitest'
import { rubles } from '../src/native/i18n.ts'

describe('rubles', () => {
  it('shows kopecks at most, in the interface language', () => {
    expect(rubles(37.897, 'ru')).toBe('37,9')
    expect(rubles(0.413, 'ru')).toBe('0,41')
    expect(rubles(37.897, 'en')).toBe('37.9')
    expect(rubles(1200, 'ru')).toBe('1 200')
  })
})
