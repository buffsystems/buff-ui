import { describe, expect, test } from 'vitest'
import { cssRule } from './css-rule.ts'

const rule = (selector: string): string => cssRule('overlay.css', selector)

// The admin's organisation dialog grew to 454px on a 390px phone: the overlay's auto grid track
// sized itself to the content's min-content width (long names that truncate) (#561).
describe('dialog width contract', () => {
  test('the overlay track is the screen, not the content', () => {
    expect(rule('.ui-dialog-overlay')).toMatch(/grid-template-columns:\s*minmax\(0, 1fr\)/)
  })

  test('the dialog never outgrows the screen and lets its content shrink', () => {
    const dialog = rule('.ui-dialog')
    expect(dialog).toMatch(/width:\s*min\(100%, 100vw - 2rem\)/)
    expect(dialog).toMatch(/min-width:\s*0/)
    expect(rule('.ui-dialog__body')).toMatch(/min-width:\s*0/)
  })

  test('the sizes still cap the width on a wide screen', () => {
    expect(rule('.ui-dialog--lg')).toMatch(/max-width:\s*42rem/)
  })
})
