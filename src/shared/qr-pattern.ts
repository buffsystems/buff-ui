/*
  A QR-looking pattern for showcases (#629/#630): finder squares in three corners and a
  deterministic noise inside. It is NOT a real code — the apps render a real one from the
  pairing payload; the web and native stand-ins draw this same grid.
*/
export const QR_CELLS = 21

function finder(x: number, y: number): boolean | null {
  const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7
  const boxes = [
    [0, 0],
    [QR_CELLS - 7, 0],
    [0, QR_CELLS - 7],
  ]
  for (const [ox, oy] of boxes) {
    if (!inBox(ox, oy)) continue
    const dx = x - ox
    const dy = y - oy
    const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
    return ring || core
  }
  return null
}

/** Whether cell (x, y) of the pattern is dark. */
export function qrCell(x: number, y: number, seed = 0): boolean {
  const f = finder(x, y)
  if (f !== null) return f
  // Quiet zone around the finders, as a real code keeps it.
  if ((x === 7 && (y < 8 || y > QR_CELLS - 9)) || (x === QR_CELLS - 8 && y < 8)) return false
  if ((y === 7 && (x < 8 || x > QR_CELLS - 9)) || (y === QR_CELLS - 8 && x < 8)) return false
  return (x * 7 + y * 13 + x * y + seed * 31) % 5 < 2
}

/** The pattern as rows of booleans. */
export function qrRows(seed = 0): boolean[][] {
  return Array.from({ length: QR_CELLS }, (_, y) =>
    Array.from({ length: QR_CELLS }, (_, x) => qrCell(x, y, seed)),
  )
}

/** The pattern as console art: two cells per character row (▀ ▄ █), for a terminal. */
export function qrAscii(seed = 0): string[] {
  const rows = qrRows(seed)
  const lines: string[] = []
  for (let y = 0; y < rows.length; y += 2) {
    let line = ''
    for (let x = 0; x < rows[y].length; x++) {
      const top = rows[y][x]
      const bottom = rows[y + 1]?.[x] ?? false
      line += top && bottom ? '█' : top ? '▀' : bottom ? '▄' : ' '
    }
    lines.push(line)
  }
  return lines
}
