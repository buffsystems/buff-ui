/*
  A small syntax highlighter for the code the screens show (#629): comments, strings,
  numbers, keywords and calls, line by line. Enough for a file viewer and a code block on a
  phone; the app may swap in a full grammar later. Pure: no React.
*/
export type TokenKind = 'comment' | 'string' | 'number' | 'keyword' | 'func' | 'plain'

export interface Token {
  kind: TokenKind
  text: string
}

const C_LIKE =
  'abstract as async await break case catch class const continue default delete do else enum export extends false finally for from function if implements import in instanceof interface let new null of package private protected public return satisfies static super switch this throw true try type typeof undefined var void while with yield'
const PY =
  'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'
const GO =
  'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false'
const SH =
  'if then else elif fi for while do done case esac in function return exit export local set'
const RUST =
  'as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while'

const KEYWORDS: Record<string, Set<string>> = {
  ts: new Set(C_LIKE.split(' ')),
  js: new Set(C_LIKE.split(' ')),
  py: new Set(PY.split(' ')),
  go: new Set(GO.split(' ')),
  sh: new Set(SH.split(' ')),
  rs: new Set(RUST.split(' ')),
}

const ALIASES: Record<string, string> = {
  typescript: 'ts',
  tsx: 'ts',
  javascript: 'js',
  jsx: 'js',
  mjs: 'js',
  python: 'py',
  golang: 'go',
  bash: 'sh',
  zsh: 'sh',
  shell: 'sh',
  rust: 'rs',
  json: 'js',
  java: 'ts',
  kotlin: 'ts',
  swift: 'ts',
  c: 'ts',
  cpp: 'ts',
}

function family(language?: string): string {
  const key = (language ?? '').toLowerCase()
  return ALIASES[key] ?? (key in KEYWORDS ? key : 'ts')
}

const LINE_COMMENT: Record<string, RegExp> = {
  py: /^#.*/,
  sh: /^#.*/,
}

const TOKEN =
  /^(?:(\/\/.*|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.))/

/** The tokens of one line of `language` code. Every character of the line lands in a token. */
export function highlightLine(line: string, language?: string): Token[] {
  const fam = family(language)
  const keywords = KEYWORDS[fam]
  const hash = LINE_COMMENT[fam]
  const tokens: Token[] = []
  let rest = line
  const push = (kind: TokenKind, text: string) => {
    const last = tokens[tokens.length - 1]
    if (last && last.kind === kind && kind === 'plain') last.text += text
    else tokens.push({ kind, text })
  }
  while (rest.length > 0) {
    if (hash) {
      const m = hash.exec(rest)
      if (m) {
        push('comment', m[0])
        break
      }
    }
    const m = TOKEN.exec(rest)
    if (!m) break
    const [all, comment, string, number, word, space, other] = m
    if (comment && fam !== 'py' && fam !== 'sh') push('comment', comment)
    else if (comment) push('plain', comment)
    else if (string) push('string', string)
    else if (number) push('number', number)
    else if (word) {
      const callee = rest.slice(word.length).startsWith('(')
      push(keywords.has(word) ? 'keyword' : callee ? 'func' : 'plain', word)
    } else push('plain', space ?? other ?? all)
    rest = rest.slice(all.length)
  }
  return tokens
}

/** Every line of `code`, tokenised. */
export function highlight(code: string, language?: string): Token[][] {
  return code
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => highlightLine(line, language))
}
