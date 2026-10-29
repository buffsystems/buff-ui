// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { QrCode, qrModules } from '../src/react/pairing/QrCode.tsx'

const link = 'https://dev.buff.systems/pair/e5Bg8BeVMNbQb-7Wxq9Z7g#Q2hvb3NlIGEgc2VjcmV0IQ'

describe('the pairing QR (#637)', () => {
  it('is a real QR code: square, with the three finder patterns', () => {
    const m = qrModules(link)
    const n = m.length
    expect(n).toBeGreaterThanOrEqual(25)
    expect(m.every((row) => row.length === n)).toBe(true)
    // A finder pattern: a dark 7×7 ring around a dark 3×3 centre, in three corners.
    for (const [r, c] of [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ]) {
      expect(m[r]![c]).toBe(true)
      expect(m[r + 6]![c + 6]).toBe(true)
      expect(m[r + 1]![c + 1]).toBe(false)
      expect(m[r + 3]![c + 3]).toBe(true)
    }
  })
  it('encodes the value, and never shows it as text', () => {
    const { container } = render(<QrCode value={link} label="QR-код" />)
    expect(container.textContent).not.toContain('pair/')
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('QR-код')
    expect(qrModules(link)).not.toEqual(qrModules(`${link}x`))
  })
})
