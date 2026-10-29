/*
  The subset of Markdown the native screens render (#629): headings, paragraphs, lists, fenced
  code, quotes and tables — what a report, an answer or a knowledge entry is made of. Pure: no React.
*/
export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'code'; language?: string; code: string }
  | { kind: 'quote'; text: string }
  | { kind: 'table'; header: string[]; rows: string[][] }

/**
 * One width per column, so the rows line up: the longest cell's length decides, within bounds
 * (a cell past the cap wraps). Characters stand in for pixels at the body font size.
 */
export function columnWidths(
  rows: readonly (readonly string[])[],
  perChar = 9,
  pad = 24,
): number[] {
  const n = Math.max(0, ...rows.map((r) => r.length))
  return Array.from({ length: n }, (_, c) => {
    const longest = Math.max(0, ...rows.map((r) => (r[c] ?? '').replace(/[*`]/g, '').length))
    return Math.min(220, Math.max(72, longest * perChar + pad))
  })
}

const cells = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
const isAlignRow = (line: string | undefined): boolean =>
  line !== undefined && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line)

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = []
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i += 1
      continue
    }
    // A fence of three or more backticks, closed by a run at least as long — so a ````markdown
    // fence can quote Markdown with its own ``` fences inside. Its info string has no backtick.
    const fence = /^(`{3,})([^`]*)$/.exec(line)
    if (fence) {
      const close = new RegExp(`^\`{${fence[1].length},}\\s*$`)
      const code: string[] = []
      i += 1
      while (i < lines.length && !close.test(lines[i])) code.push(lines[i++])
      i += 1
      blocks.push({
        kind: 'code',
        language: fence[2].trim().split(/\s+/)[0] || undefined,
        code: code.join('\n'),
      })
      continue
    }
    // A GFM table: a pipe row, then the alignment row; rows run until a line without a pipe.
    if (line.includes('|') && isAlignRow(lines[i + 1])) {
      const header = cells(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        const row = cells(lines[i++])
        rows.push(header.map((_, c) => row[c] ?? ''))
      }
      blocks.push({ kind: 'table', header, rows })
      continue
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length as 1 | 2 | 3, text: heading[2] })
      i += 1
      continue
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ''))
      blocks.push({ kind: 'quote', text: quote.join(' ') })
      continue
    }
    const listItem = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(line)
    if (listItem) {
      const ordered = /\d/.test(listItem[2])
      const items: string[] = []
      while (i < lines.length) {
        const m = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i])
        if (!m) break
        items.push(m[3])
        i += 1
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }
    // A paragraph takes its first line whatever it looks like: no branch above claimed it, so
    // leaving it would read the same line again forever.
    const paragraph: string[] = [lines[i++]]
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3}\s|```|>|\s*([-*]|\d+\.)\s)/.test(lines[i])
    ) {
      paragraph.push(lines[i++])
    }
    blocks.push({ kind: 'paragraph', text: paragraph.join(' ') })
  }
  return blocks
}
