// The research document under its top bar (#691): the opening heading goes only when it repeats
// the title the bar already shows.
import { expect, test } from 'vitest'
import { documentBody } from '../src/native/screens/cabinet/research/model.ts'

test('a heading that repeats the title goes, any other stays', () => {
  expect(documentBody('# Релевантность\n\nТекст', 'Релевантность')).toBe('\nТекст')
  expect(documentBody('# Другое\n\nТекст', 'Релевантность')).toBe('# Другое\n\nТекст')
  expect(documentBody('Текст без заголовка', 'Релевантность')).toBe('Текст без заголовка')
})
