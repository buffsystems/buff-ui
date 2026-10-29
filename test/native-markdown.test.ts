import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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

  // Seen on the phone (#628): task #15's approved formulation quotes a section in a
  // ````markdown fence; the parser never moved past that line, so the card hung on «Loading…»
  // with the JS thread at 100% and memory climbing. Parsed in a child process with a deadline,
  // so a relapse fails here instead of hanging the suite.
  it('parses the real task #15 formulation: a four-backtick fence holds the inner Markdown', () => {
    const source = readFileSync(
      new URL('./fixtures/task15-formulation.md', import.meta.url),
      'utf8',
    )
    const blocks = parseBounded(source)
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph', 'code'])
    expect(blocks[2]).toMatchObject({ kind: 'code', language: 'markdown' })
    const code = (blocks[2] as { code: string }).code
    expect(code.startsWith('## Как сообщить об ошибке\n')).toBe(true)
    expect(code.endsWith('- фактическое поведение.')).toBe(true)
  })

  it('ends on every line a fence does not open: odd info strings, stray backticks', () => {
    expect(parseBounded('```c++\nint x;\n```')).toEqual([
      { kind: 'code', language: 'c++', code: 'int x;' },
    ])
    expect(parseBounded('```ts title\nx\n```')).toEqual([
      { kind: 'code', language: 'ts', code: 'x' },
    ])
    expect(parseBounded('```a`b\nтекст')).toEqual([{ kind: 'paragraph', text: '```a`b текст' }])
    expect(parseBounded('````\n```\ninner\n```\n````')).toEqual([
      { kind: 'code', language: undefined, code: '```\ninner\n```' },
    ])
  })
})

/** parseMarkdown in a child process, killed past a deadline — a runaway parse fails, not hangs. */
function parseBounded(source: string): ReturnType<typeof parseMarkdown> {
  const module = new URL('../src/native/markdown.ts', import.meta.url).href
  const run = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--no-warnings',
      '--input-type=module',
      '-e',
      `import { parseMarkdown } from ${JSON.stringify(module)}
process.stdout.write(JSON.stringify(parseMarkdown(${JSON.stringify(source)})))`,
    ],
    { encoding: 'utf8', timeout: 10_000, maxBuffer: 1 << 20 },
  )
  if (run.status !== 0) throw new Error(`parse did not finish (${run.signal ?? run.stderr})`)
  return JSON.parse(run.stdout) as ReturnType<typeof parseMarkdown>
}
