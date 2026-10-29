import { describe, expect, it } from 'vitest'
import { columnWidths, parseMarkdown } from '../src/native/markdown.ts'

describe('parseMarkdown', () => {
  it('splits headings, paragraphs, lists, code and quotes', () => {
    const blocks = parseMarkdown(
      '# Отчёт\n\nПервый абзац\nпродолжение.\n\n- один\n- два\n\n1. раз\n2. два\n\n```ts\nconst x = 1\n```\n\n> цитата\n> ещё\n\n## Итог',
    )
    expect(blocks).toEqual([
      { kind: 'heading', level: 1, text: 'Отчёт' },
      { kind: 'paragraph', text: 'Первый абзац продолжение.' },
      { kind: 'list', ordered: false, items: ['один', 'два'] },
      { kind: 'list', ordered: true, items: ['раз', 'два'] },
      { kind: 'code', language: 'ts', code: 'const x = 1' },
      { kind: 'quote', text: 'цитата ещё' },
      { kind: 'heading', level: 2, text: 'Итог' },
    ])
  })

  it('keeps an unterminated fence and CRLF input', () => {
    expect(parseMarkdown('```\na\r\nb')).toEqual([
      { kind: 'code', language: undefined, code: 'a\nb' },
    ])
    expect(parseMarkdown('')).toEqual([])
  })

  // Seen on the phone (#645): an answer's table came out as raw «| a | b |» lines.
  it('reads a GFM table: header, alignment row, cells trimmed, short rows padded', () => {
    expect(
      parseMarkdown(
        'Итог:\n\n| sku | title |\n|-----|:-----:|\n| A-1 | Кружка |\n| A-2 |\n\nКонец.',
      ),
    ).toEqual([
      { kind: 'paragraph', text: 'Итог:' },
      {
        kind: 'table',
        header: ['sku', 'title'],
        rows: [
          ['A-1', 'Кружка'],
          ['A-2', ''],
        ],
      },
      { kind: 'paragraph', text: 'Конец.' },
    ])
  })

  it('a pipe line without the alignment row stays a paragraph', () => {
    expect(parseMarkdown('| a | b |\nтекст')).toEqual([
      { kind: 'paragraph', text: '| a | b | текст' },
    ])
  })

  it('gives each column one width, from its longest cell, within bounds', () => {
    expect(
      columnWidths([
        ['sku', 'title'],
        ['A-1', 'Футболка'],
        ['A-2', '**Кружка**'],
      ]),
    ).toEqual([72, 96])
    expect(columnWidths([['x'.repeat(100)]])).toEqual([220])
  })
})
