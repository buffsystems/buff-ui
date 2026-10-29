/** @jsxRuntime automatic */
import qrcode from 'qrcode-generator'
import { qrRows } from '../../shared/qr-pattern.ts'

/** The modules of a real QR code for `value` (error correction M), row by row. */
export function qrModules(value: string): boolean[][] {
  const qr = qrcode(0, 'M')
  qr.addData(value)
  qr.make()
  const n = qr.getModuleCount()
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => qr.isDark(r, c)))
}

/**
 * The pairing QR (#637): a real code of `value` — what the phone's camera reads. Without a value
 * (the showcase) it draws a QR-shaped stand-in from `seed`. Always black on white, as a scanner
 * wants it, whatever the theme. The value carries the pairing secret, so it never becomes text.
 */
export function QrCode({
  size = 208,
  seed = 0,
  value,
  label,
}: {
  size?: number
  seed?: number
  value?: string
  label?: string
}) {
  const rows = value ? qrModules(value) : qrRows(seed)
  const cells = rows.length
  const cell = size / (cells + 2)
  return (
    <svg
      role="img"
      aria-label={label ?? 'QR'}
      width={size}
      height={size}
      viewBox={`0 0 ${cells + 2} ${cells + 2}`}
      style={{ background: '#ffffff', borderRadius: 8, flex: 'none' }}
    >
      {rows.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect key={`${x}-${y}`} x={x + 1} y={y + 1} width={1} height={1} fill="#0b0d12" />
          ) : null,
        ),
      )}
      <title>{label ?? 'QR'}</title>
      <desc>{`${cell.toFixed(1)}px cells`}</desc>
    </svg>
  )
}
