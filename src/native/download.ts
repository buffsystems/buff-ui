// A file on its way to the phone (#809): how much came, of how much, and how long is left — the
// words under its progress bar. Pure.
import type { Translate } from './i18n.ts'

/** A download in flight: bytes come and expected; seconds left, once the speed is known. */
export interface Download {
  done: number
  total: number
  eta?: number
}

/** «12 KB», «1.5 MB». */
export function sizeLabel(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function etaLabel(seconds: number, t: Translate): string {
  if (seconds < 1) return t('common.etaAlmost')
  if (seconds < 60) return t('common.etaSeconds', { n: Math.ceil(seconds) })
  return t('common.etaMinutes', { n: Math.ceil(seconds / 60) })
}

/** «1.2 MB из 3.4 MB · ещё ~5 с»; without an estimate yet — the sizes alone. */
export function downloadLabel(d: Download, t: Translate): string {
  // Nothing came yet is «0 KB», not the «1 KB» a file's size rounds up to.
  const done = d.done > 0 ? sizeLabel(d.done) : '0 KB'
  const sizes = t('common.downloadOf', { done, total: sizeLabel(d.total) })
  return d.eta === undefined ? sizes : `${sizes} · ${etaLabel(d.eta, t)}`
}

/** The share that came, 0…1. */
export function downloadShare(d: Download): number {
  return d.total > 0 ? Math.min(1, Math.max(0, d.done / d.total)) : 0
}
