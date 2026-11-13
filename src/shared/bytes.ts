// A size in the largest unit it fills (#916): 340 MB, 2 GB, 1.5 TB — the number rounded to a tenth
// for the large units; the words of each unit are the caller's (native and web speak differently).
export type ByteUnit = 'b' | 'kb' | 'mb' | 'gb' | 'tb'

const UNITS: ByteUnit[] = ['b', 'kb', 'mb', 'gb', 'tb']

export function byteParts(bytes: number): { n: number; unit: ByteUnit } {
  let n = Math.max(0, bytes)
  let i = 0
  while (n >= 1024 && i < UNITS.length - 1) {
    n /= 1024
    i++
  }
  return { n: i >= 3 ? Math.round(n * 10) / 10 : Math.round(n), unit: UNITS[i]! }
}

/** The share of the limit used, whole percent (0 for no limit). */
export function usedPercent(bytes: number, limit: number): number {
  return limit > 0 ? Math.min(100, Math.floor((bytes * 100) / limit)) : 0
}
