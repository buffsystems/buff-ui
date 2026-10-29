import { describe, expect, it } from 'vitest'
import { auditSectionAbout, auditSectionTitle } from '../src/native/index.ts'

describe('audit section titles (#689)', () => {
  it('names a canonical section in the interface language', () => {
    expect(auditSectionTitle('B-testability', 'ru', 'B. Тестируемость')).toBe('B. Тестируемость')
    expect(auditSectionTitle('B-testability', 'en', 'B. Тестируемость')).toBe('B. Testability')
    expect(auditSectionTitle('C-build-deploy', 'en', 'x')).toBe(
      'C. Build, deploy and reproducibility',
    )
  })

  it('keeps the server title for a section it does not know', () => {
    expect(auditSectionTitle('K-new', 'en', 'K. Новый раздел')).toBe('K. Новый раздел')
  })

  it('says what a section is about, nothing for an unknown one', () => {
    expect(auditSectionAbout('J-contracts', 'en')).toBe(
      'Contracts and integrations with the outside world.',
    )
    expect(auditSectionAbout('J-contracts', 'ru')).toBe('Контракты и интеграции с внешним миром.')
    expect(auditSectionAbout('K-new', 'en')).toBe('')
  })

  it('covers all ten canonical sections in both languages', () => {
    const ids = [
      'A-architecture',
      'B-testability',
      'C-build-deploy',
      'D-dependencies',
      'E-security',
      'F-process',
      'G-behavior',
      'H-interface',
      'I-constraints',
      'J-contracts',
    ]
    for (const id of ids) {
      const letter = id[0]!
      expect(auditSectionTitle(id, 'en', '?').startsWith(`${letter}. `), id).toBe(true)
      expect(auditSectionTitle(id, 'ru', '?').startsWith(`${letter}. `), id).toBe(true)
      expect(auditSectionAbout(id, 'en'), id).not.toBe('')
    }
  })
})
