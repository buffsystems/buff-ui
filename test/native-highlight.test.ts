import { describe, expect, it } from 'vitest'
import { highlight, highlightLine } from '../src/native/highlight.ts'

describe('highlight', () => {
  it('tells comments, strings, numbers, keywords and calls apart', () => {
    const tokens = highlightLine('const n = parse("x") + 42 // note', 'ts')
    expect(tokens.map((t) => t.kind)).toEqual([
      'keyword',
      'plain',
      'func',
      'plain',
      'string',
      'plain',
      'number',
      'plain',
      'comment',
    ])
    expect(tokens.map((t) => t.text).join('')).toBe('const n = parse("x") + 42 // note')
  })

  it('knows the hash comment of python and shell, and keeps unknown languages plain-ish', () => {
    expect(highlightLine('x = 1  # one', 'py').at(-1)).toEqual({ kind: 'comment', text: '# one' })
    expect(highlightLine('def f():', 'python')[0]).toEqual({ kind: 'keyword', text: 'def' })
    expect(highlightLine('echo hi # x', 'bash').at(-1)?.kind).toBe('comment')
    expect(highlightLine('return 1', 'brainfuck')[0].kind).toBe('keyword')
  })

  it('tokenises every line and never loses a character', () => {
    const code = 'if (a) {\r\n  b = `t ${a}`\n}\n'
    const lines = highlight(code, 'js')
    expect(lines).toHaveLength(4)
    expect(lines.map((l) => l.map((t) => t.text).join(''))).toEqual([
      'if (a) {',
      '  b = `t ${a}`',
      '}',
      '',
    ])
  })
})
